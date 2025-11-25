-- ============================================
-- 🏥 CareCircle 데이터베이스 스키마 (최종 통합판)
-- ============================================
-- Database: Azure Database for PostgreSQL
-- Version: PostgreSQL 14+
-- Character Set: UTF8
-- Last Updated: 2024
-- ============================================

-- ============================================
-- 0. 타입 초기화 (재실행 대비)
-- ============================================

DROP TYPE IF EXISTS user_type_enum CASCADE;
DROP TYPE IF EXISTS gender_enum CASCADE;
DROP TYPE IF EXISTS social_provider_enum CASCADE;
DROP TYPE IF EXISTS care_level_enum CASCADE;
DROP TYPE IF EXISTS grade_enum CASCADE;
DROP TYPE IF EXISTS matching_status_enum CASCADE;
DROP TYPE IF EXISTS meal_type_enum CASCADE;
DROP TYPE IF EXISTS report_type_enum CASCADE;
DROP TYPE IF EXISTS care_category_enum CASCADE;

-- ============================================
-- 1. 공통 타입 정의 (Enums)
-- ============================================

-- 사용자 유형
CREATE TYPE user_type_enum AS ENUM ('guardian', 'caregiver');

-- 성별
CREATE TYPE gender_enum AS ENUM ('Male', 'Female');

-- 소셜 로그인 제공자
CREATE TYPE social_provider_enum AS ENUM ('kakao', 'naver', 'google', 'apple');

-- 장기요양등급
CREATE TYPE care_level_enum AS ENUM (
'1등급',
'2등급',
'3등급',
'4등급',
'5등급',
'인지지원등급',
'등급외'
);

-- 매칭 등급
CREATE TYPE grade_enum AS ENUM ('A+', 'A', 'B+', 'B', 'C');

-- 매칭 상태
CREATE TYPE matching_status_enum AS ENUM (
'recommended',
'selected',
'active',
'completed',
'cancelled'
);

-- 식사 타입
CREATE TYPE meal_type_enum AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');

-- 보고서 타입
CREATE TYPE report_type_enum AS ENUM ('weekly', 'monthly');

-- 케어 카테고리
CREATE TYPE care_category_enum AS ENUM (
'medication',
'meal',
'exercise',
'vital_check',
'hygiene',
'other'
);

-- ============================================
-- 2. 인증 및 계정 관리
-- ============================================

-- [1. Users] 통합 사용자 정보
CREATE TABLE users (
user_id BIGSERIAL PRIMARY KEY,

    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),

    name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) UNIQUE,

    user_type user_type_enum NOT NULL,
    profile_image_url TEXT,

    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT check_email_or_phone CHECK (
        email IS NOT NULL OR phone_number IS NOT NULL
    )

);

CREATE INDEX idx_users_email ON users(email) WHERE email IS NOT NULL;
CREATE INDEX idx_users_phone ON users(phone_number) WHERE phone_number IS NOT NULL;
CREATE INDEX idx_users_type ON users(user_type);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = TRUE;

COMMENT ON TABLE users IS '통합 사용자 테이블 (보호자 + 간병인)';
COMMENT ON COLUMN users.user_type IS '보호자(guardian) 또는 간병인(caregiver)';
COMMENT ON COLUMN users.password_hash IS '일반 로그인용 비밀번호 해시 (소셜 로그인 시 NULL)';

-- [2. Social Accounts] 소셜 로그인 연동 정보
CREATE TABLE social_accounts (
social_id BIGSERIAL PRIMARY KEY,
user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    provider social_provider_enum NOT NULL,
    provider_user_id VARCHAR(100) NOT NULL,

    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,

    connected_at TIMESTAMP DEFAULT NOW(),

    UNIQUE (provider, provider_user_id)

);

CREATE INDEX idx_social_user ON social_accounts(user_id);
CREATE INDEX idx_social_provider ON social_accounts(provider, provider_user_id);

COMMENT ON TABLE social_accounts IS '소셜 로그인 연동 정보 (Kakao, Naver 등)';
COMMENT ON COLUMN social_accounts.provider_user_id IS '소셜 제공자의 고유 사용자 ID';

