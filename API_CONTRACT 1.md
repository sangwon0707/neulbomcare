# 늘봄케어 API Contract (프론트엔드 ↔ 백엔드 공유 문서)

> **작성일**: 2025-11-26 (Updated)
> **목적**: 프론트엔드와 백엔드 개발자 간 명확한 인터페이스 계약 정의
> **버전**: 1.1

---

## 📋 목차

1. [API 엔드포인트 전체 요약](#api-엔드포인트-전체-요약)
2. [공통 규칙](#공통-규칙)
3. [페이지별 API 상세 명세](#페이지별-api-상세-명세)
4. [데이터 변환 규칙](#데이터-변환-규칙)
5. [에러 처리 규칙](#에러-처리-규칙)
6. [인증 및 세션 관리](#인증-및-세션-관리)

---

## 1. API 엔드포인트 전체 요약

### 우선순위별 구현 순서

| 우선순위 | 페이지 | HTTP | 엔드포인트 | 프론트 준비 | 백엔드 준비 |
|---------|--------|------|-----------|------------|-----------|
| 🔴 P0 | guardians | POST | `/api/guardians` | ✅ | ❌ |
| 🔴 P0 | patient-condition-1 | POST | `/api/patients` | ✅ | ❌ |
| 🔴 P0 | patient-condition-2 | PUT | `/api/patients/{id}/health-status` | ✅ | ❌ |
| 🔴 P0 | patient-condition-3 | POST | `/api/patients/{id}/medications` | ✅ | ❌ |
| 🟡 P1 | personality-test | POST | `/api/personality-tests` | ✅ | ❌ |
| 🟡 P1 | caregiver-finder | POST | `/api/matching` | ✅ | ❌ |
| 🟡 P1 | matching | GET | `/api/patients/{id}/matching-results` | ✅ | ❌ |
| 🟢 P2 | care-plans-create-2 | GET | `/api/patients/{id}/care-plans` | ✅ | ❌ |
| 🟢 P2 | care-plans-create-3 | POST | `/api/patients/{id}/care-plans/feedback` | ✅ | ❌ |
| 🟢 P2 | care-plans-create-3 | POST | `/api/matching/{id}/reviews` | ✅ | ❌ |
| 🟢 P2 | mypage-dashboard | GET | `/api/users/me/dashboard` | ✅ | ❌ |

---

## 2. 공통 규칙

### 2.1 Request Header

모든 API 요청에는 다음 헤더 필수:

```http
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}
```

### 2.2 Response Format

#### ✅ 성공 응답 (200, 201)

```json
{
  "status": "success",
  "data": {
    // 실제 데이터
  },
  "message": "작업이 완료되었습니다."
}
```

#### ❌ 에러 응답 (4xx, 5xx)

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력값이 올바르지 않습니다.",
    "details": {
      "field": "email",
      "reason": "이메일 형식이 올바르지 않습니다."
    }
  }
}
```

### 2.3 프론트엔드가 보내야 하는 값 vs 백엔드가 변환할 값

| 항목 | 프론트 전송 | 백엔드 저장 | 변환 주체 |
|------|-----------|-----------|---------|
| 나이 | `age: 78` | `birth_date: "1946-01-01"` | 백엔드 |
| 성별 | `gender: "female"` | `gender: "Female"` | 백엔드 |
| 경력 | `experience: "5plus"` | `experience_years >= 5` | 백엔드 |
| 질병 목록 | `selectedDiseases: [{id, name}...]` | `selected_diseases: JSONB` | 그대로 저장 |
| 약물 배열 | `medicine_names: ["약1", "약2"]` | `medicine_names: TEXT[]` | 그대로 저장 |

### 2.4 날짜/시간 형식

- **프론트 → 백엔드**: ISO 8601 형식 (`"2024-11-25T10:30:00Z"`)
- **백엔드 → 프론트**: ISO 8601 형식 유지

---

## 3. 페이지별 API 상세 명세

### 3.1 보호자 정보 등록 (guardians)

#### 📍 Frontend URL: `/guardians`

#### 📤 Request

**Method**: `POST`
**Endpoint**: `/api/guardians`

**프론트엔드 전송 데이터**:
```json
{
  "name": "김영수",
  "phone": "010-1234-5678",
  "address": "서울시 강남구 테헤란로 123",
  "relationship": "자녀"
}
```

**Pydantic Schema (백엔드)**:
```python
class GuardianCreateRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    phone: str = Field(..., pattern=r'^010-\d{4}-\d{4}$')
    address: str = Field(..., min_length=1, max_length=255)
    relationship: str
```

#### 📥 Response

**Success (201 Created)**:
```json
{
  "status": "success",
  "data": {
    "guardian_id": 123,
    "user_id": 456,
    "name": "김영수",
    "phone": "010-1234-5678",
    "address": "서울시 강남구 테헤란로 123",
    "relationship": "자녀",
    "created_at": "2024-11-25T10:30:00Z"
  },
  "message": "보호자 정보가 등록되었습니다."
}
```

#### 🗄️ DB 테이블
- `users` (name, phone_number)
- `guardians` (user_id, address, relationship_to_patient)

---

### 3.2 환자 기본 정보 등록 (patient-condition-1)

#### 📍 Frontend URL: `/patient-condition-1`

#### 📤 Request

**Method**: `POST`
**Endpoint**: `/api/patients`

**프론트엔드 전송 데이터**:
```json
{
  "name": "김영희",
  "age": 78,
  "gender": "female",
  "relationship": "어머니"
}
```

**Pydantic Schema (백엔드)**:
```python
class PatientCreateRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    age: int = Field(..., ge=0, le=150)
    gender: str = Field(..., pattern=r'^(female|male)$')
    relationship: str

    @validator('gender')
    def convert_gender(cls, v):
        # 프론트: 'female' → 백엔드: 'Female'
        mapping = {'female': 'Female', 'male': 'Male'}
        return mapping.get(v, v)
```

#### 📥 Response

```json
{
  "status": "success",
  "data": {
    "patient_id": 789,
    "name": "김영희",
    "birth_date": "1946-01-01",
    "age": 78,
    "gender": "Female",
    "guardian_id": 123,
    "created_at": "2024-11-25T10:35:00Z"
  },
  "message": "환자 정보가 등록되었습니다."
}
```

#### 🗄️ DB 테이블
- `patients` (name, birth_date, gender, guardian_id)

---

### 3.3 환자 건강 상태 등록 (patient-condition-2)

#### 📍 Frontend URL: `/patient-condition-2`

#### 📤 Request

**Method**: `PUT`
**Endpoint**: `/api/patients/{patient_id}/health-status`

**프론트엔드 전송 데이터**:
```json
{
  "selectedDiseases": [
    { "id": "dementia", "name": "치매/인지장애" },
    { "id": "diabetes", "name": "당뇨병" }
  ],
  "mobility_status": "assistive-device"
}
```

**상세 옵션 (참고)**:
*   `mobility_status`: `independent` (독립보행), `assistive-device` (보조기구), `wheelchair` (휠체어), `bedridden` (침상생활)

**Pydantic Schema (백엔드)**:
```python
class DiseaseItem(BaseModel):
    id: str
    name: str

class HealthStatusUpdateRequest(BaseModel):
    selected_diseases: List[DiseaseItem] = Field(default_factory=list)
    mobility_status: str # independent, assistive-device, wheelchair, bedridden
```

#### 📥 Response

```json
{
  "status": "success",
  "data": {
    "patient_id": 789,
    "selected_diseases": [
        { "id": "dementia", "name": "치매/인지장애" },
        { "id": "diabetes", "name": "당뇨병" }
    ],
    "mobility_status": "assistive-device",
    "updated_at": "2024-11-25T10:40:00Z"
  },
  "message": "건강 상태가 업데이트되었습니다."
}
```

#### 🗄️ DB 테이블
- `health_conditions` (selected_diseases JSONB, mobility_status VARCHAR(50))

#### ⚠️ 백엔드 작업 필요
- **DB 스키마 수정 필요**: `health_conditions` 테이블의 컬럼 변경
    - `disease_name` 삭제 -> `selected_diseases` (JSONB) 추가
    - `mobility_status` 추가

---

### 3.4 환자 복용 약물 등록 (patient-condition-3)

#### 📍 Frontend URL: `/patient-condition-3`

#### 📤 Request

**Method**: `POST`
**Endpoint**: `/api/patients/{patient_id}/medications`

**프론트엔드 전송 데이터**:
```json
{
  "medicine_names": [
    "아스피린 100mg",
    "메트포민 500mg",
    "암로디핀 5mg"
  ]
}
```

#### 📥 Response

```json
{
  "status": "success",
  "data": {
    "patient_id": 789,
    "medications_count": 3,
    "medicine_names": [
      "아스피린 100mg",
      "메트포민 500mg",
      "암로디핀 5mg"
    ]
  },
  "message": "약물 정보가 등록되었습니다."
}
```

#### 🗄️ DB 테이블
- `medications` (patient_id, medicine_names TEXT[])

#### ⚠️ 주의사항
- 기존의 복잡한 `Medication` 테이블 구조 대신, 단순 배열(`medicine_names`)로 저장
- `notes` 컬럼 삭제됨

**백엔드 로직**:
```python
medication = Medication(
    patient_id=patient_id,
    medicine_names=request.medicine_names
)
db.add(medication)
```

---

### 3.5 성향 테스트 제출 (personality-test)

#### 📍 Frontend URL: `/personality-test`

#### 📤 Request

**Method**: `POST`
**Endpoint**: `/api/personality-tests`

**프론트엔드 전송 데이터**:
```json
{
  "user_type": "guardian",
  "answers": {
    "step1": "부모님",
    "step2": "전문성",
    "step3": "조용한 분"
  }
}
```

#### 📥 Response

```json
{
  "status": "success",
  "data": {
    "test_id": 555,
    "user_id": 456,
    "scores": {
      "empathy_score": 75.5,
      "activity_score": 60.0,
      "patience_score": 80.0,
      "independence_score": 50.0
    },
    "ai_analysis": "따뜻한 성향의 보호자로, 전문성을 중시하며...",
    "created_at": "2024-11-25T11:00:00Z"
  },
  "message": "성향 테스트가 완료되었습니다."
}
```

#### 🗄️ DB 테이블
- `personality_tests` (user_id, raw_test_answers JSONB, empathy_score, ...)

---

### 3.6 간병인 매칭 요청 (caregiver-finder)

#### 📍 Frontend URL: `/caregiver-finder`

#### 📤 Request

**Method**: `POST`
**Endpoint**: `/api/matching`

**프론트엔드 전송 데이터**:
```json
{
  "patient_id": 789,
  "requirements": {
    "care_type": "nursing-aide",
    "time_slots": ["morning", "afternoon"],
    "gender": "any", // "male", "female", "any"
    "experience": "5plus",
    "skills": ["dementia", "diabetes"]
  }
}
```

#### 📥 Response

```json
{
  "status": "success",
  "data": {
    "matches": [
      {
        "matching_id": 1001,
        "caregiver_id": 50,
        "caregiver_name": "김간병",
        "gender": "Female",
        "grade": "A+",
        "match_score": 95.5,
        "experience_years": 8,
        "specialties": ["치매", "당뇨"],
        "hourly_rate": 18000,
        "avg_rating": 4.8,
        "profile_image_url": "https://..."
      }
    ],
    "total_count": 2
  },
  "message": "매칭 결과가 생성되었습니다."
}
```

#### 🗄️ DB 테이블
- `matching_results`
- `caregivers`
- `users` (성별 필터링용)

#### ⚠️ 주의사항
- 성별 필터링을 위해 `users` 테이블에 `gender` 컬럼 추가됨 (`Male`, `Female`)
- 매칭 알고리즘에서 `users.gender`를 조인하여 필터링해야 함

---

### 3.7 ~ 3.10 (기존과 동일)
... (생략 - 기존 내용 유지)

---

## 8. 백엔드 DB 스키마 수정 필요 (Updated)

### 필수 수정 SQL

```sql
-- 1. health_conditions 테이블 수정 (질병 정보)
ALTER TABLE health_conditions DROP COLUMN IF EXISTS disease_name;
ALTER TABLE health_conditions ADD COLUMN selected_diseases JSONB; -- [{"id": "...", "name": "..."}]
ALTER TABLE health_conditions ADD COLUMN mobility_status VARCHAR(50); -- independent, assistive-device...

-- 2. medications 테이블 수정 (투약 정보)
ALTER TABLE medications DROP COLUMN IF EXISTS name;
ALTER TABLE medications DROP COLUMN IF EXISTS notes;
ALTER TABLE medications ADD COLUMN medicine_names TEXT[]; -- ["약1", "약2"]

-- 3. users 테이블 수정 (성별)
-- user_gender_enum 생성 필요
ALTER TABLE users ADD COLUMN gender user_gender_enum; -- 'Male', 'Female'

-- 4. 인덱스 생성
CREATE INDEX idx_health_diseases ON health_conditions USING GIN (selected_diseases);
CREATE INDEX idx_medications_names ON medications USING GIN (medicine_names);
CREATE INDEX idx_users_gender ON users (gender);
```

---

## 9. 개발 체크리스트

### 프론트엔드 개발자

- [ ] `patient-condition-2`: `selectedDiseases` (객체 배열) 및 `mobility_status` 전송하도록 수정
- [ ] `patient-condition-3`: 약물 이름을 문자열 배열(`medicine_names`)로 전송하도록 수정
- [ ] API 호출 공통 함수 작성 (`src/lib/api.ts`)
- [ ] JWT 토큰 저장/관리 로직 구현

### 백엔드 개발자

- [ ] `DB_SCHEMA_MIGRATION.md` 실행하여 DB 구조 변경
- [ ] `HealthCondition` 모델 수정 (JSONB, 복수 질병 지원)
- [ ] `Medication` 모델 수정 (Array 지원, notes 삭제)
- [ ] `User` 모델 수정 (Gender 추가)
- [ ] Pydantic 스키마 업데이트

---

**작성 완료**
**날짜**: 2025-11-26
**작성자**: PM (팀장)