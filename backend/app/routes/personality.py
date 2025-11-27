"""
Personality Test FastAPI router.
"""

import json
import os
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from openai import AzureOpenAI

from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.profile import Patient, Guardian, Caregiver
from app.models.care_details import PatientPersonality, CaregiverPersonality
from app.schemas.personality import (
    PersonalityTestRequest, 
    PatientPersonalityResponse, 
    CaregiverPersonalityResponse
)

router = APIRouter(prefix="/personality", tags=["Personality"])

@router.post("/tests", status_code=status.HTTP_201_CREATED)
async def create_personality_test(
    request: PersonalityTestRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    성향 테스트 결과 저장 및 AI 분석
    
    1. 사용자 유형 확인 (guardian -> patient, caregiver -> caregiver)
    2. Azure OpenAI로 답변 분석하여 점수 추출
    3. DB에 저장 또는 업데이트
    """

    # 1. 대상 엔티티 확인
    target_entity = None
    personality_model = None
    entity_id_field = None
    
    if request.user_type == "guardian":
        # 보호자의 경우 연결된 환자를 찾음 (첫 번째 환자라고 가정하거나 로직 보완 필요)
        # 여기서는 보호자가 등록한 첫 번째 환자를 대상으로 함
        guardian = db.query(Guardian).filter(Guardian.user_id == current_user.user_id).first()
        if not guardian:
            raise HTTPException(status_code=404, detail="Guardian profile not found")
            
        target_entity = db.query(Patient).filter(Patient.guardian_id == guardian.guardian_id).first()
        if not target_entity:
            raise HTTPException(status_code=404, detail="Patient profile not found. Please register a patient first.")
            
        personality_model = PatientPersonality
        entity_id_field = "patient_id"
        
    elif request.user_type == "caregiver":
        target_entity = db.query(Caregiver).filter(Caregiver.user_id == current_user.user_id).first()
        if not target_entity:
            raise HTTPException(status_code=404, detail="Caregiver profile not found")
            
        personality_model = CaregiverPersonality
        entity_id_field = "caregiver_id"
    else:
        raise HTTPException(status_code=400, detail="Invalid user type")

    # 2. Azure OpenAI로 점수 계산 및 분석
    try:
        client = AzureOpenAI(
            api_key=os.getenv("AZURE_OPENAI_API_KEY"),
            api_version=os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview"),
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
        )

        prompt = f"""
        Analyze the following personality test answers and calculate 4 personality scores (0-100).
        
        Answers:
        {json.dumps(request.answers, ensure_ascii=False)}

        Required Output JSON Format:
        {{
            "empathy_score": <float 0-100>,
            "activity_score": <float 0-100>,
            "patience_score": <float 0-100>,
            "independence_score": <float 0-100>,
            "analysis": "<Detailed analysis text in Korean>"
        }}
        """

        response = client.chat.completions.create(
            model=os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4o"),
            messages=[
                {"role": "system", "content": "You are an expert psychologist AI."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )

        result_content = response.choices[0].message.content
        result = json.loads(result_content)
        
    except Exception as e:
        print(f"Azure OpenAI Error: {e}")
        # AI 분석 실패 시 기본값 또는 에러 처리 (여기서는 에러 반환)
        raise HTTPException(status_code=500, detail=f"AI Analysis failed: {str(e)}")

    # 3. DB에 저장 또는 업데이트
    # 해당 엔티티의 기존 성향 정보가 있는지 확인
    entity_id = getattr(target_entity, entity_id_field)
    
    personality_record = db.query(personality_model).filter(
        getattr(personality_model, entity_id_field) == entity_id
    ).first()

    if not personality_record:
        # 새로 생성
        personality_data = {
            entity_id_field: entity_id,
            "empathy_score": result.get('empathy_score', 50.0),
            "activity_score": result.get('activity_score', 50.0),
            "patience_score": result.get('patience_score', 50.0),
            "independence_score": result.get('independence_score', 50.0),
            # "raw_test_answers": request.answers, # 모델에 필드가 있다면 추가
            # "ai_analysis_text": result.get('analysis', "") # 모델에 필드가 있다면 추가
        }
        
        # 모델에 해당 필드가 있는지 확인 후 추가 (안전하게)
        if hasattr(personality_model, 'raw_test_answers'):
            personality_data['raw_test_answers'] = request.answers
        if hasattr(personality_model, 'ai_analysis_text'):
            personality_data['ai_analysis_text'] = result.get('analysis', "")
            
        personality_record = personality_model(**personality_data)
        db.add(personality_record)
    else:
        # 업데이트
        personality_record.empathy_score = result.get('empathy_score', 50.0)
        personality_record.activity_score = result.get('activity_score', 50.0)
        personality_record.patience_score = result.get('patience_score', 50.0)
        personality_record.independence_score = result.get('independence_score', 50.0)
        
        if hasattr(personality_model, 'raw_test_answers'):
            personality_record.raw_test_answers = request.answers
        if hasattr(personality_model, 'ai_analysis_text'):
            personality_record.ai_analysis_text = result.get('analysis', "")

    db.commit()
    db.refresh(personality_record)

    # 응답 반환 (타입에 따라 다르게)
    if request.user_type == "guardian":
        return PatientPersonalityResponse.model_validate(personality_record)
    else:
        return CaregiverPersonalityResponse.model_validate(personality_record)
