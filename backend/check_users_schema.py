"""
Azure PostgreSQL의 users 테이블 스키마 확인 스크립트
gender 컬럼이 추가되었는지 확인합니다.
"""

from sqlalchemy import create_engine, text, inspect
from app.core.config import get_settings

def check_users_table_schema():
    settings = get_settings()
    engine = create_engine(settings.DATABASE_URL)
    
    print("=" * 60)
    print("🔍 Azure PostgreSQL - users 테이블 스키마 확인")
    print("=" * 60)
    
    try:
        # 방법 1: SQLAlchemy Inspector 사용
        inspector = inspect(engine)
        columns = inspector.get_columns('users')
        
        print("\n📋 users 테이블의 모든 컬럼:")
        print("-" * 60)
        
        gender_exists = False
        for col in columns:
            col_name = col['name']
            col_type = str(col['type'])
            nullable = "NULL" if col['nullable'] else "NOT NULL"
            
            # gender 컬럼 체크
            if col_name == 'gender':
                gender_exists = True
                print(f"✅ {col_name:20} {col_type:30} {nullable}")
            else:
                print(f"   {col_name:20} {col_type:30} {nullable}")
        
        print("-" * 60)
        
        # 방법 2: 직접 SQL 쿼리로 확인
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns
                WHERE table_name = 'users' AND column_name = 'gender'
            """))
            
            gender_col = result.fetchone()
            
            print("\n🔎 gender 컬럼 상세 정보:")
            print("-" * 60)
            
            if gender_col:
                print(f"✅ gender 컬럼이 존재합니다!")
                print(f"   - 컬럼명: {gender_col[0]}")
                print(f"   - 데이터 타입: {gender_col[1]}")
                print(f"   - NULL 허용: {gender_col[2]}")
                print(f"   - 기본값: {gender_col[3] or 'None'}")
            else:
                print("❌ gender 컬럼이 존재하지 않습니다!")
            
            # Enum 타입 확인
            print("\n🔎 user_gender_enum 타입 확인:")
            print("-" * 60)
            
            enum_result = conn.execute(text("""
                SELECT typname, enumlabel
                FROM pg_type t
                JOIN pg_enum e ON t.oid = e.enumtypid
                WHERE typname = 'user_gender_enum'
                ORDER BY enumsortorder
            """))
            
            enum_values = enum_result.fetchall()
            
            if enum_values:
                print(f"✅ user_gender_enum 타입이 존재합니다!")
                print(f"   - 가능한 값: {[v[1] for v in enum_values]}")
            else:
                print("❌ user_gender_enum 타입이 존재하지 않습니다!")
            
            # 실제 데이터 확인
            print("\n📊 users 테이블 데이터 샘플 (최대 5개):")
            print("-" * 60)
            
            if gender_exists:
                sample_result = conn.execute(text("""
                    SELECT user_id, name, user_type, gender
                    FROM users
                    LIMIT 5
                """))
                
                samples = sample_result.fetchall()
                if samples:
                    for row in samples:
                        print(f"   user_id={row[0]}, name={row[1]}, type={row[2]}, gender={row[3]}")
                else:
                    print("   (데이터 없음)")
            else:
                print("   gender 컬럼이 없어서 데이터 조회 불가")
        
        print("\n" + "=" * 60)
        
        # 최종 결과
        if gender_exists:
            print("✅ 결론: users.gender 컬럼이 정상적으로 추가되었습니다!")
        else:
            print("❌ 결론: users.gender 컬럼이 아직 추가되지 않았습니다!")
        
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ 오류 발생: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        engine.dispose()

if __name__ == "__main__":
    check_users_table_schema()
