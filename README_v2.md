# 🏥 약봉지 OCR + 식약처 API 통합 프로젝트 (v2)

## 📌 프로젝트 개요

약봉지 사진을 촬영하면:

1. **Azure Document Intelligence**가 약 이름 추출
2. **식약처 의약품개요정보 API**로 실제 약품인지 검증
3. 검증된 약 정보(효능, 용법, 주의사항 등) 제공
4. PostgreSQL DB에 저장

---

## 🎯 핵심 기능

### ✅ v2 업그레이드 (NEW!)

* 식약처 공식 DB로 약품 검증
* 효능, 용법, 주의사항, 부작용, 보관법 제공
* 낱알 이미지 제공
* 오인식 방지 (검증된 약만 저장)

### 🧪 독립 테스트 모드 (NEW!)

* **백엔드 없이 OCR 테스트 가능**
* **식약처 API 없이도 작동** (서버 다운 대비)
* skip_verification 옵션으로 빠른 테스트
* 메모리 기반 임시 저장소

### 기술 스택

* **OCR** : Azure Document Intelligence (한글 지원)
* **검증** : 식약처 의약품개요정보 API
* **백엔드** : FastAPI + PostgreSQL
* **프론트엔드** : React/Next.js
* **독립 테스트** : Standalone 서버 (포트 8001)

---

## 📂 전달 파일 목록

```
outputs/
├── backend_integration_guide_v2.md        # 백엔드 통합 가이드 ⭐
├── frontend_integration_guide_v2.md       # 프론트엔드 가이드 ⭐
│
├── ocr_service_v2.py                      # OCR 서비스 코드 ⭐
├── ocr_routes_v2.py                       # API 라우터 코드 ⭐
│
├── standalone_ocr_server_v2.py     # 독립 실행 서버 (백엔드 없이 테스트) ⭐ NEW!
├── requirements_standalone.txt            # Standalone 서버 패키지 목록
```

---

## 🧪 독립 테스트 (백엔드 없이) ⭐ NEW!

백엔드 통합 전에 OCR 기능만 먼저 테스트할 수 있습니다!

### 장점

✅ 백엔드 설정 불필요

✅ DB 연결 불필요

✅ 빠른 테스트 (5분)

✅ 식약처 API 없이도 작동 (서버 다운 대비)

### 1️⃣ 환경 준비

```bash
# 폴더 생성
mkdir ocr_test && cd ocr_test

# 파일 4개 복사
# - standalone_ocr_server_v2.py
# - ocr_service_v2.py
# - requirements_standalone.txt
# - .env (직접 생성)
```

### 2️⃣ 환경 변수 설정

```bash
# .env 파일 생성
echo "AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=https://nuelbomcare-ocr.cognitiveservices.azure.com/" > .env
echo "AZURE_DOCUMENT_INTELLIGENCE_KEY=your-azure-key" >> .env
echo "MFDS_API_KEY=your-mfds-key" >> .env  # 선택사항
```

 **중요** :

* Azure OCR 키는 **필수**
* 식약처 API 키는 **선택** (없어도 작동)

### 3️⃣ 패키지 설치 및 실행

```bash
# 패키지 설치
pip install -r requirements_standalone.txt

# 서버 실행
python standalone_ocr_server_v2.py

# 출력:
# ✅ Azure Document Intelligence: 연결 성공
# ⚠️  식약처 API: 없음 (OCR만 사용)  ← 이래도 OK!
# 🚀 서버 시작: http://localhost:8001
```

### 4️⃣ 테스트

```bash
# 브라우저 접속
http://localhost:8001/docs

# Swagger UI에서:
1. POST /ocr 클릭
2. Try it out 클릭
3. skip_verification = true 설정  ⭐
4. 약봉지 이미지 업로드
5. Execute 클릭
```

### 5️⃣ 예상 결과

#### ✅ 성공 (식약처 검증 생략)

```json
{
  "success": true,
  "medicines": [
    {"item_name": "슈다페드정", "is_verified": false},
    {"item_name": "베포스타비정", "is_verified": false},
    {"item_name": "뮤테란캡슐200mg", "is_verified": false}
  ],
  "medicine_names": ["슈다페드정", "베포스타비정", "뮤테란캡슐200mg"],
  "ocr_only_mode": true,
  "message": "OCR로 3개의 약 이름을 인식했습니다. (식약처 검증 생략)"
}
```

#### ✅ 성공 (식약처 검증 포함) - API 키 있을 때

```json
{
  "success": true,
  "medicines": [
    {
      "item_name": "한미아스피린장용정100밀리그램",
      "entp_name": "한미약품(주)",
      "efficacy": "심근경색, 뇌경색...",
      "usage": "1회 1정...",
      "is_verified": true
    }
  ],
  "ocr_only_mode": false
}
```

### 📝 skip_verification 옵션

| 옵션            | 동작                    | 사용 시기                        |
| --------------- | ----------------------- | -------------------------------- |
| **true**  | 식약처 검증 생략, OCR만 | 식약처 API 없을 때, 서버 다운 시 |
| **false** | 식약처 검증 시도        | 정상 작동 시, 상세 정보 필요 시  |

## 📊 API 예시

### 요청

```bash
POST /api/patients/1/medications/ocr
Content-Type: multipart/form-data

file: [약봉지 사진]
```

### 응답