-- ============================================
-- 3. 성향 테스트
-- ============================================

-- [3. Personality Tests] 성향 테스트 결과
CREATE TABLE personality_tests (
test_id BIGSERIAL PRIMARY KEY,
user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    empathy_score FLOAT DEFAULT 0,
    activity_score FLOAT DEFAULT 0,
    patience_score FLOAT DEFAULT 0,
    independence_score FLOAT DEFAULT 0,

    raw_test_answers JSONB,
    ai_analysis_text TEXT,

    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT check_test_empathy CHECK (empathy_score >= 0 AND empathy_score <= 100),
    CONSTRAINT check_test_activity CHECK (activity_score >= 0 AND activity_score <= 100),
    CONSTRAINT check_test_patience CHECK (patience_score >= 0 AND patience_score <= 100),
    CONSTRAINT check_test_independence CHECK (independence_score >= 0 AND independence_score <= 100)

);

CREATE INDEX idx_personality_tests_user ON personality_tests(user_id);

COMMENT ON TABLE personality_tests IS '성향 테스트 결과 (화면 2: 성향 테스트)';
COMMENT ON COLUMN personality_tests.ai_analysis_text IS 'Azure OpenAI가 생성한 성향 분석 텍스트';

-- ============================================
-- 4. 프로필 데이터
-- ============================================

-- [4. Guardians] 보호자 상세
CREATE TABLE guardians (
guardian_id BIGSERIAL PRIMARY KEY,
user_id BIGINT UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    address VARCHAR(255),
    relationship_to_patient VARCHAR(50),
    emergency_contact VARCHAR(20),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()

);

CREATE INDEX idx_guardians_user ON guardians(user_id);

COMMENT ON TABLE guardians IS '보호자 상세 정보 (화면 4)';
COMMENT ON COLUMN guardians.relationship_to_patient IS '환자와의 관계 (부모님, 배우자 등)';

-- [5. Patients] 환자 상세
CREATE TABLE patients (
patient_id BIGSERIAL PRIMARY KEY,
guardian_id BIGINT NOT NULL REFERENCES guardians(guardian_id) ON DELETE CASCADE,

    name VARCHAR(50) NOT NULL,
    birth_date DATE NOT NULL,
    gender gender_enum NOT NULL,

    height INTEGER,
    weight INTEGER,

    care_address VARCHAR(255) NOT NULL,
    region_code VARCHAR(50) NOT NULL,

    care_level care_level_enum,
    profile_image_url TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT check_birth_date CHECK (birth_date <= CURRENT_DATE),
    CONSTRAINT check_height CHECK (height IS NULL OR (height > 0 AND height < 300)),
    CONSTRAINT check_weight CHECK (weight IS NULL OR (weight > 0 AND weight < 500))

);

CREATE INDEX idx_patients_guardian ON patients(guardian_id);
CREATE INDEX idx_patients_region ON patients(region_code);
CREATE INDEX idx_patients_care_level ON patients(care_level);

CREATE OR REPLACE FUNCTION get_patient_age(p_birth_date DATE)
RETURNS INTEGER AS $$
BEGIN
RETURN EXTRACT(YEAR FROM AGE(p_birth_date));
END;

$$
LANGUAGE plpgsql IMMUTABLE;

COMMENT ON TABLE patients IS '환자(시니어) 상세 정보 (화면 5)';
COMMENT ON COLUMN patients.region_code IS '매칭 지역 필터 기준 (예: SEOUL_GANGNAM)';
COMMENT ON COLUMN patients.care_level IS '장기요양등급';

