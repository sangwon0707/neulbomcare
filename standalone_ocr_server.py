#!/usr/bin/env python3
"""
OCR 독립 테스트 서버 v2.1 (식약처 API 401 오류 대응)

변경사항:
- 식약처 API 401 오류 시에도 OCR 결과 반환
- OCR만 사용하는 모드 추가
- 더 자세한 오류 메시지

사용법:
1. 환경 변수 설정 (.env 파일)
2. python standalone_ocr_server_v2.py
3. http://localhost:8001/docs 접속
4. 약봉지 이미지 업로드 테스트

필요한 환경 변수:
- AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT (필수)
- AZURE_DOCUMENT_INTELLIGENCE_KEY (필수)
- MFDS_API_KEY (선택사항 - 없으면 식약처 검증 생략)
"""

from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

# OCR 서비스 임포트
try:
    from ocr_service_v2 import OCRService, MedicineInfo
except ImportError:
    print("❌ 오류: ocr_service_v2.py 파일을 찾을 수 없습니다.")
    print("💡 해결: ocr_service_v2.py 파일을 이 파일과 같은 폴더에 복사하세요.")
    exit(1)

# FastAPI 앱 생성
app = FastAPI(
    title="약봉지 OCR 테스트 서버 v2.1",
    description="식약처 API 401 오류 시에도 OCR 결과를 반환합니다",
    version="2.1"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 메모리 저장소
medicine_storage = {}

# Response 스키마
class MedicineDetailResponse(BaseModel):
    """약품 상세 정보"""
    item_name: str
    entp_name: Optional[str] = None
    item_seq: Optional[str] = None
    efficacy: Optional[str] = None
    usage: Optional[str] = None
    precaution: Optional[str] = None
    side_effect: Optional[str] = None
    storage: Optional[str] = None
    interaction: Optional[str] = None
    item_image: Optional[str] = None
    is_verified: bool = True  # 식약처 검증 여부


class OCRResultResponse(BaseModel):
    """OCR 처리 결과"""
    success: bool
    medicines: List[MedicineDetailResponse]
    medicine_names: List[str]
    confidence: float
    unverified_names: List[str]
    message: str
    ocr_only_mode: bool = False  # OCR만 사용했는지 여부


@app.get("/")
async def root():
    """루트 엔드포인트"""
    return {
        "message": "약봉지 OCR 테스트 서버 v2.1",
        "version": "2.1",
        "features": [
            "Azure OCR 지원",
            "식약처 API 검증 (선택)",
            "401 오류 시 OCR 결과만 반환"
        ],
        "docs": "/docs",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """헬스 체크"""
    azure_endpoint = os.getenv("AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT")
    azure_key = os.getenv("AZURE_DOCUMENT_INTELLIGENCE_KEY")
    mfds_key = os.getenv("MFDS_API_KEY")
    
    warnings = []
    if not mfds_key:
        warnings.append("MFDS_API_KEY가 없습니다. OCR만 사용합니다.")
    if not (azure_endpoint and azure_key):
        warnings.append("Azure OCR이 설정되지 않았습니다.")
    
    return {
        "status": "healthy",
        "azure_ocr_configured": bool(azure_endpoint and azure_key),
        "mfds_api_configured": bool(mfds_key),
        "warnings": [w for w in warnings if w]
    }


@app.post("/ocr", response_model=OCRResultResponse)
async def upload_medication_image(
    file: UploadFile = File(..., description="약봉지 사진 파일 (JPG, PNG)"),
    skip_verification: bool = Query(
        False, 
        description="True로 설정하면 식약처 검증을 건너뛰고 OCR만 사용합니다"
    )
):
    """
    약봉지 사진 OCR + 식약처 API 검증
    
    **옵션:**
    - `skip_verification=false`: 식약처 API 검증 시도 (기본값)
    - `skip_verification=true`: OCR만 사용, 검증 생략
    
    **401 오류 대응:**
    - 식약처 API 401 오류 발생 시 자동으로 OCR 결과만 반환
    - `ocr_only_mode=true`로 표시됨
    """
    
    # 1. 파일 형식 검증
    allowed_extensions = {"image/jpeg", "image/jpg", "image/png"}
    if file.content_type not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"지원하지 않는 파일 형식입니다. JPG, PNG만 가능합니다."
        )
    
    # 2. 파일 크기 검증 (10MB)
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="파일 크기가 10MB를 초과합니다."
        )
    
    try:
        # 3. OCR 서비스 생성
        ocr_service = OCRService()
        
        # 4-1. skip_verification=True 또는 MFDS_API_KEY 없으면 OCR만 사용
        if skip_verification or not os.getenv("MFDS_API_KEY"):
            print("\n" + "=" * 80)
            print("🔵 OCR 전용 모드 (식약처 검증 생략)")
            print("=" * 80)
            
            # OCR만 실행
            ocr_result = await ocr_service._extract_text_from_image(contents)
            candidate_names = ocr_result["candidate_names"]
            confidence = ocr_result["confidence"]
            
            if not candidate_names:
                raise HTTPException(
                    status_code=400,
                    detail=f"이미지에서 약 이름을 찾을 수 없습니다.\n\n💡 인식된 텍스트:\n{ocr_result['raw_text'][:500]}"
                )
            
            # OCR 결과를 MedicineDetailResponse 형식으로 변환
            medicines = [
                MedicineDetailResponse(
                    item_name=name,
                    entp_name="(검증 안 함)",
                    is_verified=False
                )
                for name in candidate_names
            ]
            
            print(f"✅ {len(candidate_names)}개 약품 추출 성공:")
            for name in candidate_names:
                print(f"   - {name}")
            
            return OCRResultResponse(
                success=True,
                medicines=medicines,
                medicine_names=candidate_names,
                confidence=confidence,
                unverified_names=[],
                message=f"OCR로 {len(candidate_names)}개의 약 이름을 인식했습니다. (식약처 검증 생략)",
                ocr_only_mode=True
            )
        
        # 4-2. 식약처 검증 시도
        try:
            result = await ocr_service.extract_and_validate_medicines(contents)
            
            verified_medicines = result["medicines"]
            confidence = result["confidence"]
            unverified_names = result["unverified_names"]
            
            # 식약처 검증 성공
            if verified_medicines:
                medicine_names = [med["item_name"] for med in verified_medicines]
                
                medicine_storage["last_upload"] = {
                    "medicines": verified_medicines,
                    "names": medicine_names,
                    "timestamp": "now"
                }
                
                message = f"{len(verified_medicines)}개의 약품이 식약처 DB에서 확인되었습니다."
                if unverified_names:
                    message += f" (미확인: {len(unverified_names)}개)"
                
                return OCRResultResponse(
                    success=True,
                    medicines=[MedicineDetailResponse(**med, is_verified=True) for med in verified_medicines],
                    medicine_names=medicine_names,
                    confidence=confidence,
                    unverified_names=unverified_names,
                    message=message,
                    ocr_only_mode=False
                )
            
            # 식약처 검증 실패 → OCR 결과만 반환
            else:
                ocr_result = await ocr_service._extract_text_from_image(contents)
                candidate_names = ocr_result["candidate_names"]
                
                if not candidate_names:
                    raise HTTPException(
                        status_code=400,
                        detail=f"이미지에서 약 이름을 찾을 수 없습니다.\n\n💡 인식된 모든 텍스트:\n{', '.join(unverified_names[:30])}"
                    )
                
                medicines = [
                    MedicineDetailResponse(
                        item_name=name,
                        entp_name="(식약처 미등록)",
                        is_verified=False
                    )
                    for name in candidate_names
                ]
                
                print(f"⚠️  식약처 검증 실패, OCR 결과 반환:")
                for name in candidate_names:
                    print(f"   - {name}")
                
                return OCRResultResponse(
                    success=True,
                    medicines=medicines,
                    medicine_names=candidate_names,
                    confidence=confidence,
                    unverified_names=unverified_names,
                    message=f"OCR로 {len(candidate_names)}개의 약 이름을 인식했습니다. (식약처 DB 미등록 또는 서버 오류)",
                    ocr_only_mode=True
                )
        
        except Exception as verify_error:
            # 식약처 검증 중 오류 → OCR 결과만 반환
            print(f"\n⚠️  식약처 검증 오류: {str(verify_error)}")
            print("→ OCR 결과만 반환합니다.\n")
            
            ocr_result = await ocr_service._extract_text_from_image(contents)
            candidate_names = ocr_result["candidate_names"]
            confidence = ocr_result["confidence"]
            
            if not candidate_names:
                raise HTTPException(
                    status_code=400,
                    detail=f"이미지에서 약 이름을 찾을 수 없습니다.\n\n💡 인식된 텍스트:\n{ocr_result['raw_text'][:500]}"
                )
            
            medicines = [
                MedicineDetailResponse(
                    item_name=name,
                    entp_name="(검증 오류)",
                    is_verified=False
                )
                for name in candidate_names
            ]
            
            print(f"✅ {len(candidate_names)}개 약품 추출:")
            for name in candidate_names:
                print(f"   - {name}")
            
            return OCRResultResponse(
                success=True,
                medicines=medicines,
                medicine_names=candidate_names,
                confidence=confidence,
                unverified_names=candidate_names,
                message=f"OCR로 {len(candidate_names)}개의 약 이름을 인식했습니다. (식약처 검증 오류: {str(verify_error)[:50]})",
                ocr_only_mode=True
            )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ 전체 오류: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"OCR 처리 중 오류: {str(e)}"
        )


