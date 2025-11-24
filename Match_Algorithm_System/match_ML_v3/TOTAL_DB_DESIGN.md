모든 변경 사항(ML 모델 연동, Figma 분석 결과, PostgreSQL 전환, 누락 필드 보완)을 반영한 최종 완성본 PostgreSQL DDL(Data Definition Language) 스크립트입니다.

이 스크립트는 즉시 개발팀에 전달하여 DB를 구축할 수 있는 수준으로 작성되었습니다.

🏗️ 시니어 케어 매칭 시스템 통합 DB 스키마
Target Database: Azure Database for PostgreSQL (Flexible Server)

1. 공통 코드 및 사용자 인증 (Auth & Common)
   가장 기초가 되는 계정 정보와 열거형(Enum) 타입 정의입니다.

SQL

-- [Enum 정의] 데이터 무결성을 위한 타입 제한
CREATE TYPE user_type_enum AS ENUM ('guardian', 'caregiver');
CREATE TYPE gender_enum AS ENUM ('Male', 'Female');
CREATE TYPE grade_enum AS ENUM ('A+', 'A', 'B+', 'B', 'C'); -- ML 매칭 등급
CREATE TYPE matching_status_enum AS ENUM ('recommended', 'selected', 'active', 'completed', 'cancelled');
CREATE TYPE care_level_enum AS ENUM ('1등급', '2등급', '3등급', '4등급', '5등급', '인지지원등급', '등급외');

-- [1. Users] 통합 계정 관리 (로그인/인증)
CREATE TABLE users (
user_id BIGSERIAL PRIMARY KEY,
email VARCHAR(100) UNIQUE NOT NULL,
password_hash VARCHAR(255), -- 소셜 로그인의 경우 Nullable
name VARCHAR(50) NOT NULL,
phone_number VARCHAR(20) UNIQUE,
user_type user_type_enum NOT NULL,
profile_image_url TEXT,
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
); 2. 프로필 정보 (Profiles)
보호자, 환자, 간병인의 상세 정보를 저장합니다. (Figma P8, P11 분석 반영)

SQL

-- [2. Guardians] 보호자 정보 (P7 화면)
CREATE TABLE guardians (
guardian_id BIGSERIAL PRIMARY KEY,
user_id BIGINT UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
address VARCHAR(255), -- 법정 주소지
relationship_to_patient VARCHAR(50), -- 환자와의 관계
emergency_contact VARCHAR(20) -- 비상 연락처
);

-- [3. Patients] 환자 정보 (P8 화면 + 추가 필드)
CREATE TABLE patients (
patient_id BIGSERIAL PRIMARY KEY,
guardian_id BIGINT NOT NULL REFERENCES guardians(guardian_id) ON DELETE CASCADE,

    name VARCHAR(50) NOT NULL,
    birth_date DATE NOT NULL, -- 나이 계산용
    gender gender_enum NOT NULL,

    -- [신체 정보] 케어 난이도 파악용 (누락 보완)
    height INTEGER, -- cm
    weight INTEGER, -- kg

    -- [케어 장소] 보호자 주소와 다를 수 있음 (누락 보완)
    care_address VARCHAR(255) NOT NULL,
    region_code VARCHAR(50) NOT NULL, -- 매칭 필터링용 (예: 'SEOUL_GANGNAM')

    care_level care_level_enum, -- 장기요양등급
    profile_image_url TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()

);

-- [4. Caregivers] 간병인 정보 (공급자)
CREATE TABLE caregivers (
caregiver_id BIGSERIAL PRIMARY KEY,
user_id BIGINT UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    experience_years INTEGER DEFAULT 0,
    certifications VARCHAR(255), -- 보유 자격증 (요양보호사, 간호조무사 등)

    -- [활동 조건] 1차 필터링용
    service_region VARCHAR(50), -- 활동 가능 지역 코드
    has_vehicle BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT NOW()

); 3. AI 인텔리전스 & 성향 (Intelligence)
ML 모델(XGBoost)의 Input Feature가 되는 핵심 데이터입니다. (P2 화면 데이터 연결)

SQL

-- [5. Patient Personality] 환자 성향 데이터 (P2 테스트 결과)
CREATE TABLE patient_personality (
personality_id BIGSERIAL PRIMARY KEY,
patient_id BIGINT UNIQUE NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,

    -- 4대 성향 축 (ML Input Features)
    empathy_score FLOAT DEFAULT 0,    -- 공감도
    activity_score FLOAT DEFAULT 0,   -- 활동성
    patience_score FLOAT DEFAULT 0,   -- 인내심
    independence_score FLOAT DEFAULT 0, -- 자립도

    raw_test_answers JSONB, -- 테스트 문항 원본 데이터 (추후 재학습용)
    updated_at TIMESTAMP DEFAULT NOW()

);

-- [6. Caregiver Personality] 간병인 성향 데이터
CREATE TABLE caregiver_personality (
personality_id BIGSERIAL PRIMARY KEY,
caregiver_id BIGINT UNIQUE NOT NULL REFERENCES caregivers(caregiver_id) ON DELETE CASCADE,

    empathy_score FLOAT DEFAULT 0,
    activity_score FLOAT DEFAULT 0,
    patience_score FLOAT DEFAULT 0,
    independence_score FLOAT DEFAULT 0,

    updated_at TIMESTAMP DEFAULT NOW()

); 4. 케어 상세 데이터 (Care Details)
매칭 정확도를 높이고, 실제 서비스 수행 시 필요한 정보들입니다. (P9, P10 화면 반영)

