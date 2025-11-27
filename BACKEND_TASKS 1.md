# 백엔드 개발자 Task List

> **담당**: 백엔드 개발자
> **기간**: 2025-11-26 ~ (TBD)
> **참고 문서**: `API_CONTRACT.md`, `늘봄케어_API_엔드포인트_설계.md`, `DB_SCHEMA_MIGRATION.md` (최신화)

---

## 📋 개발 우선순위

### 🔴 P0 (최우선 - 1주차)

환자 등록 플로우에 필요한 필수 API

### 🟡 P1 (중요 - 2주차)

매칭 및 성향 테스트 API

### 🟢 P2 (일반 - 3주차)

케어 플랜 및 마이페이지 API

---

## Phase 1: 환경 설정 및 기반 작업

### 1.1 DB 스키마 수정 (최신화)

**우선순위**: 🔴 P0
**예상 시간**: 1시간

#### Task

`DB_SCHEMA_MIGRATION.md` 파일을 참조하여 아래 SQL을 실행합니다.

```sql
-- 1. health_conditions 테이블 수정 (질병 정보)
ALTER TABLE health_conditions DROP COLUMN IF EXISTS disease_name;
ALTER TABLE health_conditions ADD COLUMN selected_diseases JSONB; -- [{"id": "...", "name": "..."}]
ALTER TABLE health_conditions ADD COLUMN mobility_status VARCHAR(50); -- independent, assistive-device...

-- 2. medications 테이블 수정 (투약 정보)
ALTER TABLE medications DROP COLUMN IF EXISTS name;
ALTER TABLE medications DROP COLUMN IF EXISTS notes; -- 만약 notes 컬럼이 존재한다면
ALTER TABLE medications ADD COLUMN medicine_names TEXT[]; -- ["약1", "약2"]

-- 3. users 테이블 수정 (성별)
-- user_gender_enum 타입이 없다면 생성
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_gender_enum') THEN
        CREATE TYPE user_gender_enum AS ENUM ('Male', 'Female');
    END IF;
END$$;

ALTER TABLE users ADD COLUMN IF NOT EXISTS gender user_gender_enum;
```

#### 체크리스트

- [ ] Azure PostgreSQL 접속 확인
- [ ] 스키마 변경 SQL 실행
- [ ] `health_conditions.selected_diseases`에 GIN 인덱스 생성
- [ ] `medications.medicine_names`에 GIN 인덱스 생성
- [ ] `users.gender`에 인덱스 생성
- [ ] 기존 데이터 영향도 검증

---

### 1.2 Pydantic 스키마 작성 (최신화)

**우선순위**: 🔴 P0
**예상 시간**: 2시간
**파일**: `backend/app/schemas/`

#### Task

다음 Pydantic 모델 작성:

**보호자 관련** (`backend/app/schemas/guardian.py`):
```python
from pydantic import BaseModel, Field
from datetime import datetime
from app.models.profile import GenderEnum # GenderEnum은 profile.py 또는 공통 enums.py에서 가져옴

class GuardianCreateRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=50, description="보호자 이름")
    phone: str = Field(..., pattern=r'^010-\d{4}-\d{4}$', description="연락처")
    address: str = Field(..., min_length=1, max_length=255, description="주소")
    relationship: str = Field(..., description="환자와의 관계")

class GuardianResponse(BaseModel):
    guardian_id: int
    user_id: int
    name: str
    phone: str
    address: str
    relationship: str
    created_at: datetime

    class Config:
        from_attributes = True
```

**환자 관련** (`backend/app/schemas/patient.py`):
```python
from pydantic import BaseModel, Field, validator
from datetime import date
from typing import List, Optional
from app.models.user import UserGenderEnum # users 모델에서 정의한 Gender Enum 사용

class DiseaseItem(BaseModel): # 새로운 질병 항목 스키마 정의
    id: str
    name: str

class PatientCreateRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    age: int = Field(..., ge=0, le=150, description="환자 나이")
    gender: UserGenderEnum # UserGenderEnum 사용
    relationship: str = Field(..., description="보호자와의 관계")

    # DB에 birth_date로 저장하기 위한 로직은 백엔드 서비스 레이어에서 처리
    # Pydantic 스키마에서는age를 직접 받음

class HealthStatusUpdateRequest(BaseModel): # health_conditions 테이블 구조 변경 반영
    selected_diseases: List[DiseaseItem] = Field(default_factory=list, description="선택된 질병 목록")
    mobility_status: str = Field(..., description="거동 상태") # independent, assistive-device, wheelchair, bedridden

class MedicationsCreateRequest(BaseModel): # medications 테이블 구조 변경 반영
    medicine_names: List[str] = Field(..., min_items=1, description="약물 목록")

```

