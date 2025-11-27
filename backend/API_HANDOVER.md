# API 인수인계 문서 (API Handover Document)

## 개요 (Overview)
이 문서는 백엔드 API의 현재 상태를 설명하고, **매칭 모델(Matching Model)** 및 **성향 테스트 모델(Personality Test Model)**을 담당하는 개발자를 위한 구체적인 가이드를 제공합니다.

## 1. 성향 테스트 API (미구현)
현재 성향 테스트를 위한 데이터베이스 모델과 Pydantic 스키마는 존재하지만, **API 엔드포인트는 구현되어 있지 않습니다**.

### 기존 리소스 (Existing Resources)
- **Schemas**: `backend/app/schemas/personality.py`
    - `PatientPersonalityCreate`, `CaregiverPersonalityCreate`
    - 필드: `empathy_score`, `activity_score`, `patience_score`, `independence_score` (0-100 float)
- **Models**: `backend/app/models/care_details.py`
    - `PatientPersonality` (테이블명: `patient_personality`)
    - `CaregiverPersonality` (테이블명: `caregiver_personality`)

### 구현 필요 사항 (Required Implementation)
다음 엔드포인트를 구현해야 합니다 (제안 위치: `backend/app/routes/personality.py` 또는 `patients.py`/`caregivers.py` 확장):

#### 1.1 환자 성향 (Patient Personality)
- **POST** `/api/patients/{patient_id}/personality`
    - **목적**: 성향 모델의 분석 결과를 저장
    - **Request Body**: `PatientPersonalityCreate`
    - **Response**: `PatientPersonalityResponse`

#### 1.2 간병인 성향 (Caregiver Personality)
- **POST** `/api/caregivers/{caregiver_id}/personality`
    - **목적**: 성향 모델의 분석 결과를 저장
    - **Request Body**: `CaregiverPersonalityCreate`
    - **Response**: `CaregiverPersonalityResponse`

---

## 2. 매칭 모델 통합 (로직 부재)
매칭 요청(Request) 및 결과(Result)에 대한 CRUD 엔드포인트는 존재하지만, **핵심 매칭 로직은 빠져 있습니다**.

### 기존 리소스 (Existing Resources)
- **Routes**: `backend/app/routes/matching.py`
- **Schemas**: `backend/app/schemas/matching.py`
- **Models**: `backend/app/models/matching.py`

### 현재 흐름 (Current Flow - Implemented)
1. 프론트엔드에서 요청 생성: `POST /api/matching/requests` -> `matching_requests` 테이블에 저장됨.
2. 프론트엔드에서 결과 폴링: `GET /api/patients/{patient_id}/matching-results`.

### 구현 필요 사항 (Required Implementation)
요청(Request)과 결과(Result)를 연결하는 **매칭 엔진(Matching Engine)**을 구현해야 합니다.

1. **트리거 (Trigger)**: `MatchingRequest`가 생성될 때 (또는 백그라운드 작업을 통해).
2. **로직 (Logic)**:
    - `PatientPersonality` 및 `CaregiverPersonality` 데이터를 조회.
    - 매칭 알고리즘 적용.
    - `total_score` 및 세부 점수(예: `personality_match_score`) 계산.
3. **출력 (Output)**: `MatchingResultCreate` 스키마를 사용하여 `matching_results` 테이블에 레코드 생성.

---

## 3. 데이터베이스 스키마 참조 (Database Schema Reference)
시스템의 다른 부분과의 호환성을 유지하기 위해 반드시 아래의 기존 테이블을 사용해야 합니다.

| 도메인 (Domain) | 테이블명 (Table Name) | 모델 파일 (Model File) |
|--------|------------|------------|
| **환자 성향** | `patient_personality` | `app/models/care_details.py` |
| **간병인 성향** | `caregiver_personality` | `app/models/care_details.py` |
| **매칭 요청** | `matching_requests` | `app/models/matching.py` |
| **매칭 결과** | `matching_results` | `app/models/matching.py` |

## 4. 환경 설정 (Environment Setup)
- 백엔드는 **FastAPI**와 **SQLAlchemy**를 사용합니다.
- 데이터베이스: **PostgreSQL** (Azure).
- 로컬 실행: `uvicorn app.main:app --reload`
