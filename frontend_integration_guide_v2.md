# 프론트엔드 통합 가이드 v2 - 약품 상세 정보 표시

## 🎯 업그레이드된 기능

### v1
- 약 이름만 표시

### v2 ⭐ NEW!
- 약 이름 + 효능 + 용법 + 주의사항
- 식약처 검증 배지 표시
- 약품 이미지 표시
- 미검증 약 경고

---

## 📱 UI/UX 개선사항

### Before (v1)
```
✓ 아리셉트
✓ 메트포르민
```

### After (v2)
```
┌─────────────────────────────────┐
│ ✓ 아리셉트정5밀리그램          │
│   한국화이자제약(주)            │
│   📋 알츠하이머형 치매 치료    │
│   💊 1일 1회 5mg 복용          │
│   ⚠️ 간장애 환자 주의          │
│   [상세보기]                    │
└─────────────────────────────────┘

⚠️ 검증 안 됨: 비타민C (등록되지 않은 약)
```

---

## 📋 새로운 API 응답 구조

### POST /api/patients/{patient_id}/medications/ocr

**응답 (성공):**
```typescript
interface OCRResultResponse {
  success: boolean;
  medicines: MedicineDetail[];
  medicine_names: string[];  // DB에 저장된 약 이름
  confidence: number;
  unverified_names: string[];
  message: string;
}

interface MedicineDetail {
  item_name: string;        // 제품명
  entp_name: string;        // 제조사
  item_seq: string;         // 품목기준코드
  efficacy: string;         // 효능
  usage: string;            // 사용법
  precaution: string;       // 주의사항
  side_effect: string;      // 부작용
  storage: string;          // 보관법
  interaction: string;      // 상호작용
  item_image: string;       // 낱알 이미지 URL
}
```

**예시:**
```json
{
  "success": true,
  "medicines": [
    {
      "item_name": "한미아스피린장용정100밀리그램",
      "entp_name": "한미약품(주)",
      "item_seq": "200003092",
      "efficacy": "심근경색, 뇌경색, 불안정형 협심증에서 혈전 생성 억제...",
      "usage": "성인은 1회 1정, 1일 1회 복용합니다. 충분한 물과 함께 식전에 복용...",
      "precaution": "소화성궤양, 아스피린천식 환자는 복용하지 마십시오...",
      "side_effect": "위장출혈, 두드러기, 천식발작 등이 나타날 수 있습니다...",
      "storage": "습기를 피해 실온에서 보관하십시오...",
      "interaction": "항응고제, 이부프로펜과 병용 시 주의...",
      "item_image": "https://nedrug.mfds.go.kr/pbp/cmn/itemImageDownload/..."
    }
  ],
  "medicine_names": ["한미아스피린장용정100밀리그램"],
  "confidence": 0.95,
  "unverified_names": [],
  "message": "1개의 약품이 확인되었습니다."
}
```

---

## 💻 React 컴포넌트 구현

### 1. 메인 컴포넌트

```typescript
// components/MedicationOCR_v2.tsx
import { useState } from 'react';

interface MedicineDetail {
  item_name: string;
  entp_name: string;
  efficacy: string;
  usage: string;
  precaution: string;
  side_effect: string;
  storage: string;
  interaction: string;
  item_image: string;
}

interface OCRResult {
  success: boolean;
  medicines: MedicineDetail[];
  medicine_names: string[];
  confidence: number;
  unverified_names: string[];
  message: string;
}

export default function MedicationOCR({ patientId }: { patientId: number }) {
  const [isLoading, setIsLoading] = useState(false);
  const [ocrResult, setOCRResult] = useState<OCRResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(
        `/api/patients/${patientId}/medications/ocr`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'OCR 처리 실패');
      }

      const data: OCRResult = await response.json();
      setOCRResult(data);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) uploadImage(file);
    };
    input.click();
  };

  return (
    <div className="medication-ocr">
      {/* 촬영 버튼 */}
      <button
        onClick={handleCameraCapture}
        className="ocr-button"
        disabled={isLoading}
      >
        📷 약봉지 사진 촬영
        <span className="badge">AI 검증</span>
      </button>

      {/* 로딩 */}
      {isLoading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>약 정보를 확인하는 중...</p>
          <small>식약처 데이터베이스 검증 중</small>
        </div>
      )}

      {/* 에러 */}
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {/* OCR 결과 */}
      {ocrResult && (
        <div className="ocr-result">
          <div className="result-header">
            <h3>{ocrResult.message}</h3>
            <span className="confidence">
              신뢰도: {(ocrResult.confidence * 100).toFixed(0)}%
            </span>
          </div>

          {/* 검증된 약 목록 */}
          {ocrResult.medicines.map((medicine, index) => (
            <MedicineCard key={index} medicine={medicine} />
          ))}

          {/* 미검증 약 경고 */}
          {ocrResult.unverified_names.length > 0 && (
            <div className="unverified-warning">
              <h4>⚠️ 확인이 필요한 약</h4>
              <p>다음 약은 식약처 데이터베이스에서 찾을 수 없습니다:</p>
              <ul>
                {ocrResult.unverified_names.map((name, i) => (
                  <li key={i}>{name}</li>
                ))}
              </ul>
              <small>
                * 일반의약품이거나 OCR이 잘못 인식했을 수 있습니다.
              </small>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="actions">
            <button onClick={handleCameraCapture}>다시 촬영</button>
            <button onClick={() => setOCRResult(null)}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 2. 약품 카드 컴포넌트

```typescript
// components/MedicineCard.tsx
import { useState } from 'react';

