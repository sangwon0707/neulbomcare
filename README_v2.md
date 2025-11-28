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
- 식약처 공식 DB로 약품 검증
- 효능, 용법, 주의사항, 부작용, 보관법 제공
- 낱알 이미지 제공
- 오인식 방지 (검증된 약만 저장)

### 기술 스택
- **OCR**: Azure Document Intelligence (한글 지원)
- **검증**: 식약처 의약품개요정보 API
- **백엔드**: FastAPI + PostgreSQL
- **프론트엔드**: React/Next.js

---

## 📂 전달 파일 목록

```
outputs/
├── 00_전체_프로젝트_가이드.md              # 전체 개요 (먼저 읽기!)
├── azure_document_intelligence_setup.md    # Azure OCR 설정
├── backend_integration_guide_v2.md        # 백엔드 통합 가이드 ⭐
├── frontend_integration_guide_v2.md       # 프론트엔드 가이드 ⭐
├── ocr_service_v2.py                      # OCR 서비스 코드 ⭐
├── ocr_routes_v2.py                       # API 라우터 코드 ⭐
└── test_mfds_api.py                       # 식약처 API 테스트 스크립트
```

---

## 🚀 빠른 시작 (Quick Start)

### 1️⃣ Azure 설정
```bash
# Azure Portal에서 Document Intelligence 리소스 생성
# 엔드포인트 URL과 API 키 복사
```

### 2️⃣ 식약처 API 키 발급
```bash
# 1. https://www.data.go.kr 접속
# 2. "의약품개요정보" 검색
# 3. 활용신청 → 승인 대기 (1-2일)
# 4. 마이페이지 → 인증키 복사
```

### 3️⃣ 환경 변수 설정
```bash
# backend/.env
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=https://nuelbomcare-ocr.cognitiveservices.azure.com/
AZURE_DOCUMENT_INTELLIGENCE_KEY=your-azure-key
MFDS_API_KEY=your-mfds-key  # ⭐ NEW!
```

### 4️⃣ 패키지 설치
```bash
cd backend
pip install azure-ai-formrecognizer requests
```

### 5️⃣ 코드 통합
```bash
# 파일 복사
cp ocr_service_v2.py backend/app/services/ocr_service.py
cp ocr_routes_v2.py backend/app/routes/ocr.py
```

### 6️⃣ 테스트
```bash
# 로컬 서버 실행
uvicorn app.main:app --reload

# 브라우저에서
# http://localhost:8000/docs
# → POST /api/patients/{id}/medications/ocr 테스트
```

---

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

---

## 👥 팀 역할

### 여연님 (AI/ML)
- [x] Azure Document Intelligence 설정
- [x] 식약처 API 키 발급
- [x] OCR 서비스 코드 작성
- [ ] 백엔드 팀 지원

### 백엔드 팀
- [ ] ocr_service_v2.py 통합
- [ ] ocr_routes_v2.py 통합
- [ ] 환경 변수 설정
- [ ] API 테스트
- [ ] 배포

### 프론트엔드 팀
- [ ] MedicationOCR 컴포넌트 구현
- [ ] MedicineCard 컴포넌트 구현
- [ ] 약품 상세 정보 UI
- [ ] 미검증 약 경고 표시

---

## 📝 작업 순서

### Day 1 (오늘)
- [x] Azure Document Intelligence 설정 ✅
- [ ] 식약처 API 키 발급 (승인 대기 1-2일)
- [ ] 백엔드 코드 통합
- [ ] 로컬 테스트

### Day 2 (내일)
- [ ] 식약처 API 키 승인 확인
- [ ] OCR + 식약처 API 통합 테스트
- [ ] 프론트엔드 UI 구현

### Day 3 (모레)
- [ ] 프론트-백 통합 테스트
- [ ] Azure 배포
- [ ] 실제 약봉지로 테스트

---

## ⚠️ 중요 사항

### 1. 식약처 API 키 승인
- 신청 후 1-2일 소요
- 승인 전: 테스트 불가
- 승인 확인: 공공데이터포털 마이페이지

### 2. 약품명 정확도
- OCR로 추출한 이름이 식약처 DB와 정확히 일치해야 검증 성공
- 예: "아스피린" → 식약처 DB: "한미아스피린장용정100밀리그램"
- 부분 일치 검색 로직 포함됨

### 3. API 호출 제한
- 무료: 일일 1,000건
- 초과 시: API 키 업그레이드 필요

---

## 🔧 트러블슈팅

### 식약처 API 401 오류
```
❌ 식약처 API 오류: 401
```
**해결**:
1. API 키 확인
2. 승인 여부 확인
3. 환경 변수 재확인

### 약품 검증 실패
```json
{
  "unverified_names": ["비타민C"]
}
```
**원인**:
- 일반의약품 (식약처 DB 미등록)
- OCR 오인식
- 약품명 불일치

**해결**:
- `ocr_service.py`의 `_filter_medicine_names()` 개선
- 부분 일치 검색 로직 추가
- `exclude_words` 목록 조정

---

## 📊 성능 지표

### 목표
- OCR 정확도: 90% 이상
- 식약처 검증 성공률: 85% 이상
- API 응답 시간: 10초 이내

### 현재 (예상)
- OCR 정확도: ~95% (Azure Document Intelligence)
- 검증 성공률: ~80% (일반의약품 제외)
- 응답 시간: 5-8초

---

## 💡 추가 개선 아이디어

### Phase 3 (해커톤 이후)
1. **약품 이미지 비교**
   - OCR로 추출한 약과 낱알 이미지 비교
   - 컴퓨터 비전으로 시각적 검증

2. **복약 일정 관리**
   - 용법 정보 기반 알림 설정
   - 캘린더 연동

3. **약물 상호작용 경고**
   - 여러 약 복용 시 자동 체크
   - 위험 조합 경고

---

## 📞 문의 및 지원

### 식약처 API 관련
- 공공데이터포털: https://www.data.go.kr
- 고객센터: 02-6923-3751

### Azure Document Intelligence
- 공식 문서: https://learn.microsoft.com/ko-kr/azure/ai-services/document-intelligence/
- 지원: Azure Portal 채팅

---

## ✅ 최종 체크리스트

### 환경 설정
- [ ] Azure Document Intelligence 리소스 생성
- [ ] 식약처 API 키 발급 (승인 완료)
- [ ] 환경 변수 설정 (.env 및 Azure)

### 백엔드
- [ ] ocr_service_v2.py 통합
- [ ] ocr_routes_v2.py 통합
- [ ] requirements.txt 업데이트
- [ ] 로컬 테스트 성공
- [ ] Azure 배포

### 프론트엔드
- [ ] API 타입 정의
- [ ] OCR 컴포넌트 구현
- [ ] 약품 카드 UI
- [ ] 상세 정보 표시
- [ ] 에러 처리

### 테스트
- [ ] test_mfds_api.py 실행 성공
- [ ] test1.png로 실제 테스트
- [ ] 다양한 약봉지로 테스트
- [ ] 모바일 디바이스 테스트

---

## 🎉 완료 후 기대 효과

1. **사용자 경험 향상**
   - 약 이름 수동 입력 불필요
   - 상세 정보 자동 제공
   - 오입력 방지

2. **의료 안전성**
   - 식약처 공식 DB 검증
   - 정확한 약품 정보
   - 복약 지도 개선

3. **개발 효율성**
   - 자동화된 데이터 수집
   - API 재사용성
   - 확장 가능한 구조

---

**화이팅! 해커톤 성공하세요! 🚀**
