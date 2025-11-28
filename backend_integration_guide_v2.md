# 백엔드 통합 가이드 v2 - 식약처 API 연동

## 🎯 업그레이드된 기능

### v1 (기본 OCR)
```
약봉지 이미지 → Azure OCR → 약 이름 추출 → DB 저장
```

### v2 (식약처 API 검증) ⭐ NEW!
```
약봉지 이미지 → Azure OCR → 약 이름 추출 
              ↓
         식약처 API 검증
              ↓
    실제 약품 정보 조회 (효능, 용법, 주의사항 등)
              ↓
         검증된 약만 DB 저장
```

---

## 📋 변경사항 요약

### 1. 정확도 향상
- ❌ **v1**: OCR 결과를 그대로 저장 → 오타나 잘못된 인식 포함 가능
- ✅ **v2**: 식약처 DB로 검증 → 실제 존재하는 약만 저장

### 2. 추가 정보 제공
- ❌ **v1**: 약 이름만 반환
- ✅ **v2**: 효능, 용법, 주의사항, 부작용, 보관법까지 제공

### 3. API 응답 구조
```json
// v1
{
  "medicine_names": ["아리셉트"]
}

// v2 ⭐
{
  "medicines": [
    {
      "item_name": "아리셉트정5밀리그램",
      "entp_name": "한국화이자제약(주)",
      "efficacy": "알츠하이머형 치매 증상의 치료",
      "usage": "1일 1회 5mg 복용",
      "precaution": "간장애 환자 주의...",
      "side_effect": "오심, 구토, 설사 등...",
      "storage": "실온 보관",
      "interaction": "항콜린제와 병용 주의",
      "item_image": "https://nedrug.mfds.go.kr/..."
    }
  ],
  "medicine_names": ["아리셉트정5밀리그램"],
  "confidence": 0.95,
  "unverified_names": []
}
```

---

## 🔧 1단계: 식약처 API 키 발급

### ① 공공데이터포털 회원가입
1. https://www.data.go.kr 접속
2. 회원가입 (간단한 본인인증)

### ② API 키 발급
1. 검색창에 **"의약품개요정보"** 검색
2. 서비스 상세 페이지에서 **"활용신청"** 클릭
3. 신청 후 즉시 또는 1-2일 내 승인
4. "마이페이지" → "오픈API" → "일반 인증키(Encoding)" 복사

**예시 키**:
```
서비스키: gFy7XjWq8aKpL3vN9mR1bS2tC4uD5eE6fF7gG8hH9iI0jJ1kK2lL3mM4nN5oO6pP7qQ8rR9sS0tT==
```

---

## 🔧 2단계: 환경 변수 설정

### 로컬 개발 (.env)
```bash
# Azure Document Intelligence (기존)
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=https://nuelbomcare-ocr.cognitiveservices.azure.com/
AZURE_DOCUMENT_INTELLIGENCE_KEY=your-azure-key-here

# ⭐ 식약처 API (NEW!)
MFDS_API_KEY=your-mfds-api-key-here
```

### Azure App Service (배포 환경)
Azure Portal → App Service → 구성 → 애플리케이션 설정

다음 환경 변수 추가:
- 이름: `MFDS_API_KEY`
  값: `[복사한 식약처 API 키]`

---

## 🔧 3단계: 패키지 설치

### requirements.txt에 추가
```txt
# 기존 패키지
azure-ai-formrecognizer==3.3.0
azure-core==1.29.0

# ⭐ 식약처 API 호출용 (이미 있을 수도 있음)
requests==2.31.0
```

### 설치
```bash
pip install requests==2.31.0
```

---

## 🔧 4단계: 코드 통합

### Step 1: 파일 교체
```bash
# 기존 ocr_service.py 백업
mv backend/app/services/ocr_service.py backend/app/services/ocr_service_v1_backup.py

# v2 파일로 교체
cp ocr_service_v2.py backend/app/services/ocr_service.py
cp ocr_routes_v2.py backend/app/routes/ocr.py
```

### Step 2: main.py 확인
```python
# backend/app/main.py
from app.routes import ocr

app.include_router(ocr.router, prefix="/api", tags=["OCR"])
```

---

## 🧪 5단계: 테스트

### ① 로컬 서버 실행
```bash
cd backend
uvicorn app.main:app --reload
```

### ② Swagger UI 테스트
1. http://localhost:8000/docs 접속
2. **POST /api/patients/{patient_id}/medications/ocr** 찾기
3. test1.png 이미지 업로드
4. 응답 확인:

**기대 응답:**
```json
{
  "success": true,
  "medicines": [
    {
      "item_name": "약품명",
      "entp_name": "제조사",
      "efficacy": "효능...",
      "usage": "용법...",
      ...
    }
  ],
  "medicine_names": ["약품명"],
  "confidence": 0.95,
  "unverified_names": [],
  "message": "1개의 약품이 확인되었습니다."
}
```