**성향 테스트** (`backend/app/schemas/personality.py`):
```python
from pydantic import BaseModel, Field
from typing import Dict

class PersonalityTestRequest(BaseModel):
    user_type: str = Field(..., pattern=r'^(guardian|caregiver)$')
    answers: Dict[str, str] = Field(..., description="단계별 응답")
```

**매칭** (`backend/app/schemas/matching.py`):
```python
from pydantic import BaseModel
from typing import List
from app.models.user import UserGenderEnum # 사용자 성별 Enum 사용

class MatchingRequirements(BaseModel):
    care_type: str
    time_slots: List[str]
    gender: Optional[UserGenderEnum] = None # 성별 필터링 옵션
    experience: str
    skills: List[str]

class MatchingRequest(BaseModel):
    patient_id: int
    requirements: MatchingRequirements
```

#### 체크리스트

- [ ] `backend/app/schemas/guardian.py` 작성
- [ ] `backend/app/schemas/patient.py` 수정 (HealthStatusUpdateRequest, MedicationsCreateRequest)
- [ ] `backend/app/schemas/personality.py` 작성
- [ ] `backend/app/schemas/matching.py` 수정 (gender 필드)
- [ ] `backend/app/schemas/user.py` 수정 (User 모델에 gender 필드 추가)
- [ ] `backend/app/schemas/__init__.py` 업데이트

---

### 1.3 공통 응답 포맷 구현

**우선순위**: 🔴 P0
**예상 시간**: 1시간
**파일**: `backend/app/core/response.py`

#### Task

```python
from typing import Any, Optional
from pydantic import BaseModel

class SuccessResponse(BaseModel):
    status: str = "success"
    data: Any
    message: str

class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[dict] = None

class ErrorResponse(BaseModel):
    status: str = "error"
    error: ErrorDetail

def success_response(data: Any, message: str) -> dict:
    """성공 응답 생성"""
    return {
        "status": "success",
        "data": data,
        "message": message
    }

def error_response(code: str, message: str, details: dict = None) -> dict:
    """에러 응답 생성"""
    return {
        "status": "error",
        "error": {
            "code": code,
            "message": message,
            "details": details
        }
    }
```

#### 에러 핸들러 등록

**파일**: `backend/main.py`

```python
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.core.response import error_response
from app.core.exception import CustomException # HTTP Exception을 위한 커스텀 예외

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=error_response(
            code="VALIDATION_ERROR",
            message="입력값이 올바르지 않습니다.",
            details=exc.errors()
        )
    )

@app.exception_handler(CustomException) # FastAPI HTTPException 대신 CustomException 사용
async def custom_exception_handler(request: Request, exc: CustomException):
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response(
            code=exc.code,
            message=exc.message,
            details=exc.details
        )
    )
```

#### 체크리스트

- [ ] `backend/app/core/response.py` 작성
- [ ] `backend/main.py`에 에러 핸들러 등록
- [ ] 테스트용 엔드포인트로 응답 형식 검증

---

## Phase 2: 보호자 & 환자 등록 API (P0)

### 2.1 보호자 정보 등록 API

**우선순위**: 🔴 P0
**예상 시간**: 2시간
**엔드포인트**: `POST /api/guardians`

#### Task

**파일**: `backend/app/routes/guardians.py`

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User, UserGenderEnum # User 모델에서 UserGenderEnum 가져옴
from app.models.profile import Guardian
from app.schemas.guardian import GuardianCreateRequest, GuardianResponse
from app.core.response import success_response
from app.core.security import get_current_user # security.py에서 get_current_user 가져옴

router = APIRouter(prefix="/api", tags=["guardians"])

