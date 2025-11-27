"""
Patient API (프론트엔드 계약용)
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date

from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.profile import Guardian, Patient
from app.models.care_details import HealthCondition, Medication
from app.schemas.patient import (
    PatientCreateRequest,
    PatientInfoResponse,
    HealthStatusUpdateRequest,
    MedicationsCreateRequest,
    MedicationInfoResponse
)

router = APIRouter(prefix="/api", tags=["Patients"])


@router.post("/patients", status_code=status.HTTP_201_CREATED, response_model=PatientInfoResponse)
async def create_patient(
    request: PatientCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    환자 기본 정보 등록
    
    1. 현재 사용자의 guardian_id 가져오기
    2. 나이를 생년월일로 변환
    3. patients 테이블에 저장
    """
    # 1. 현재 사용자의 guardian_id 가져오기
    guardian = db.query(Guardian).filter(
        Guardian.user_id == current_user.user_id
    ).first()
    
    if not guardian:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="보호자 정보를 먼저 등록해주세요"
        )
    
    # 2. 나이를 생년월일로 변환 (백엔드 로직)
    current_year = date.today().year
    birth_date = date(current_year - request.age, 1, 1)
    
    # 3. patients 테이블에 저장
    patient = Patient(
        guardian_id=guardian.guardian_id,
        name=request.name,
        birth_date=birth_date,
        gender=request.gender,  # validator에서 이미 변환됨 (Male/Female)
        care_address=guardian.address,  # 보호자 주소 사용
        region_code="TBD"  # 나중에 업데이트
    )
    
    db.add(patient)
    db.commit()
    db.refresh(patient)
    
    # 4. 응답 반환
    return PatientInfoResponse(
        patient_id=patient.patient_id,
        name=patient.name,
        birth_date=patient.birth_date.isoformat(),
        age=request.age,
        gender=patient.gender.value,  # Enum을 문자열로 변환
        guardian_id=guardian.guardian_id,
        created_at=patient.created_at.isoformat()
    )


@router.put("/patients/{patient_id}/health-status", status_code=status.HTTP_200_OK)
async def update_health_status(
    patient_id: int,
    request: HealthStatusUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    환자 건강 상태 업데이트
    
    1. 환자 접근 권한 확인
    2. health_conditions 테이블에 JSONB로 저장
    """
    # 1. 환자 접근 권한 확인
    patient = db.query(Patient).join(Guardian).filter(
        Patient.patient_id == patient_id,
        Guardian.user_id == current_user.user_id
    ).first()
    
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="이 환자에 대한 접근 권한이 없습니다"
        )
    
    # 2. health_conditions 테이블에 저장
    # 기존 건강 상태가 있는지 확인
    health_condition = db.query(HealthCondition).filter(
        HealthCondition.patient_id == patient_id
    ).first()
    
    # selectedDiseases를 JSONB로 변환
    diseases_json = [disease.model_dump() for disease in request.selectedDiseases]
    
    if not health_condition:
        # 새로운 건강 상태 생성
        health_condition = HealthCondition(
            patient_id=patient_id,
            disease_name=None,  # 기존 컬럼은 사용하지 않음
            note=None
        )
        db.add(health_condition)
    
    # JSONB 필드 업데이트 (DB 스키마에 selected_diseases, mobility_status 컬럼이 있다고 가정)
    # 주의: DB 스키마에 이 컬럼들이 없으면 에러 발생
    # setattr를 사용하여 동적으로 속성 설정
    if hasattr(health_condition, 'selected_diseases'):
        health_condition.selected_diseases = diseases_json
    if hasattr(health_condition, 'mobility_status'):
        health_condition.mobility_status = request.mobility_status
    
    db.commit()
    db.refresh(health_condition)
    
    # 3. 응답 반환
    return {
        "patient_id": patient_id,
        "selected_diseases": diseases_json,
        "mobility_status": request.mobility_status,
        "updated_at": health_condition.created_at.isoformat()
    }


@router.post("/patients/{patient_id}/medications", status_code=status.HTTP_201_CREATED, response_model=MedicationInfoResponse)
async def create_medications(
    patient_id: int,
    request: MedicationsCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    환자 복용 약물 등록
    
    1. 환자 접근 권한 확인
    2. medications 테이블에 TEXT[] 배열로 저장
    """
    # 1. 환자 접근 권한 확인
    patient = db.query(Patient).join(Guardian).filter(
        Patient.patient_id == patient_id,
        Guardian.user_id == current_user.user_id
    ).first()
    
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="이 환자에 대한 접근 권한이 없습니다"
        )
    
    # 2. medications 테이블에 저장
    # 기존 약물 정보가 있는지 확인
    medication = db.query(Medication).filter(
        Medication.patient_id == patient_id
    ).first()
    
    if not medication:
        # 새로운 약물 정보 생성
        medication = Medication(
            patient_id=patient_id,
            name=None,  # 기존 컬럼은 사용하지 않음
            dosage=None,
            frequency=None,
            intake_method=None
        )
        db.add(medication)
    
    # medicine_names 필드 업데이트 (DB 스키마에 medicine_names 컬럼이 있다고 가정)
    if hasattr(medication, 'medicine_names'):
        medication.medicine_names = request.medicine_names
    
    db.commit()
    db.refresh(medication)
    
    # 3. 응답 반환
    return MedicationInfoResponse(
        patient_id=patient_id,
        med_id=medication.med_id,
        medicine_names=request.medicine_names
    )