function MedicineCard({ medicine }: { medicine: MedicineDetail }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="medicine-card">
      {/* 기본 정보 */}
      <div className="medicine-header">
        {medicine.item_image && (
          <img 
            src={medicine.item_image} 
            alt={medicine.item_name}
            className="medicine-image"
          />
        )}
        <div className="medicine-info">
          <h4>
            ✓ {medicine.item_name}
            <span className="verified-badge">식약처 검증</span>
          </h4>
          <p className="manufacturer">{medicine.entp_name}</p>
        </div>
      </div>

      {/* 간략 정보 */}
      <div className="medicine-summary">
        <div className="info-row">
          <span className="icon">📋</span>
          <span className="label">효능:</span>
          <span className="value">
            {medicine.efficacy.substring(0, 50)}...
          </span>
        </div>
        <div className="info-row">
          <span className="icon">💊</span>
          <span className="label">용법:</span>
          <span className="value">
            {medicine.usage.substring(0, 50)}...
          </span>
        </div>
      </div>

      {/* 상세보기 버튼 */}
      <button 
        className="expand-button"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? '접기 ▲' : '상세보기 ▼'}
      </button>

      {/* 상세 정보 (확장 시) */}
      {isExpanded && (
        <div className="medicine-details">
          <DetailSection 
            icon="📋"
            title="효능" 
            content={medicine.efficacy}
          />
          <DetailSection 
            icon="💊"
            title="사용법" 
            content={medicine.usage}
          />
          <DetailSection 
            icon="⚠️"
            title="주의사항" 
            content={medicine.precaution}
            isWarning
          />
          <DetailSection 
            icon="🔄"
            title="상호작용" 
            content={medicine.interaction}
          />
          <DetailSection 
            icon="😵"
            title="부작용" 
            content={medicine.side_effect}
          />
          <DetailSection 
            icon="📦"
            title="보관법" 
            content={medicine.storage}
          />
        </div>
      )}
    </div>
  );
}

function DetailSection({ 
  icon, 
  title, 
  content, 
  isWarning = false 
}: {
  icon: string;
  title: string;
  content: string;
  isWarning?: boolean;
}) {
  return (
    <div className={`detail-section ${isWarning ? 'warning' : ''}`}>
      <h5>
        <span className="icon">{icon}</span>
        {title}
      </h5>
      <p>{content}</p>
    </div>
  );
}
```

### 3. 스타일링 (CSS/Tailwind)

```css
/* styles/MedicationOCR_v2.css */

.medicine-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.medicine-header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 16px;
}

.medicine-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 8px;
  background: #f3f4f6;
  padding: 8px;
}

.medicine-info h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.verified-badge {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.manufacturer {
  color: #6b7280;
  font-size: 13px;
}

.medicine-summary {
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin-bottom: 8px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-row .icon {
  font-size: 16px;
  flex-shrink: 0;
}

.info-row .label {
  font-weight: 600;
  color: #374151;
  min-width: 60px;
  flex-shrink: 0;
}

.info-row .value {
  color: #6b7280;
  flex: 1;
}

.expand-button {
  width: 100%;
  padding: 10px;
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  transition: background 0.2s;
}

.expand-button:hover {
  background: #e5e7eb;
}

.medicine-details {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.detail-section {
  margin-bottom: 20px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.detail-section.warning {
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
}

.detail-section h5 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.detail-section p {
  font-size: 13px;
  line-height: 1.6;
  color: #4b5563;
  white-space: pre-line;
}

.unverified-warning {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
}

.unverified-warning h4 {
  color: #dc2626;
  font-size: 14px;
  margin-bottom: 8px;
}

.unverified-warning ul {
  margin: 12px 0;
  padding-left: 20px;
}

.unverified-warning li {
  color: #991b1b;
  margin-bottom: 4px;
}

.unverified-warning small {
  display: block;
  margin-top: 12px;
  color: #9ca3af;
  font-size: 12px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
}

.confidence {
  background: #dbeafe;
  color: #1e40af;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
}
```

---

## 🎨 UI 개선 아이디어

### 1. 약품 이미지 갤러리
```typescript
{medicine.item_image && (
  <div className="image-gallery">
    <img src={medicine.item_image} alt="낱알 이미지" />
    <button onClick={() => openImageModal(medicine.item_image)}>
      확대보기
    </button>
  </div>
)}
```

### 2. 복약 알림 설정
```typescript
<button onClick={() => setMedicationReminder(medicine)}>
  ⏰ 복약 알림 설정
</button>
```

### 3. 약품 북마크
```typescript
<button onClick={() => saveMedicineFavorite(medicine)}>
  ⭐ 즐겨찾기 추가
</button>
```

---

## ✅ 통합 완료 체크리스트

- [ ] API 응답 타입 정의 (TypeScript)
- [ ] MedicationOCR 컴포넌트 구현
- [ ] MedicineCard 컴포넌트 구현
- [ ] 스타일링 완료
- [ ] 상세보기 확장/축소 기능
- [ ] 미검증 약 경고 표시
- [ ] 로딩 상태 처리
- [ ] 에러 핸들링
- [ ] 모바일 반응형 디자인
- [ ] 접근성 (a11y) 개선

---

## 📱 모바일 최적화

```css
@media (max-width: 768px) {
  .medicine-header {
    flex-direction: column;
  }
  
  .medicine-image {
    width: 100%;
    height: auto;
    max-height: 200px;
  }
  
  .detail-section p {
    font-size: 12px;
  }
}
```

---

**다음 단계**: 백엔드 API 배포 후 실제 데이터로 테스트! 🚀