@router.post("/guardians", status_code=201, response_model=GuardianResponse)
async def create_guardian(
    request: GuardianCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """보호자 정보 등록"""

    # 1. users 테이블 업데이트 (name, phone_number)
    user = db.query(User).filter(User.user_id == current_user.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다")

    user.name = request.name
    user.phone_number = request.phone
    # user.gender = UserGenderEnum.Male (예시, 만약 이 단계에서 성별을 입력받는다면)

    # 2. guardians 테이블에 저장
    guardian = Guardian(
        user_id=user.user_id,
        address=request.address,
        relationship_to_patient=request.relationship
    )

    db.add(guardian)
    db.commit()
    db.refresh(user) # user 객체도 새로고침
    db.refresh(guardian)

    return success_response(
        data={
            "guardian_id": guardian.guardian_id,
            "user_id": user.user_id,
            "name": user.name,
            "phone": user.phone_number,
            "address": guardian.address,
            "relationship": guardian.relationship_to_patient,
            "created_at": guardian.created_at
        },
        message="보호자 정보가 등록되었습니다."
    )

@router.get("/guardians/me", response_model=GuardianResponse)
async def get_my_guardian_info(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """내 보호자 정보 조회"""

    guardian = db.query(Guardian).filter(
        Guardian.user_id == current_user.user_id
    ).first()

    if not guardian:
        raise HTTPException(status_code=404, detail="보호자 정보가 없습니다")

    return success_response(
        data={
            "guardian_id": guardian.guardian_id,
            "user_id": current_user.user_id,
            "name": current_user.name,
            "phone": current_user.phone_number,
            "address": guardian.address,
            "relationship": guardian.relationship_to_patient
        },
        message=""
    )
```

#### 체크리스트

- [ ] `backend/app/routes/guardians.py` 작성
- [ ] `backend/main.py`에 라우터 등록
- [ ] Postman으로 POST /api/guardians 테스트
- [ ] Postman으로 GET /api/guardians/me 테스트

---

### 2.2 환자 기본 정보 등록 API

**우선순위**: 🔴 P0
**예상 시간**: 2시간
**엔드포인트**: `POST /api/patients`

#### Task

**파일**: `backend/app/routes/patients.py`

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.profile import Guardian, Patient
from app.schemas.patient import PatientCreateRequest, PatientResponse
from app.core.response import success_response
from app.core.security import get_current_user
from datetime import date

router = APIRouter(prefix="/api", tags=["patients"])

@router.post("/patients", status_code=201, response_model=PatientResponse)
async def create_patient(
    request: PatientCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """환자 기본 정보 등록"""

    # 1. 현재 사용자의 guardian_id 가져오기
    guardian = db.query(Guardian).filter(
        Guardian.user_id == current_user.user_id
    ).first()

    if not guardian:
        raise HTTPException(
            status_code=404,
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
        gender=request.gender,  # UserGenderEnum (Male/Female)
        care_address=guardian.address, # 보호자 주소 사용
        region_code="TBD"  # 나중에 업데이트 (예: 주소 기반 지역 코드 추출)
    )

    db.add(patient)
    db.commit()
    db.refresh(patient)

    return success_response(
        data=PatientResponse.model_validate(patient).model_dump(),
        message="환자 정보가 등록되었습니다."
    )
```

#### 체크리스트

- [ ] `backend/app/routes/patients.py` 작성
- [ ] `UserGenderEnum` import 및 사용 확인
- [ ] 나이 → 생년월일 변환 로직 검증
- [ ] Postman 테스트

---

### 2.3 환자 건강 상태 업데이트 API (최신화)

**우선순위**: 🔴 P0
**예상 시간**: 1.5시간
**엔드포인트**: `PUT /api/patients/{patient_id}/health-status`

#### Task

**파일**: `backend/app/routes/care_details.py` (또는 `patients.py`에 통합)

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.profile import Patient
from app.models.care_details import HealthCondition # HealthCondition 모델 임포트
from app.schemas.patient import HealthStatusUpdateRequest # 변경된 스키마 임포트
from app.schemas.health import HealthConditionResponse # 응답 스키마
from app.core.response import success_response
from app.core.security import get_current_user
from typing import List

router = APIRouter(prefix="/api", tags=["patients"])

async def verify_patient_access(
    patient_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Patient:
    """환자에 대한 접근 권한 확인"""
    patient = db.query(Patient).join(Guardian).filter(
        Patient.patient_id == patient_id,
        Guardian.user_id == current_user.user_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=403,
            detail="이 환자에 대한 접근 권한이 없습니다"
        )
    return patient

@router.put("/patients/{patient_id}/health-status", response_model=HealthConditionResponse)
async def update_health_status(
    patient_id: int,
    request: HealthStatusUpdateRequest,
    patient: Patient = Depends(verify_patient_access),
    db: Session = Depends(get_db)
):
    """환자 건강 상태 업데이트 (HealthCondition 테이블)"""

    # 기존 HealthCondition이 있는지 확인하고 없으면 새로 생성
    health_condition = db.query(HealthCondition).filter(
        HealthCondition.patient_id == patient_id
    ).first()

    if not health_condition:
        health_condition = HealthCondition(patient_id=patient_id)
        db.add(health_condition)

    health_condition.selected_diseases = request.selected_diseases # JSONB로 저장
    health_condition.mobility_status = request.mobility_status

    db.commit()
    db.refresh(health_condition)

    return success_response(
        data=HealthConditionResponse.model_validate(health_condition).model_dump(),
        message="건강 상태가 업데이트되었습니다."
    )
```

#### 체크리스트

- [ ] `verify_patient_access` 의존성 함수 작성
- [ ] `HealthCondition` 모델 사용 확인
- [ ] `selected_diseases` (JSONB) 및 `mobility_status` 저장 검증
- [ ] `HealthConditionResponse` 스키마로 응답 모델링
- [ ] Postman 테스트

---

### 2.4 환자 복용 약물 등록 API (최신화)

**우선순위**: 🔴 P0
**예상 시간**: 1.5시간
**엔드포인트**: `POST /api/patients/{patient_id}/medications`

#### Task

**파일**: `backend/app/routes/care_details.py` (또는 `patients.py`에 통합)

```python
from app.models.care_details import Medication # Medication 모델 임포트
from app.schemas.patient import MedicationsCreateRequest # 변경된 스키마 임포트
from app.schemas.health import MedicationResponse # 응답 스키마

@router.post("/patients/{patient_id}/medications", status_code=201)
async def create_medications(
    patient_id: int,
    request: MedicationsCreateRequest,
    patient: Patient = Depends(verify_patient_access),
    db: Session = Depends(get_db)
):
    """환자 복용 약물 등록 (Medication 테이블)"""

    # 기존 Medication이 있는지 확인하고 없으면 새로 생성
    medication = db.query(Medication).filter(
        Medication.patient_id == patient_id
    ).first()

    if not medication:
        medication = Medication(patient_id=patient_id)
        db.add(medication)

    medication.medicine_names = request.medicine_names # TEXT[]로 저장

    db.commit()
    db.refresh(medication)

    return success_response(
        data={
            "patient_id": patient_id,
            "med_id": medication.med_id,
            "medicine_names": medication.medicine_names
        },
        message="약물 정보가 등록되었습니다."
    )
```

#### 체크리스트

- [ ] `Medication` 모델 사용 확인
- [ ] `medicine_names` (TEXT[]) 저장 로직 구현
- [ ] `notes` 필드 제거 확인
- [ ] Postman 테스트

---

## Phase 3: 성향 테스트 & 매칭 API (P1)

### 3.1 성향 테스트 API

**우선순위**: 🟡 P1
**예상 시간**: 4시간
**엔드포인트**: `POST /api/personality-tests`

#### Task

**파일**: `backend/app/routes/personality.py`

```python
import json
import os
from openai import AzureOpenAI
from app.models.user import User # User 모델 임포트
from app.models.profile import Patient, Caregiver # Patient, Caregiver 모델 임포트
from app.models.care_details import PatientPersonality, CaregiverPersonality # PatientPersonality, CaregiverPersonality 임포트
from app.schemas.personality import PersonalityTestRequest, PersonalityTestResponse # 스키마 임포트
from app.core.response import success_response
from app.core.security import get_current_user # security.py에서 get_current_user 가져옴
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db

router = APIRouter(prefix="/api", tags=["personality"])

@router.post("/personality-tests", status_code=201, response_model=PersonalityTestResponse)
async def create_personality_test(
    request: PersonalityTestRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """성향 테스트 결과 저장 및 AI 분석"""

    # 현재 유저가 보호자/간병인인지 확인
    if request.user_type == "guardian":
        target_entity = db.query(Patient).join(Guardian).filter(Guardian.user_id == current_user.user_id).first()
        if not target_entity:
            raise HTTPException(status_code=404, detail="환자 정보를 찾을 수 없습니다. 보호자 정보를 먼저 등록해주세요.")
        personality_model = PatientPersonality
        entity_id_field = "patient_id"
    elif request.user_type == "caregiver":
        target_entity = db.query(Caregiver).filter(Caregiver.user_id == current_user.user_id).first()
        if not target_entity:
            raise HTTPException(status_code=404, detail="간병인 정보를 찾을 수 없습니다.")
        personality_model = CaregiverPersonality
        entity_id_field = "caregiver_id"
    else:
        raise HTTPException(status_code=400, detail="유효하지 않은 사용자 유형입니다.")

    # 1. Azure OpenAI로 점수 계산 및 분석
    client = AzureOpenAI(
        api_key=os.getenv("AZURE_OPENAI_KEY"),
        api_version="2024-02-15-preview",
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
    )

    prompt = f"""
    다음 성향 테스트 응답을 분석해주세요:
    {json.dumps(request.answers, ensure_ascii=False)}

    4가지 점수를 0-100 사이로 계산하고, 분석 텍스트를 작성해주세요:
    - empathy_score (공감 능력)
    - activity_score (활동성)
    - patience_score (인내심)
    - independence_score (독립성)

    JSON 형식으로 응답:
    {{
        "empathy_score": 75.5,
        "activity_score": 60.0,
        "patience_score": 80.0,
        "independence_score": 50.0,
        "analysis": "분석 텍스트..."
    }}
    """

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}]
    )

    result = json.loads(response.choices[0].message.content)

    # 2. DB에 저장 또는 업데이트
    personality_record = db.query(personality_model).filter(
        getattr(personality_model, entity_id_field) == getattr(target_entity, entity_id_field)
    ).first()

    if not personality_record:
        personality_record = personality_model(
            **{entity_id_field: getattr(target_entity, entity_id_field)},
            empathy_score=result['empathy_score'],
            activity_score=result['activity_score'],
            patience_score=result['patience_score'],
            independence_score=result['independence_score'],
            raw_test_answers=request.answers,
            ai_analysis_text=result['analysis']
        )
        db.add(personality_record)
    else:
        personality_record.empathy_score = result['empathy_score']
        personality_record.activity_score = result['activity_score']
        personality_record.patience_score = result['patience_score']
        personality_record.independence_score = result['independence_score']
        personality_record.raw_test_answers = request.answers
        personality_record.ai_analysis_text = result['analysis']

    db.commit()
    db.refresh(personality_record)

    return success_response(
        data=PersonalityTestResponse.model_validate(personality_record).model_dump(),
        message="성향 테스트가 완료되었습니다."
    )
```

#### 체크리스트

- [ ] Azure OpenAI 환경 변수 설정
- [ ] Prompt 최적화
- [ ] JSON 파싱 에러 처리
- [ ] `PatientPersonality` 또는 `CaregiverPersonality`에 저장/업데이트 로직 구현
- [ ] Postman 테스트

---

### 3.2 간병인 매칭 API (최신화)

**우선순위**: 🟡 P1
**예상 시간**: 6시간
**엔드포인트**: `POST /api/matching`

#### Task

**파일**: `backend/app/routes/matching.py`

```python
from sqlalchemy import and_
from app.models.profile import Caregiver, Patient, Guardian
from app.models.user import User, UserGenderEnum # User, UserGenderEnum 임포트
from app.models.care_details import PatientPersonality, CaregiverPersonality
from app.models.matching import MatchingResult # MatchingResult 모델 임포트
from app.schemas.matching import MatchingRequest, MatchingResultResponse # MatchingResultResponse 추가
from app.schemas.patient import PatientResponse # 환자 응답 스키마
from app.core.response import success_response
from app.core.security import get_current_user # security.py에서 get_current_user 가져옴
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from typing import List

router = APIRouter(prefix="/api", tags=["matching"])

async def verify_patient_access( # 기존에 patients 라우터에 있던 함수를 여기에서도 사용하기 위해 복사 또는 공통 유틸로 분리
    patient_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Patient:
    """환자에 대한 접근 권한 확인"""
    patient = db.query(Patient).join(Guardian).filter(
        Patient.patient_id == patient_id,
        Guardian.user_id == current_user.user_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=403,
            detail="이 환자에 대한 접근 권한이 없습니다"
        )
    return patient


@router.post("/matching", status_code=201, response_model=List[MatchingResultResponse])
async def create_matching(
    request: MatchingRequest,
    patient: Patient = Depends(verify_patient_access), # 요청 본문의 patient_id와 일치하는 환자만 허용
    db: Session = Depends(get_db)
):
    """간병인 매칭 요청"""

    # 1. 환자 성향 가져오기
    patient_personality = db.query(PatientPersonality).filter(
        PatientPersonality.patient_id == request.patient_id
    ).first()
    if not patient_personality:
        raise HTTPException(status_code=404, detail="환자 성향 정보가 없습니다. 먼저 성향 테스트를 완료해주세요.")

    # 2. 조건에 맞는 간병인 필터링
    query = db.query(Caregiver).join(User) # Caregiver.user.gender 필터링을 위해 User 조인

    # 경력 필터
    if request.requirements.experience == "5plus":
        query = query.filter(Caregiver.experience_years >= 5)
    elif request.requirements.experience == "3-5":
        query = query.filter(
            Caregiver.experience_years >= 3,
            Caregiver.experience_years < 5
        )

    # 스킬 필터 (specialties 배열에 포함)
    for skill in request.requirements.skills:
        query = query.filter(Caregiver.specialties.contains([skill]))

    # 성별 필터 (users 테이블의 gender 컬럼 사용)
    if request.requirements.gender and request.requirements.gender != UserGenderEnum.any: # "any"가 아니라면 필터링
        query = query.filter(User.gender == request.requirements.gender)

    caregivers = query.all()

    # 3. AI 매칭 점수 계산
    matches = []
    for caregiver in caregivers:
        caregiver_personality = db.query(CaregiverPersonality).filter(
            CaregiverPersonality.caregiver_id == caregiver.caregiver_id
        ).first()

        if not caregiver_personality: # 간병인 성향 정보가 없으면 매칭에서 제외
            continue

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

        # 매칭 결과 저장
        matching_result = MatchingResult(
            patient_id=request.patient_id,
            caregiver_id=caregiver.caregiver_id,
            grade=grade,
            match_score=match_score,
            status='recommended'
        )
        db.add(matching_result)
        matches.append(matching_result) # 바로 객체를 리스트에 추가

    db.commit()
    for m in matches: # 새로고침해서 id 등을 가져옴
        db.refresh(m)

    # 점수 순으로 정렬
    matches.sort(key=lambda x: x.match_score, reverse=True)

    return success_response(
        data=[MatchingResultResponse.model_validate(m).model_dump() for m in matches[:10]], # 상위 10개만 스키마로 변환
        message="매칭 결과가 생성되었습니다."
    )

def calculate_match_score(patient_p, caregiver_p) -> float:
    """간단한 매칭 점수 계산 (ONNX 모델 연동 예정)"""
    score = 0.0

    empathy_diff = abs(patient_p.empathy_score - caregiver_p.empathy_score)
    activity_diff = abs(patient_p.activity_score - caregiver_p.activity_score)
    patience_diff = abs(patient_p.patience_score - caregiver_p.patience_score)
    independence_diff = abs(patient_p.independence_score - caregiver_p.independence_score)

    score = 100 - (empathy_diff * 0.25 + activity_diff * 0.25 +
                   patience_diff * 0.25 + independence_diff * 0.25)

    return round(score, 2)
```

#### 체크리스트

- [ ] 간병인 필터링 로직 구현 (User.gender 포함)
- [ ] `UserGenderEnum` import 및 사용 확인
- [ ] 매칭 점수 계산 함수 작성
- [ ] 등급 부여 로직 구현
- [ ] DB 저장 검증
- [ ] `MatchingResultResponse` 스키마로 응답 모델링
- [ ] Postman 테스트

---

### 3.3 매칭 결과 조회 API

**우선순위**: 🟡 P1
**예상 시간**: 1.5시간
**엔드포인트**: `GET /api/patients/{patient_id}/matching-results`

#### Task

```python
from app.schemas.matching import MatchingResultResponse # MatchingResultResponse 추가

@router.get("/patients/{patient_id}/matching-results", response_model=List[MatchingResultResponse])
async def get_matching_results(
    patient_id: int,
    status: str = Query(None, pattern=r'^(recommended|selected|active)$'),
    patient: Patient = Depends(verify_patient_access),
    db: Session = Depends(get_db)
):
    """매칭 결과 조회"""

    query = db.query(MatchingResult).filter(
        MatchingResult.patient_id == patient_id
    )

    if status:
        query = query.filter(MatchingResult.status == status)

    results = query.order_by(MatchingResult.match_score.desc()).all()

    return success_response(
        data=[MatchingResultResponse.model_validate(r).model_dump() for r in results],
        message=""
    )
```

#### 체크리스트

- [ ] Query Parameter 처리 구현
- [ ] JOIN 쿼리 최적화
- [ ] Postman 테스트

---

## Phase 4: 케어 플랜 & 리뷰 API (P2)

### 4.1 케어 플랜 조회 API

**우선순위**: 🟢 P2
**예상 시간**: 2시간
**엔드포인트**: `GET /api/patients/{patient_id}/care-plans`

#### Task

**파일**: `backend/app/routes/care_plans.py`

```python
from app.models.care_details import Schedule, MealPlan # Schedule, MealPlan 모델 임포트
from app.schemas.schedule import ScheduleResponse # 스키마 임포트
from app.schemas.meal_plan import MealPlanResponse # 스키마 임포트
from datetime import datetime, timedelta

router = APIRouter(prefix="/api", tags=["care-plans"])

@router.get("/patients/{patient_id}/care-plans")
async def get_care_plans(
    patient_id: int,
    type: str = Query("weekly", pattern=r'^(weekly|monthly)$'),
    patient: Patient = Depends(verify_patient_access),
    db: Session = Depends(get_db)
):
    """케어 플랜 일정 조회"""

    # 기간 설정
    if type == "weekly":
        start_date = datetime.now()
        end_date = start_date + timedelta(days=7)
    else:
        start_date = datetime.now()
        end_date = start_date + timedelta(days=30)

    # 일정 조회
    schedules = db.query(Schedule).filter(
        Schedule.patient_id == patient_id,
        Schedule.start_time >= start_date,
        Schedule.start_time < end_date
    ).order_by(Schedule.start_time).all()

    # 식단 조회
    meal_plans = db.query(MealPlan).filter(
        MealPlan.patient_id == patient_id,
        MealPlan.meal_date >= start_date.date(),
        MealPlan.meal_date < end_date.date()
    ).order_by(MealPlan.meal_date, MealPlan.meal_type).all()

    return success_response(
        data={
            "type": type,
            "schedules": [ScheduleResponse.model_validate(s).model_dump() for s in schedules],
            "meal_plans": [MealPlanResponse.model_validate(m).model_dump() for m in meal_plans]
        },
        message=""
    )
```

#### 체크리스트

- [ ] 기간 계산 로직 구현
- [ ] Schedule, MealPlan 조회 구현
- [ ] Postman 테스트

---

### 4.2 간병인 리뷰 작성 API

**우선순위**: 🟢 P2
**예상 시간**: 2시간
**엔드포인트**: `POST /api/matching/{matching_id}/reviews`

#### Task

**파일**: `backend/app/routes/reviews.py`

```python
from app.models.profile import Patient, Guardian # Patient, Guardian 모델 임포트
from app.models.matching import MatchingResult # MatchingResult 모델 임포트
from app.models.care_details import Review # Review 모델 임포트
from app.schemas.review import ReviewCreateRequest, ReviewResponse # Review 스키마 임포트
from app.schemas.matching import MatchingResultResponse # MatchingResultResponse 추가
from app.core.response import success_response
from app.core.security import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db

router = APIRouter(prefix="/api", tags=["reviews"])

@router.post("/matching/{matching_id}/reviews", status_code=201, response_model=ReviewResponse)
async def create_review(
    matching_id: int,
    request: ReviewCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """간병인 리뷰 작성"""

    # 1. 매칭 결과 확인 및 권한 체크
    matching = db.query(MatchingResult).filter(
        MatchingResult.matching_id == matching_id
    ).first()

    if not matching:
        raise HTTPException(status_code=404, detail="매칭 결과를 찾을 수 없습니다")

    # 환자의 보호자인지 확인 (MatchingResult의 patient_id를 통해 Guardian->User 검증)
    patient = db.query(Patient).join(Guardian).filter(
        Patient.patient_id == matching.patient_id,
        Guardian.user_id == current_user.user_id
    ).first()

    if not patient:
        raise HTTPException(status_code=403, detail="권한이 없습니다")

    # 2. 중복 리뷰 체크
    existing_review = db.query(Review).filter(
        Review.matching_id == matching_id,
        Review.reviewer_id == current_user.user_id # 리뷰 작성자도 확인
    ).first()

    if existing_review:
        raise HTTPException(status_code=409, detail="이미 리뷰를 작성했습니다")

    # 3. 리뷰 저장
    review = Review(
        matching_id=matching_id,
        reviewer_id=current_user.user_id, # 리뷰 작성자 ID 추가
        rating=request.rating,
        comment=request.comment
    )

    db.add(review)
    db.commit()
    db.refresh(review)

    return success_response(
        data=ReviewResponse.model_validate(review).model_dump(),
        message="리뷰가 등록되었습니다."
    )
```

#### 체크리스트

- [ ] 권한 검증 로직 구현
- [ ] 중복 리뷰 체크 구현 (reviewer_id 추가)
- [ ] `Review` 모델 사용 확인
- [ ] Postman 테스트

---

### 4.3 마이페이지 대시보드 API

**우선순위**: 🟢 P2
**예상 시간**: 2시간
**엔드포인트**: `GET /api/users/me/dashboard`

#### Task

**파일**: `backend/app/routes/users.py`

```python
from app.models.user import User # User 모델 임포트
from app.models.profile import Guardian, Patient, Caregiver # Guardian, Patient, Caregiver 모델 임포트
from app.models.matching import MatchingResult # MatchingResult 모델 임포트
from app.schemas.user import UserResponse # UserResponse 임포트
from app.schemas.guardian import GuardianResponse # GuardianResponse 임포트
from app.schemas.patient import PatientResponse # PatientResponse 임포트
from app.schemas.matching import MatchingResultResponse # MatchingResultResponse 임포트
from app.core.response import success_response
from app.core.security import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from typing import Optional, List
from datetime import date

router = APIRouter(prefix="/api", tags=["users"])

def get_patient_age(birth_date: date) -> int:
    """생년월일로부터 나이 계산"""
    today = date.today()
    return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))


@router.get("/users/me/dashboard")
async def get_my_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """마이페이지 대시보드"""

    user_data = UserResponse.model_validate(current_user).model_dump()
    
    guardian_data: Optional[GuardianResponse] = None
    patients_data: List[PatientResponse] = []
    active_matching_data: Optional[MatchingResultResponse] = None
    
    if current_user.user_type == "guardian":
        # 1. 보호자 정보
        guardian = db.query(Guardian).filter(
            Guardian.user_id == current_user.user_id
        ).first()

        if guardian:
            guardian_data = GuardianResponse.model_validate(guardian).model_dump()
            
            # 2. 환자 목록
            patients = db.query(Patient).filter(
                Patient.guardian_id == guardian.guardian_id
            ).all()

            patients_data = [
                PatientResponse.model_validate(p).model_dump()
                for p in patients
            ]

            # 3. 활성 매칭 정보 (첫 번째 환자의 매칭만 고려)
            if patients:
                matching = db.query(MatchingResult).join(Caregiver).join(User).filter(
                    MatchingResult.patient_id == patients[0].patient_id,
                    MatchingResult.status == 'active'
                ).first()

                if matching:
                    active_matching_data = MatchingResultResponse.model_validate(matching).model_dump()
    
    # 간병인인 경우의 로직도 추가 가능

    return success_response(
        data={
            "user": user_data,
            "guardian": guardian_data,
            "patients": patients_data,
            "active_matching": active_matching_data
        },
        message=""
    )
```

#### 체크리스트

- [ ] 대시보드 정보 조회 구현
- [ ] Pydantic 스키마를 사용하여 데이터 직렬화
- [ ] Postman 테스트

---

## 최종 체크리스트

### Phase 1: 환경 설정
- [ ] DB 스키마 수정 완료 (`DB_SCHEMA_MIGRATION.md` 참조)
- [ ] Pydantic 스키마 전체 작성 및 업데이트 완료
- [ ] 공통 응답 포맷 구현 완료

### Phase 2: P0 API (보호자 & 환자 등록)
- [ ] POST /api/guardians 구현 완료
- [ ] GET /api/guardians/me 구현 완료
- [ ] POST /api/patients 구현 완료
- [ ] PUT /api/patients/{id}/health-status 구현 완료 (HealthCondition 테이블)
- [ ] POST /api/patients/{id}/medications 구현 완료 (Medication 테이블)

### Phase 3: P1 API (성향 테스트 & 매칭)
- [ ] POST /api/personality-tests 구현 완료
- [ ] POST /api/matching 구현 완료
- [ ] GET /api/patients/{id}/matching-results 구현 완료

### Phase 4: P2 API (케어 플랜 & 리뷰)
- [ ] GET /api/patients/{id}/care-plans 구현 완료
- [ ] POST /api/matching/{id}/reviews 구현 완료
- [ ] GET /api/users/me/dashboard 구현 완료

### 통합 테스트
- [ ] Postman Collection 작성
- [ ] 프론트엔드와 통합 테스트
- [ ] 에러 케이스 검증
- [ ] 성능 테스트

---

**작성 완료**
**날짜**: 2025-11-26 (업데이트)
**담당**: 백엔드 개발자