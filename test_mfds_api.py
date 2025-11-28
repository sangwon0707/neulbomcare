#!/usr/bin/env python3
"""
식약처 의약품개요정보 API 테스트 스크립트

사용법:
1. 공공데이터포털에서 API 키 발급
2. MFDS_API_KEY 환경 변수 설정
3. python test_mfds_api.py

또는:
python test_mfds_api.py --api-key YOUR_API_KEY --medicine 아스피린
"""

import requests
import json
import os
import argparse
from urllib.parse import quote


def test_mfds_api(api_key: str, medicine_name: str = "아스피린"):
    """식약처 API 테스트"""
    
    print("=" * 80)
    print("🏥 식약처 의약품개요정보 API 테스트")
    print("=" * 80)
    
    # API 엔드포인트
    url = "http://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList"
    
    # 요청 파라미터
    params = {
        'serviceKey': api_key,
        'itemName': medicine_name,
        'pageNo': 1,
        'numOfRows': 10,
        'type': 'json'
    }
    
    print(f"\n📤 요청 정보:")
    print(f"  - URL: {url}")
    print(f"  - 약품명: {medicine_name}")
    print(f"  - API 키: {api_key[:20]}...")
    
    try:
        # API 호출
        print(f"\n⏳ API 호출 중...")
        response = requests.get(url, params=params, timeout=10)
        
        print(f"\n📥 응답 정보:")
        print(f"  - 상태 코드: {response.status_code}")
        print(f"  - 응답 시간: {response.elapsed.total_seconds():.2f}초")
        
        if response.status_code != 200:
            print(f"\n❌ 오류: HTTP {response.status_code}")
            print(f"응답 내용: {response.text[:200]}")
            return False
        
        # JSON 파싱
        data = response.json()
        
        # 응답 구조 확인
        header = data.get('header', {})
        body = data.get('body', {})
        
        result_code = header.get('resultCode', 'N/A')
        result_msg = header.get('resultMsg', 'N/A')
        
        print(f"\n📊 API 응답:")
        print(f"  - 결과 코드: {result_code}")
        print(f"  - 결과 메시지: {result_msg}")
        
        if result_code != '00':
            print(f"\n❌ API 오류: {result_msg}")
            return False
        
        # 검색 결과 확인
        total_count = body.get('totalCount', 0)
        items = body.get('items', [])
        
        print(f"\n🔍 검색 결과:")
        print(f"  - 총 {total_count}개 약품 발견")
        
        if not items:
            print(f"\n⚠️ '{medicine_name}' 약품을 찾을 수 없습니다.")
            return False
        
        # 첫 번째 약품 정보 표시
        if isinstance(items, list):
            item = items[0]
        else:
            item = items
        
        print("\n" + "=" * 80)
        print("✅ 약품 정보 (첫 번째 결과)")
        print("=" * 80)
        
        print(f"\n📋 기본 정보:")
        print(f"  제품명: {item.get('itemName', 'N/A')}")
        print(f"  업체명: {item.get('entpName', 'N/A')}")
        print(f"  품목기준코드: {item.get('itemSeq', 'N/A')}")
        
        print(f"\n💊 효능:")
        efficacy = item.get('efcyQesitm', 'N/A')
        print(f"  {clean_html(efficacy)[:200]}...")
        
        print(f"\n📖 사용법:")
        usage = item.get('useMethodQesitm', 'N/A')
        print(f"  {clean_html(usage)[:200]}...")
        
        print(f"\n⚠️ 주의사항:")
        precaution = item.get('atpnQesitm', 'N/A')
        print(f"  {clean_html(precaution)[:200]}...")
        
        print(f"\n🖼️ 낱알 이미지:")
        image_url = item.get('itemImage', '')
        if image_url:
            print(f"  {image_url}")
        else:
            print(f"  (이미지 없음)")
        
        # 전체 응답 저장
        output_file = f"mfds_api_response_{medicine_name}.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"\n💾 전체 응답이 '{output_file}'에 저장되었습니다.")
        
        print("\n" + "=" * 80)
        print("✅ 테스트 성공!")
        print("=" * 80)
        
        return True
        
    except requests.exceptions.Timeout:
        print(f"\n❌ 타임아웃: API 응답 시간 초과 (10초)")
        return False
    
    except requests.exceptions.RequestException as e:
        print(f"\n❌ 네트워크 오류: {str(e)}")
        return False
    
    except json.JSONDecodeError as e:
        print(f"\n❌ JSON 파싱 오류: {str(e)}")
        print(f"응답 내용: {response.text[:500]}")
        return False
    
    except Exception as e:
        print(f"\n❌ 예상치 못한 오류: {str(e)}")
        return False


def clean_html(text: str) -> str:
    """HTML 태그 제거"""
    import re
    if not text:
        return ''
    text = re.sub(r'<p>|</p>', '', text)
    text = re.sub(r'<[^>]+>', '', text)
    return text.strip()


def main():
    parser = argparse.ArgumentParser(
        description='식약처 의약품개요정보 API 테스트'
    )
    parser.add_argument(
        '--api-key',
        help='식약처 API 키 (또는 MFDS_API_KEY 환경 변수 사용)'
    )
    parser.add_argument(
        '--medicine',
        default='아스피린',
        help='검색할 약품명 (기본값: 아스피린)'
    )
    
    args = parser.parse_args()
    
    # API 키 확인
    api_key = args.api_key or os.getenv('MFDS_API_KEY')
    
    if not api_key:
        print("❌ API 키가 필요합니다!")
        print("\n다음 중 하나를 선택하세요:")
        print("  1. --api-key 옵션으로 전달:")
        print("     python test_mfds_api.py --api-key YOUR_API_KEY")
        print("\n  2. 환경 변수 설정:")
        print("     export MFDS_API_KEY=YOUR_API_KEY")
        print("     python test_mfds_api.py")
        print("\n💡 API 키 발급:")
        print("   https://www.data.go.kr → 의약품개요정보 검색 → 활용신청")
        return
    
    # 테스트 실행
    success = test_mfds_api(api_key, args.medicine)
    
    if not success:
        print("\n💡 문제 해결:")
        print("  1. API 키가 올바른지 확인")
        print("  2. 승인 대기 중인지 확인 (공공데이터포털 마이페이지)")
        print("  3. 네트워크 연결 확인")
        print("  4. 다른 약품명으로 재시도 (예: --medicine 타이레놀)")


if __name__ == '__main__':
    main()