### ③ 추가 테스트 API
**약품 정보 직접 검색:**
```bash
curl "http://localhost:8000/api/medicines/search?item_name=아스피린"
```

---

## 🔍 6단계: 디버깅

### 로그 확인
```python
# 로그 레벨 설정 (main.py)
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

**예상 로그:**
```
2024-11-28 14:30:00 - app.services.ocr_service - INFO - 🔍 1단계: Azure OCR 시작
2024-11-28 14:30:05 - app.services.ocr_service - INFO - 📝 OCR 추출 완료: 3개 후보 약 이름
2024-11-28 14:30:06 - app.services.ocr_service - INFO - ✅ 2단계: 식약처 API 검증 시작
2024-11-28 14:30:07 - app.services.ocr_service - INFO - ✓ 검증 성공: 아스피린
2024-11-28 14:30:08 - app.services.ocr_service - INFO - 🎉 검증 완료: 1개 약품 확인
```

### 일반적인 오류 및 해결

#### 1. 식약처 API 키 오류
```
ERROR - 식약처 API 오류: 401
```
**해결**: 
- API 키가 정확한지 확인
- URL Encoding 필요 없음 (자동 처리됨)
- 승인 대기 중인지 확인 (공공데이터포털)

#### 2. 검증된 약이 없음
```json
{
  "detail": "이미지에서 약 이름을 찾을 수 없습니다."
}
```
**해결**:
- 더 선명한 이미지로 테스트
- OCR 로그 확인 (`raw_ocr_text`)
- `exclude_words`에 실제 약 이름이 포함되어 있는지 확인

#### 3. 타임아웃
```
ERROR - 식약처 API 조회 실패: timeout
```
**해결**:
- 네트워크 연결 확인
- `timeout` 값 증가 (기본 10초 → 30초)

---

## 📊 7단계: 성능 최적화

### ① 캐싱 (선택사항)
자주 검색되는 약품 정보를 메모리에 캐싱:

```python
from functools import lru_cache

@lru_cache(maxsize=1000)
async def _verify_medicine_with_mfds_cached(self, medicine_name: str):
    return await self._verify_medicine_with_mfds(medicine_name)
```

### ② 병렬 처리
여러 약을 동시에 검증:

```python
import asyncio

# 순차 처리 (느림)
for name in candidate_names:
    medicine_info = await self._verify_medicine_with_mfds(name)

# 병렬 처리 (빠름) ⭐
tasks = [self._verify_medicine_with_mfds(name) for name in candidate_names]
results = await asyncio.gather(*tasks)
```

---

## ✅ 통합 완료 체크리스트

### 환경 설정
- [ ] 식약처 API 키 발급 완료
- [ ] .env 파일에 MFDS_API_KEY 추가
- [ ] Azure App Service 환경 변수 설정
- [ ] requests 패키지 설치

### 코드 통합
- [ ] ocr_service_v2.py 파일 적용
- [ ] ocr_routes_v2.py 파일 적용
- [ ] main.py 라우터 등록 확인

### 테스트
- [ ] 로컬에서 Swagger UI 테스트 성공
- [ ] test1.png로 실제 약봉지 테스트
- [ ] 검증된 약 정보 확인 (효능, 용법 등)
- [ ] DB에 올바르게 저장되는지 확인

### 배포
- [ ] Azure App Service에 배포
- [ ] 프로덕션 환경에서 테스트
- [ ] 로그 모니터링

---

## 💡 활용 예시

### 프론트엔드에서 상세 정보 표시
```typescript
const result = await uploadMedicationImage(imageFile);

// 검증된 약 정보 표시
result.medicines.forEach(medicine => {
  console.log(`약 이름: ${medicine.item_name}`);
  console.log(`제조사: ${medicine.entp_name}`);
  console.log(`효능: ${medicine.efficacy}`);
  console.log(`용법: ${medicine.usage}`);
  console.log(`주의사항: ${medicine.precaution}`);
});
```

### AI 챗봇과 연동
```python
# 환자의 약 정보를 바탕으로 AI 상담
patient_medicines = get_patient_medications(patient_id)

prompt = f"""
환자가 복용 중인 약:
{patient_medicines}

환자가 "두통약을 함께 먹어도 되나요?"라고 물었습니다.
상호작용 위험성을 분석하고 답변해주세요.
"""

response = openai.chat.completions.create(...)
```

---

## 📞 문의사항

통합 중 문제가 발생하면:
1. 로그 확인 (uvicorn 콘솔 + Azure App Service 로그)
2. 식약처 API 응답 확인 (requests 라이브러리 디버그)
3. OCR 원본 텍스트 확인 (`raw_ocr_text`)

---

**다음 단계**: 프론트엔드 팀에게 새로운 API 스펙 전달 ✅