SQL

-- [7. Health Conditions] 질병 정보 (P9 화면)
CREATE TABLE health_conditions (
condition_id BIGSERIAL PRIMARY KEY,
patient_id BIGINT NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
disease_name VARCHAR(100) NOT NULL, -- 치매, 당뇨 등
note TEXT -- 특이사항 (기타 입력)
);

-- [8. Medications] 투약 정보 (P10 화면 + 누락 보완)
CREATE TABLE medications (
med_id BIGSERIAL PRIMARY KEY,
patient_id BIGINT NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL, -- 약 이름
    dosage VARCHAR(50), -- 용량

    -- [필수 추가] 복용법
    frequency VARCHAR(50), -- 예: "1일 3회"
    intake_method VARCHAR(100), -- 예: "식후 30분"

    image_url TEXT, -- 약봉투/처방전 원본 사진 (OCR 검증용)
    created_at TIMESTAMP DEFAULT NOW()

);

-- [9. Dietary Preferences] 식사/알러지 정보 (PDF P2 반영)
CREATE TABLE dietary_preferences (
diet_id BIGSERIAL PRIMARY KEY,
patient_id BIGINT NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
type VARCHAR(20) CHECK (type IN ('allergy', 'like', 'dislike')),
food_name VARCHAR(100)
); 5. 매칭 시스템 (Matching Engine)
사용자의 매칭 요청과 AI의 추천 결과를 저장합니다. (P11, P13 화면 반영)

SQL

-- [10. Matching Requests] 매칭 요청서 (P11 화면 - 조건 입력)
CREATE TABLE matching_requests (
request_id BIGSERIAL PRIMARY KEY,
patient_id BIGINT NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,

    -- [필수 조건] SQL 1차 필터링용
    required_qualification VARCHAR(50), -- 요양보호사/간호사 등 (P11)
    preferred_regions VARCHAR(50), -- 선호 지역 코드 (P11의 지역이 없을 경우 대비)

    -- [시간 조건] JSON 배열로 저장 (P11 누락 보완)
    -- 예: ["Mon", "Wed", "Fri"]
    preferred_days JSONB NOT NULL,
    -- 예: ["09:00-12:00", "14:00-18:00"]
    preferred_time_slots JSONB NOT NULL,

    additional_request TEXT, -- 추가 요청사항

    is_active BOOLEAN DEFAULT TRUE, -- 현재 유효한 요청인지
    created_at TIMESTAMP DEFAULT NOW()

);

-- [11. Matching Results] AI 매칭 결과 (P13 화면)
CREATE TABLE matching_results (
matching_id BIGSERIAL PRIMARY KEY,
request_id BIGINT NOT NULL REFERENCES matching_requests(request_id),
caregiver_id BIGINT NOT NULL REFERENCES caregivers(caregiver_id),

    -- [ML 결과]
    total_score FLOAT NOT NULL, -- 적합도 점수 (0~100)
    grade grade_enum NOT NULL, -- 등급 (A+, A...)
    ai_comment TEXT, -- "성향이 활동적이셔서 잘 맞습니다" 등 추천 사유

    status matching_status_enum DEFAULT 'recommended',
    contract_start_date DATE,
    contract_end_date DATE,

    created_at TIMESTAMP DEFAULT NOW()

); 6. 일정 및 수행 기록 (Execution)
매칭 성사 후 생성되는 실제 케어 데이터입니다. (PDF P3 반영)

SQL

-- [12. Schedules] 생성된 케어 일정
CREATE TABLE schedules (
schedule_id BIGSERIAL PRIMARY KEY,
matching_id BIGINT NOT NULL REFERENCES matching_results(matching_id),

    care_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,

    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, in_progress, completed
    created_at TIMESTAMP DEFAULT NOW()

);

-- [13. Care Logs] 수행 체크리스트 (리포트 생성용 데이터)
CREATE TABLE care_logs (
log_id BIGSERIAL PRIMARY KEY,
schedule_id BIGINT NOT NULL REFERENCES schedules(schedule_id),

    category VARCHAR(50) NOT NULL, -- medication, meal, exercise
    task_name VARCHAR(100) NOT NULL, -- "아침 약 복용"

    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    note TEXT -- 특이사항 기록

);
✅ 이 스키마의 핵심 포인트
완벽한 ML 데이터 파이프라인: patient_personality와 patients 테이블이 분리되어 있지만 patient_id로 강력하게 연결되어, P2(성향)와 P8(정보) 데이터를 합쳐서 모델에 넣을 수 있습니다.

Figma의 숨겨진 필드 반영: medications의 복용법, matching_requests의 요일/시간 JSON 처리 등 UI 뒤단의 필수 데이터를 모두 확보했습니다.

유연한 매칭: matching_requests 테이블을 따로 두어, 환자가 매번 다른 조건(주말만/평일만)으로 매칭을 여러 번 요청할 수 있도록 설계했습니다.

확장성: PostgreSQL의 JSONB 타입을 활용하여 비정형 데이터(테스트 답변, 요일 배열) 처리가 유연합니다.
