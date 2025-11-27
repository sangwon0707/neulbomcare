"""
Matching (CaregiverAvailability, MatchingRequest, MatchingResult) FastAPI router.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies.database import get_db

# CaregiverAvailability imports
from app.schemas.matching import (
    CaregiverAvailabilityCreate,
    CaregiverAvailabilityUpdate,
    CaregiverAvailabilityResponse,
)
from app.crud.matching import (
    get_availability,
    get_availabilities,
    create_availability,
    update_availability,
    delete_availability,
)

# MatchingRequest imports
from app.schemas.matching import (
    MatchingRequestCreate,
    MatchingRequestUpdate,
    MatchingRequestResponse,
)
from app.crud.matching import (
    get_matching_request,
    get_matching_requests,
    create_matching_request,
    update_matching_request,
    delete_matching_request,
)

# MatchingResult imports
from app.schemas.matching import (
    MatchingResultCreate,
    MatchingResultUpdate,
    MatchingResultResponse,
    MatchingRequestCreateAI,  # AI 매칭용 스키마
)
from app.crud.matching import (
    get_matching_result,
    get_matching_results,
    create_matching_result,
    update_matching_result,
    delete_matching_result,
)

router = APIRouter(prefix="/matching", tags=["Matching"])

# ---------------------------------------------------------------------------
# CaregiverAvailability endpoints
# ---------------------------------------------------------------------------

@router.get("/availability", response_model=list[CaregiverAvailabilityResponse])
def list_availability(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_availabilities(db, skip=skip, limit=limit)


@router.get("/availability/{availability_id}", response_model=CaregiverAvailabilityResponse)
def read_availability(availability_id: int, db: Session = Depends(get_db)):
    av = get_availability(db, availability_id)
    if not av:
        raise HTTPException(status_code=404, detail="Availability not found")
    return av


@router.post("/availability", response_model=CaregiverAvailabilityResponse, status_code=status.HTTP_201_CREATED)
def create_new_availability(payload: CaregiverAvailabilityCreate, db: Session = Depends(get_db)):
    return create_availability(db, payload)


@router.put("/availability/{availability_id}", response_model=CaregiverAvailabilityResponse)
def update_existing_availability(availability_id: int, payload: CaregiverAvailabilityUpdate, db: Session = Depends(get_db)):
    av = get_availability(db, availability_id)
    if not av:
        raise HTTPException(status_code=404, detail="Availability not found")
    return update_availability(db, av, payload)


@router.delete("/availability/{availability_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_availability(availability_id: int, db: Session = Depends(get_db)):
    av = get_availability(db, availability_id)
    if not av:
        raise HTTPException(status_code=404, detail="Availability not found")
    delete_availability(db, availability_id)
    return None

# ---------------------------------------------------------------------------
# MatchingRequest endpoints
# ---------------------------------------------------------------------------

@router.get("/requests", response_model=list[MatchingRequestResponse])
def list_requests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_matching_requests(db, skip=skip, limit=limit)


@router.get("/requests/{request_id}", response_model=MatchingRequestResponse)
def read_request(request_id: int, db: Session = Depends(get_db)):
    req = get_matching_request(db, request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Matching request not found")
    return req


@router.post("/requests", response_model=MatchingRequestResponse, status_code=status.HTTP_201_CREATED)
def create_new_request(payload: MatchingRequestCreate, db: Session = Depends(get_db)):
    return create_matching_request(db, payload)


@router.put("/requests/{request_id}", response_model=MatchingRequestResponse)
def update_existing_request(request_id: int, payload: MatchingRequestUpdate, db: Session = Depends(get_db)):
    req = get_matching_request(db, request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Matching request not found")
    return update_matching_request(db, req, payload)


@router.delete("/requests/{request_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_request(request_id: int, db: Session = Depends(get_db)):
    req = get_matching_request(db, request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Matching request not found")
    delete_matching_request(db, request_id)
    return None


# ---------------------------------------------------------------------------
# Matching Logic endpoints
# ---------------------------------------------------------------------------

from app.models.profile import Caregiver, Patient, Guardian
from app.models.user import User, UserGenderEnum
from app.models.care_details import PatientPersonality, CaregiverPersonality
from app.models.matching import MatchingResult
from app.dependencies.auth import get_current_user
from typing import List

def calculate_match_score(patient_p, caregiver_p) -> float:
    """간단한 매칭 점수 계산 (ONNX 모델 연동 예정)"""
    score = 0.0
    
    # 각 항목의 차이 계산 (작을수록 좋음)
    empathy_diff = abs(patient_p.empathy_score - caregiver_p.empathy_score)
    activity_diff = abs(patient_p.activity_score - caregiver_p.activity_score)
    patience_diff = abs(patient_p.patience_score - caregiver_p.patience_score)
    independence_diff = abs(patient_p.independence_score - caregiver_p.independence_score)
    
    # 100점에서 차감하는 방식 (가중치는 모두 0.25로 동일하게 설정)
    score = 100 - (empathy_diff * 0.25 + activity_diff * 0.25 + 
                   patience_diff * 0.25 + independence_diff * 0.25)
                   
    return round(max(0.0, score), 2) # 0점 미만 방지

@router.post("", status_code=status.HTTP_201_CREATED, response_model=List[MatchingResultResponse])
async def create_matching(
    request: MatchingRequestCreateAI,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    간병인 매칭 요청 및 결과 생성
    
    1. 환자 성향 정보 확인
    2. 조건에 맞는 간병인 필터링 (경력, 자격증, 성별)
    3. 성향 점수 기반 매칭 점수 계산
    4. 결과 저장 및 반환
    """
    
    # 0. 권한 확인 (환자의 보호자인지)
    patient = db.query(Patient).join(Guardian).filter(
        Patient.patient_id == request.patient_id,
        Guardian.user_id == current_user.user_id
    ).first()
    
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to request matching for this patient"
        )

    # 1. 환자 성향 가져오기
    patient_personality = db.query(PatientPersonality).filter(
        PatientPersonality.patient_id == request.patient_id
    ).first()
    
    if not patient_personality:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Patient personality test results not found. Please complete the test first."
        )

    # 2. 조건에 맞는 간병인 필터링
    query = db.query(Caregiver).join(User)
    
    # 경력 필터
    if request.requirements.experience == "5plus":
        query = query.filter(Caregiver.experience_years >= 5)
    elif request.requirements.experience == "3-5":
        query = query.filter(
            Caregiver.experience_years >= 3,
            Caregiver.experience_years < 5
        )
        
    # 스킬 필터 (specialties 배열에 포함되어 있는지 확인)
    # PostgreSQL의 배열 연산자 사용 (SQLAlchemy)
    if request.requirements.skills:
        for skill in request.requirements.skills:
            # contains 연산자는 배열이 해당 요소를 포함하는지 확인
            query = query.filter(Caregiver.specialties.contains([skill]))
            
    # 성별 필터
    if request.requirements.gender and request.requirements.gender != UserGenderEnum.any:
        query = query.filter(User.gender == request.requirements.gender)
        
    caregivers = query.all()
    
    if not caregivers:
        return [] # 조건에 맞는 간병인이 없음

    # 3. AI 매칭 점수 계산
    matches = []
    
    # 매칭 요청 저장 (이력 관리용)
    # create_matching_request(db, request) # 필요하다면 저장 로직 추가
    
    for caregiver in caregivers:
        caregiver_personality = db.query(CaregiverPersonality).filter(
            CaregiverPersonality.caregiver_id == caregiver.caregiver_id
        ).first()
        
        if not caregiver_personality:
            continue # 성향 정보가 없는 간병인은 제외
            
        match_score = calculate_match_score(
            patient_personality,
            caregiver_personality
        )
        
        # 등급 결정
        if match_score >= 90:
            grade = "A+"
        elif match_score >= 85:
            grade = "A"
        elif match_score >= 80:
            grade = "B+"
        elif match_score >= 75:
            grade = "B"
        else:
            grade = "C"
            
        # 매칭 결과 객체 생성 (아직 DB 저장 전)
        # MatchingResult 모델에 request_id가 필수라면 먼저 MatchingRequest를 생성해야 함
        # 현재 구조상 MatchingRequestCreate에는 request_id가 없음 (DB 자동생성)
        # 여기서는 편의상 MatchingResult를 바로 생성하지만, 
        # 실제로는 MatchingRequest를 먼저 생성하고 그 ID를 사용하는 것이 정석임.
        
        # 임시로 request_id 없이 진행하거나, MatchingRequest를 먼저 생성
        # 여기서는 MatchingRequest 생성 로직이 생략되어 있으므로, 
        # MatchingResult 모델의 request_id가 nullable인지 확인 필요.
        # 만약 NOT NULL이라면 MatchingRequest를 먼저 생성해야 함.
        
        matches.append({
            "caregiver": caregiver,
            "score": match_score,
            "grade": grade
        })
        
    # 점수 순으로 정렬
    matches.sort(key=lambda x: x["score"], reverse=True)
    
    # 상위 10개만 저장 및 반환
    top_matches = matches[:10]
    saved_results = []
    
    # MatchingRequest 생성 (한 번만)
    from app.models.matching import MatchingRequest
    
    # requirements를 dict로 변환 (JSON 저장을 위해)
    requirements_dict = request.requirements.dict()
    # Enum 객체는 JSON 직렬화가 안되므로 문자열로 변환
    if 'gender' in requirements_dict and requirements_dict['gender']:
        requirements_dict['gender'] = requirements_dict['gender'].value
        
    new_request = MatchingRequest(
        patient_id=request.patient_id,
        requirements=requirements_dict,
        status="completed"
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    
    for m in top_matches:
        matching_result = MatchingResult(
            request_id=new_request.request_id,
            patient_id=request.patient_id,
            caregiver_id=m["caregiver"].caregiver_id,
            match_score=m["score"],
            grade=m["grade"],
            status="recommended"
        )
        db.add(matching_result)
        # 리스트에 추가하기 위해 commit 전 flush 또는 객체 유지
        saved_results.append(matching_result)
        
    db.commit()
    
    # 저장된 객체들 refresh
    for res in saved_results:
        db.refresh(res)
        
    return saved_results

# ---------------------------------------------------------------------------
# MatchingResult endpoints
# ---------------------------------------------------------------------------

@router.get("/results", response_model=list[MatchingResultResponse])
def list_results(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_matching_results(db, skip=skip, limit=limit)


@router.get("/results/{result_id}", response_model=MatchingResultResponse)
def read_result(result_id: int, db: Session = Depends(get_db)):
    res = get_matching_result(db, result_id)
    if not res:
        raise HTTPException(status_code=404, detail="Matching result not found")
    return res


# @router.post("/results", ...)  <- 위에서 구현한 create_matching이 대체하므로 제거하거나 유지


@router.put("/results/{result_id}", response_model=MatchingResultResponse)
def update_existing_result(result_id: int, payload: MatchingResultUpdate, db: Session = Depends(get_db)):
    res = get_matching_result(db, result_id)
    if not res:
        raise HTTPException(status_code=404, detail="Matching result not found")
    return update_matching_result(db, res, payload)


@router.delete("/results/{result_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_result(result_id: int, db: Session = Depends(get_db)):
    res = get_matching_result(db, result_id)
    if not res:
        raise HTTPException(status_code=404, detail="Matching result not found")
    delete_matching_result(db, result_id)
    return None