-- [6. Caregivers] 간병인 상세 (시급 추가됨)
CREATE TABLE caregivers (
    caregiver_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    experience_years INTEGER DEFAULT 0,
    certifications VARCHAR(255),
    specialties TEXT[],

    service_region VARCHAR(50),
    has_vehicle BOOLEAN DEFAULT FALSE,

    hourly_rate INTEGER,

    avg_rating NUMERIC(3, 2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT check_experience CHECK (experience_years >= 0),
    CONSTRAINT check_hourly_rate CHECK (hourly_rate IS NULL OR (hourly_rate > 0 AND hourly_rate <= 1000000)),
    CONSTRAINT check_avg_rating CHECK (avg_rating >= 0 AND avg_rating <= 5)
);

CREATE INDEX idx_caregivers_user ON caregivers(user_id);
CREATE INDEX idx_caregivers_region ON caregivers(service_region);
CREATE INDEX idx_caregivers_rating ON caregivers(avg_rating DESC);

COMMENT ON TABLE caregivers IS '간병인 상세 정보 (화면 11)';
COMMENT ON COLUMN caregivers.certifications IS '자격증 (요양보호사, 간호사 등)';
COMMENT ON COLUMN caregivers.specialties IS '전문 분야 배열 (예: {치매, 파킨슨, 당뇨})';
COMMENT ON COLUMN caregivers.hourly_rate IS '간병인 시급 (원 단위, 예: 20000)';
COMMENT ON COLUMN caregivers.service_region IS '활동 가능 지역';

-- ============================================
-- 5. AI 매칭 데이터
-- ============================================

-- [7. Patient Personality] 환자 성향
CREATE TABLE patient_personality (
    personality_id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT UNIQUE NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,

    empathy_score FLOAT DEFAULT 0,
    activity_score FLOAT DEFAULT 0,
    patience_score FLOAT DEFAULT 0,
    independence_score FLOAT DEFAULT 0,

    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT check_patient_empathy CHECK (empathy_score >= 0 AND empathy_score <= 100),
    CONSTRAINT check_patient_activity CHECK (activity_score >= 0 AND activity_score <= 100),
    CONSTRAINT check_patient_patience CHECK (patience_score >= 0 AND patience_score <= 100),
    CONSTRAINT check_patient_independence CHECK (independence_score >= 0 AND independence_score <= 100)
);

CREATE INDEX idx_patient_personality ON patient_personality(patient_id);

COMMENT ON TABLE patient_personality IS '[AI 매칭] 환자 성향';

-- [8. Caregiver Personality] 간병인 성향
CREATE TABLE caregiver_personality (
    personality_id BIGSERIAL PRIMARY KEY,
    caregiver_id BIGINT UNIQUE NOT NULL REFERENCES caregivers(caregiver_id) ON DELETE CASCADE,

    empathy_score FLOAT DEFAULT 0,
    activity_score FLOAT DEFAULT 0,
    patience_score FLOAT DEFAULT 0,
    independence_score FLOAT DEFAULT 0,

    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT check_caregiver_empathy CHECK (empathy_score >= 0 AND empathy_score <= 100),
    CONSTRAINT check_caregiver_activity CHECK (activity_score >= 0 AND activity_score <= 100),
    CONSTRAINT check_caregiver_patience CHECK (patience_score >= 0 AND patience_score <= 100),
    CONSTRAINT check_caregiver_independence CHECK (independence_score >= 0 AND independence_score <= 100)
);

CREATE INDEX idx_caregiver_personality ON caregiver_personality(caregiver_id);

COMMENT ON TABLE caregiver_personality IS '[AI 매칭] 간병인 성향';

-- ============================================
-- 6. 케어 상세 정보
-- ============================================

-- [9. Health Conditions] 질병 정보
CREATE TABLE health_conditions (
    condition_id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,

    disease_name VARCHAR(100) NOT NULL,
    note TEXT,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE (patient_id, disease_name)
);

CREATE INDEX idx_health_patient ON health_conditions(patient_id);

COMMENT ON TABLE health_conditions IS '[환자 기본 정보] 질병 정보 (화면 6)';

-- [10. Medications] 투약 정보
CREATE TABLE medications (
    med_id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50),

    frequency VARCHAR(50),
    intake_method VARCHAR(100),

    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_medications_patient ON medications(patient_id);

COMMENT ON TABLE medications IS '[환자 기본 정보] 투약 정보 (화면 7)';
COMMENT ON COLUMN medications.frequency IS '복용 빈도 (예: 1일 3회)';
COMMENT ON COLUMN medications.intake_method IS '복용 방법 (예: 식후 30분)';
COMMENT ON COLUMN medications.image_url IS '약봉투/처방전 사진 (Azure AI Document Intelligence OCR용)';

-- [11. Dietary Preferences] 식사 정보 (수정됨)
CREATE TABLE dietary_preferences (
    diet_id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,

    allergy_foods TEXT[],
    restriction_foods TEXT[],

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_dietary_patient ON dietary_preferences(patient_id);

COMMENT ON TABLE dietary_preferences IS '[환자 기본 정보] 식사 정보 (화면 8)';
COMMENT ON COLUMN dietary_preferences.allergy_foods IS '알레르기 식품 배열 (예: ARRAY[''땅콩'', ''새우'', ''우유''])';
COMMENT ON COLUMN dietary_preferences.restriction_foods IS '식이제한 식품 배열 (예: ARRAY[''밀가루'', ''설탕'', ''염분''])';

-- ============================================
-- 7. 매칭 시스템
-- ============================================

-- [12. Matching Requests] 매칭 요청서
CREATE TABLE matching_requests (
    request_id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,

    required_qualification VARCHAR(50),
    preferred_regions VARCHAR(50),

    preferred_days JSONB NOT NULL,
    preferred_time_slots JSONB NOT NULL,

    additional_request TEXT,
    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT check_days_format CHECK (
        jsonb_typeof(preferred_days) = 'array' AND
        jsonb_array_length(preferred_days) > 0
    ),
    CONSTRAINT check_slots_format CHECK (
        jsonb_typeof(preferred_time_slots) = 'array' AND
        jsonb_array_length(preferred_time_slots) > 0
    )
);

CREATE INDEX idx_matching_requests_patient ON matching_requests(patient_id);
CREATE INDEX idx_matching_requests_active ON matching_requests(is_active) WHERE is_active = TRUE;

COMMENT ON TABLE matching_requests IS '[AI 매칭] 간병인 매칭 요청서 (화면 9)';
COMMENT ON COLUMN matching_requests.preferred_days IS 'JSON 배열 예: ["Mon", "Wed", "Fri"]';
COMMENT ON COLUMN matching_requests.preferred_time_slots IS 'JSON 배열 예: ["09:00-12:00", "18:00-21:00"]';

-- [13. Matching Results] AI 추천 결과
CREATE TABLE matching_results (
    matching_id BIGSERIAL PRIMARY KEY,
    request_id BIGINT NOT NULL REFERENCES matching_requests(request_id) ON DELETE CASCADE,
    caregiver_id BIGINT NOT NULL REFERENCES caregivers(caregiver_id) ON DELETE CASCADE,

    total_score FLOAT NOT NULL,
    grade grade_enum NOT NULL,
    ai_comment TEXT,

    status matching_status_enum DEFAULT 'recommended',

    contract_start_date DATE,
    contract_end_date DATE,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT check_score CHECK (total_score >= 0 AND total_score <= 100),
    CONSTRAINT check_contract_dates CHECK (
        contract_start_date IS NULL OR
        contract_end_date IS NULL OR
        contract_start_date < contract_end_date
    )
);

CREATE INDEX idx_matching_request ON matching_results(request_id);
CREATE INDEX idx_matching_caregiver ON matching_results(caregiver_id);
CREATE INDEX idx_matching_status ON matching_results(status);
CREATE INDEX idx_matching_score ON matching_results(total_score DESC);

COMMENT ON TABLE matching_results IS '[AI 매칭] Azure OpenAI 매칭 추천 결과 (화면 10)';
COMMENT ON COLUMN matching_results.total_score IS '적합도 점수 (0~100)';
COMMENT ON COLUMN matching_results.grade IS '매칭 등급 (A+, A, B+, B, C)';
COMMENT ON COLUMN matching_results.ai_comment IS 'Azure OpenAI가 생성한 추천 사유';

-- ============================================
-- 8. 간병인 리뷰
-- ============================================

-- [14. Reviews] 리뷰 및 평가
CREATE TABLE reviews (
    review_id BIGSERIAL PRIMARY KEY,
    matching_id BIGINT NOT NULL REFERENCES matching_results(matching_id) ON DELETE CASCADE,
    reviewer_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    reviewer_type user_type_enum NOT NULL,

    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE (matching_id, reviewer_id)
);

CREATE INDEX idx_reviews_matching ON reviews(matching_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

COMMENT ON TABLE reviews IS '매칭 완료 후 리뷰 및 평가 (화면 11)';

-- ============================================
-- 9. 간병인 가용성 관리
-- ============================================

-- [15. Caregiver Availability] 간병인 가용 시간
CREATE TABLE caregiver_availability (
    availability_id BIGSERIAL PRIMARY KEY,
    caregiver_id BIGINT NOT NULL REFERENCES caregivers(caregiver_id) ON DELETE CASCADE,

    day_of_week VARCHAR(3) NOT NULL CHECK (day_of_week IN ('Mon','Tue','Wed','Thu','Fri','Sat','Sun')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT check_time_range CHECK (start_time < end_time)
);

CREATE INDEX idx_caregiver_avail ON caregiver_availability(caregiver_id, day_of_week, is_available);

COMMENT ON TABLE caregiver_availability IS '간병인 주간 가용 시간대';

-- ============================================
-- 10. 일정 및 수행 관리
-- ============================================

-- [16. Schedules] 케어 일정
CREATE TABLE schedules (
    schedule_id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
    matching_id BIGINT REFERENCES matching_results(matching_id) ON DELETE CASCADE,

    care_date DATE NOT NULL,
    is_ai_generated BOOLEAN DEFAULT TRUE,

    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_schedules_patient ON schedules(patient_id);
CREATE INDEX idx_schedules_matching ON schedules(matching_id);
CREATE INDEX idx_schedules_date ON schedules(care_date, status);

COMMENT ON TABLE schedules IS '[케어 실행] 케어 일정 (화면 12: Azure OpenAI 자동 생성)';
COMMENT ON COLUMN schedules.patient_id IS '환자 ID (직접 참조 - 매칭 없이도 일정 생성 가능)';
COMMENT ON COLUMN schedules.is_ai_generated IS 'Azure OpenAI가 자동 생성한 일정인지 여부';

-- [17. Care Logs] 수행 체크리스트
CREATE TABLE care_logs (
    log_id BIGSERIAL PRIMARY KEY,
    schedule_id BIGINT NOT NULL REFERENCES schedules(schedule_id) ON DELETE CASCADE,

    category care_category_enum NOT NULL,
    task_name VARCHAR(100) NOT NULL,
    scheduled_time TIME,

    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    note TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_care_logs_schedule ON care_logs(schedule_id);
CREATE INDEX idx_care_logs_category ON care_logs(category);

COMMENT ON TABLE care_logs IS '[케어 실행] 케어 수행 체크리스트 (화면 14)';
COMMENT ON COLUMN care_logs.category IS 'medication(투약), meal(식사), exercise(운동), vital_check(활력징후), hygiene(위생), other(기타)';

-- ============================================
-- 11. AI 생성 데이터
-- ============================================

-- [18. Meal Plans] 추천 식단
CREATE TABLE meal_plans (
    plan_id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,

    meal_date DATE NOT NULL,
    meal_type meal_type_enum NOT NULL,

    menu_name VARCHAR(200) NOT NULL,
    ingredients TEXT,
    nutrition_info JSONB,
    cooking_tips TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_meal_plans_patient_date ON meal_plans(patient_id, meal_date);

COMMENT ON TABLE meal_plans IS '[케어 실행] Azure OpenAI 추천 식단 (화면 13)';
COMMENT ON COLUMN meal_plans.nutrition_info IS '영양 정보 JSON (칼로리, 단백질, 탄수화물 등)';

-- [19. Care Reports] 케어 보고서
CREATE TABLE care_reports (
    report_id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,

    report_type report_type_enum NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,

    medication_completion_rate FLOAT,
    meal_completion_rate FLOAT,
    health_status_summary TEXT,
    improvement_suggestions TEXT,

    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT check_report_dates CHECK (start_date < end_date),
    CONSTRAINT check_med_rate CHECK (medication_completion_rate IS NULL OR (medication_completion_rate >= 0 AND medication_completion_rate <= 100)),
    CONSTRAINT check_meal_rate CHECK (meal_completion_rate IS NULL OR (meal_completion_rate >= 0 AND meal_completion_rate <= 100))
);

CREATE INDEX idx_care_reports_patient ON care_reports(patient_id);

COMMENT ON TABLE care_reports IS '[케어 실행] Azure OpenAI 케어 보고서 (화면 16)';
COMMENT ON COLUMN care_reports.medication_completion_rate IS '약 복용 완료율 (%)';
COMMENT ON COLUMN care_reports.meal_completion_rate IS '식사 섭취율 (%)';
COMMENT ON COLUMN care_reports.health_status_summary IS 'AI 생성 건강 상태 요약';
COMMENT ON COLUMN care_reports.improvement_suggestions IS 'AI 생성 개선 제안';

-- ============================================
-- 12. 트리거 및 함수
-- ============================================

-- updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS
$$

BEGIN
NEW.updated_at = NOW();
RETURN NEW;
END;

$$
LANGUAGE plpgsql;

-- 트리거 적용
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guardians_updated_at
    BEFORE UPDATE ON guardians
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_caregivers_updated_at
    BEFORE UPDATE ON caregivers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matching_results_updated_at
    BEFORE UPDATE ON matching_results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at
    BEFORE UPDATE ON schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 간병인 평균 평점 계산 함수
CREATE OR REPLACE FUNCTION calculate_caregiver_rating(p_caregiver_id BIGINT)
RETURNS VOID AS
$$

DECLARE
v_avg_rating NUMERIC(3, 2);
v_total_reviews INTEGER;
BEGIN
SELECT
COALESCE(AVG(rating), 0),
COUNT(\*)
INTO v_avg_rating, v_total_reviews
FROM reviews r
JOIN matching_results mr ON r.matching_id = mr.matching_id
WHERE mr.caregiver_id = p_caregiver_id;

    UPDATE caregivers
    SET
        avg_rating = v_avg_rating,
        total_reviews = v_total_reviews
    WHERE caregiver_id = p_caregiver_id;

END;

$$
LANGUAGE plpgsql;

-- 리뷰 작성 시 자동으로 평점 업데이트
CREATE OR REPLACE FUNCTION update_caregiver_rating_on_review()
RETURNS TRIGGER AS
$$

DECLARE
v_caregiver_id BIGINT;
BEGIN
SELECT caregiver_id INTO v_caregiver_id
FROM matching_results
WHERE matching_id = NEW.matching_id;

    PERFORM calculate_caregiver_rating(v_caregiver_id);

    RETURN NEW;

END;

$$
LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_caregiver_rating
    AFTER INSERT OR UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_caregiver_rating_on_review();

-- ============================================
-- 13. 통계용 뷰 (View)
-- ============================================

-- 간병인 성과 대시보드
CREATE OR REPLACE VIEW caregiver_stats AS
SELECT
    c.caregiver_id,
    u.name,
    u.phone_number,
    c.experience_years,
    c.service_region,
    c.specialties,
    c.hourly_rate,
    c.avg_rating,
    c.total_reviews,
    COUNT(DISTINCT mr.matching_id) as total_matches,
    COUNT(DISTINCT CASE WHEN mr.status = 'completed' THEN mr.matching_id END) as completed_matches,
    COUNT(DISTINCT CASE WHEN mr.status = 'active' THEN mr.matching_id END) as active_matches
FROM caregivers c
JOIN users u ON c.user_id = u.user_id
LEFT JOIN matching_results mr ON c.caregiver_id = mr.caregiver_id
GROUP BY c.caregiver_id, u.name, u.phone_number, c.experience_years,
         c.service_region, c.specialties, c.hourly_rate, c.avg_rating, c.total_reviews;

COMMENT ON VIEW caregiver_stats IS '간병인 성과 통계 (대시보드용)';

-- 매칭 성공률
CREATE OR REPLACE VIEW matching_success_rate AS
SELECT
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as total_matches,
    COUNT(CASE WHEN status IN ('active', 'completed') THEN 1 END) as successful_matches,
    ROUND(
        100.0 * COUNT(CASE WHEN status IN ('active', 'completed') THEN 1 END) / NULLIF(COUNT(*), 0),
        2
    ) as success_rate_percentage
FROM matching_results
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

COMMENT ON VIEW matching_success_rate IS '월별 매칭 성공률';

-- ============================================
-- 14. 샘플 데이터 (테스트용)
-- ============================================

-- 보호자 계정
INSERT INTO users (email, password_hash, name, phone_number, user_type) VALUES
('guardian1@example.com', '$2b$12$hash1', '김보호', '010-1234-5678', 'guardian'),
('guardian2@example.com', '$2b$12$hash2', '이보호', '010-2345-6789', 'guardian');

-- 간병인 계정
INSERT INTO users (email, password_hash, name, phone_number, user_type) VALUES
('caregiver1@example.com', '$2b$12$hash3', '박간병', '010-3456-7890', 'caregiver'),
('caregiver2@example.com', '$2b$12$hash4', '최간병', '010-4567-8901', 'caregiver');

-- 보호자 프로필
INSERT INTO guardians (user_id, address, relationship_to_patient, emergency_contact) VALUES
(1, '서울시 강남구', '아들', '010-1111-2222'),
(2, '서울시 서초구', '딸', '010-2222-3333');

-- 환자 정보
INSERT INTO patients (guardian_id, name, birth_date, gender, height, weight, care_address, region_code, care_level) VALUES
(1, '김환자', '1950-01-15', 'Male', 170, 65, '서울시 강남구 역삼동', 'SEOUL_GANGNAM', '3등급'),
(2, '이환자', '1948-05-20', 'Female', 160, 55, '서울시 서초구 서초동', 'SEOUL_SEOCHO', '2등급');

-- 간병인 프로필 (시급 포함)
INSERT INTO caregivers (user_id, experience_years, certifications, specialties, service_region, has_vehicle, hourly_rate) VALUES
(3, 5, '요양보호사 1급', ARRAY['치매', '파킨슨'], 'SEOUL_GANGNAM', TRUE, 18000),
(4, 8, '요양보호사 1급, 간호조무사', ARRAY['당뇨', '고혈압'], 'SEOUL_SEOCHO', FALSE, 22000);

-- 환자 성향
INSERT INTO patient_personality (patient_id, empathy_score, activity_score, patience_score, independence_score) VALUES
(1, 75.5, 60.0, 80.0, 50.0),
(2, 85.0, 40.0, 90.0, 30.0);

-- 간병인 성향
INSERT INTO caregiver_personality (caregiver_id, empathy_score, activity_score, patience_score, independence_score) VALUES
(1, 80.0, 70.0, 85.0, 60.0),
(2, 90.0, 50.0, 95.0, 40.0);

-- 식사 정보 (수정된 구조)
INSERT INTO dietary_preferences (patient_id, allergy_foods, restriction_foods) VALUES
(1, ARRAY['땅콩', '새우'], ARRAY['밀가루']),
(2, ARRAY['계란'], ARRAY['설탕', '염분']);

-- ============================================
-- 15. 데이터베이스 검증 쿼리
-- ============================================

-- 모든 테이블 확인
SELECT
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 모든 제약조건 확인
SELECT
    conname AS constraint_name,
    conrelid::regclass AS table_name,
    CASE contype
        WHEN 'c' THEN 'CHECK'
        WHEN 'f' THEN 'FOREIGN KEY'
        WHEN 'p' THEN 'PRIMARY KEY'
        WHEN 'u' THEN 'UNIQUE'
    END AS constraint_type
FROM pg_constraint
WHERE conrelid IN (
    SELECT oid FROM pg_class
    WHERE relnamespace = 'public'::regnamespace
)
ORDER BY table_name, constraint_type;

-- 모든 인덱스 확인
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ============================================
-- 완료!
-- ============================================
$$