```json
{
  "success": true,
  "medicines": [
    {
      "item_name": "한미아스피린장용정100밀리그램",
      "entp_name": "한미약품(주)",
      "efficacy": "심근경색, 뇌경색 혈전 생성 억제...",
      "usage": "1회 1정, 1일 1회 복용...",
      "precaution": "소화성궤양 환자는 복용 금지...",
      "side_effect": "위장출혈, 두드러기 등...",
      "storage": "실온 보관...",
      "interaction": "항응고제 병용 주의...",
      "item_image": "https://nedrug.mfds.go.kr/..."
    }
  ],
  "medicine_names": ["한미아스피린장용정100밀리그램"],
  "confidence": 0.95,
  "unverified_names": [],
  "message": "1개의 약품이 확인되었습니다."
}
```

---

## 🧪 식약처 API 테스트

```bash
# API 키 테스트
export MFDS_API_KEY=your-key-here
python test_mfds_api.py --medicine 아스피린

# 출력 예시:
# ✅ 약품 정보 (첫 번째 결과)
# 제품명: 한미아스피린장용정100밀리그램
# 업체명: 한미약품(주)
# 효능: 심근경색, 뇌경색...
```

## ⚠️ 중요 사항

### 1. 식약처 API 키 승인

* 신청 후 바로 승인
* 승인 전: 테스트 불가
* 승인 확인: 공공데이터포털 마이페이지

### 2. 약품명 정확도

* OCR로 추출한 이름이 식약처 DB와 정확히 일치해야 검증 성공
* 예: "아스피린" → 식약처 DB: "한미아스피린장용정100밀리그램"
* 부분 일치 검색 로직 포함됨

### 3. API 호출 제한

* 무료: 일일 1,000건
* 초과 시: API 키 업그레이드 필요

---

## 🔧 트러블슈팅

### 식약처 API 401 오류 ⭐

```
❌ 식약처 API 오류: 401 Unauthorized
```

 **원인** :

1. **API 키 미승인** (90% 확률)
   * 마이페이지 → 오픈API → 개발계정 → 승인상태 확인
2. **잘못된 API 키**
   * Encoding 키 사용 (Decoding 키 ❌)
   * 앞뒤 공백, 키 잘림
3. **서버 다운**
   * 공공데이터포털 서버 장애 (간혹 발생)

 **즉시 해결** : 식약처 검증 건너뛰기

```bash
# Standalone 서버 사용
python standalone_ocr_server_v2.py

# Swagger UI에서
skip_verification = true  ⭐

# 결과: OCR로 약 이름만 추출 (상세 정보 없음)
```

 **근본 해결** :

1. 공공데이터포털 마이페이지 → 승인 확인
2. "일반 인증키 (Encoding)" 전체 복사
3. .env 파일 업데이트
4. 서버 재시작

---

### 약품 검증 실패

```json
{
  "unverified_names": ["비타민C"]
}
```

 **원인** :

* 일반의약품 (식약처 DB 미등록)
* OCR 오인식
* 약품명 불일치

 **해결** :

1. **OCR 전용 모드 사용**
   ```bash
   skip_verification = true
   # → OCR 결과만 받기 (검증 없이)
   ```
2. **필터링 개선**
   * `ocr_service.py`의 `exclude_words` 조정
   * 증상, 질환명, 제형 등 제외
3. **부분 일치 검색**
   * 식약처 DB에서 유사 약품명 검색

---

### 약 이름을 못 찾는 경우

```json
{
  "detail": "이미지에서 약 이름을 찾을 수 없습니다"
}
```

 **원인** :

* 이미지 품질 낮음 (흐림, 어두움)
* 약 이름이 없는 부분 촬영
* OCR 필터링이 너무 강함

 **해결** :

1. **이미지 재촬영**
   * 밝은 곳에서 촬영
   * 약 이름 부분 클로즈업
   * 흔들림 방지
2. **필터링 완화**
   ```python
   # ocr_service.py에서
   self.exclude_words에서 일부 제거
   ```
3. **로그 확인**
   ```bash
   # 서버 터미널에서
   ✅ 약품 인식: 슈다페드정
   ❌ 제외 단어: 복용
   ```

---

### OCR 정확도가 낮은 경우

 **개선 방법** :

1. **이미지 전처리**
   * 명암 조정
   * 노이즈 제거
   * 회전 보정
2. **Azure OCR 설정**
   * `prebuilt-read` 모델 사용 (현재)
   * 한글 언어 명시
3. **후처리 로직 강화**
   ```python
   # 약품명 패턴 개선
   medicine_pattern = re.compile(
       r'[가-힣]{2,}(?:\d+(?:mg|밀리그램|정|캡슐)?)?'
   )
   ```

---

### 환경 변수 인식 안 됨

```
ValueError: Azure Document Intelligence 환경 변수가 설정되지 않았습니다.
```

 **해결** :

```bash
# 1. .env 파일 위치 확인
ls -la .env

# 2. 환경 변수 직접 설정
export AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=...
export AZURE_DOCUMENT_INTELLIGENCE_KEY=...

# 3. 서버 재시작
python standalone_ocr_server_v2.py
```

---

## 📊 성능 지표

### 목표

* OCR 정확도: 90% 이상
* 식약처 검증 성공률: 85% 이상
* API 응답 시간: 10초 이내

### 현재 (예상)

* OCR 정확도: ~95% (Azure Document Intelligence)
* 검증 성공률: ~80% (일반의약품 제외)
* 응답 시간: 5-8초