@app.get("/medicines/search")
async def search_medicine(item_name: str):
    """약품명으로 식약처 정보 검색 (테스트용)"""
    try:
        ocr_service = OCRService()
        medicine_info = await ocr_service._verify_medicine_with_mfds(item_name)
        
        if not medicine_info:
            raise HTTPException(
                status_code=404,
                detail=f"'{item_name}' 약품을 찾을 수 없습니다. (401 오류일 수 있음)"
            )
        
        return medicine_info.to_dict()
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"검색 중 오류: {str(e)}"
        )


@app.get("/storage")
async def get_storage():
    """메모리 저장소 확인 (테스트용)"""
    return {
        "storage": medicine_storage,
        "count": len(medicine_storage)
    }


if __name__ == "__main__":
    print("=" * 80)
    print("🏥 약봉지 OCR 독립 테스트 서버 v2.1")
    print("=" * 80)
    
    # 환경 변수 확인
    azure_endpoint = os.getenv("AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT")
    azure_key = os.getenv("AZURE_DOCUMENT_INTELLIGENCE_KEY")
    mfds_key = os.getenv("MFDS_API_KEY")
    
    print("\n📋 환경 변수 확인:")
    print(f"  Azure OCR Endpoint: {'✅ 설정됨' if azure_endpoint else '❌ 없음'}")
    print(f"  Azure OCR Key: {'✅ 설정됨' if azure_key else '❌ 없음'}")
    print(f"  식약처 API Key: {'✅ 설정됨' if mfds_key else '⚠️ 없음 (OCR만 사용)'}")
    
    if not (azure_endpoint and azure_key):
        print("\n❌ Azure OCR 설정이 필요합니다!")
        print("\n.env 파일에 다음 내용을 추가하세요:")
        print("AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=https://your-resource.cognitiveservices.azure.com/")
        print("AZURE_DOCUMENT_INTELLIGENCE_KEY=your-key-here")
        print("MFDS_API_KEY=your-mfds-key-here  # 선택사항")
        exit(1)
    
    if not mfds_key:
        print("\n⚠️  식약처 API 키가 없습니다.")
        print("→ OCR만 사용하는 모드로 작동합니다.")
        print("→ 약 이름은 인식하지만, 효능/용법 등 상세 정보는 제공되지 않습니다.")
    
    print("\n🚀 서버 시작:")
    print("  URL: http://localhost:8001")
    print("  Swagger UI: http://localhost:8001/docs")
    print("\n💡 테스트 방법:")
    print("  1. http://localhost:8001/docs 접속")
    print("  2. POST /ocr 엔드포인트 찾기")
    print("  3. 'Try it out' 클릭")
    print("  4. skip_verification을 true로 설정 (식약처 검증 생략)")
    print("  5. 약봉지 이미지 업로드")
    print("  6. 'Execute' 클릭")
    print("\n" + "=" * 80)
    
    # 서버 실행
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8001,
        log_level="info"
    )