"""
Azure PostgreSQL에 user_gender_enum 타입 생성 및 gender 컬럼 타입 변경
현재 VARCHAR(10)으로 되어있는 gender 컬럼을 user_gender_enum으로 변경합니다.
"""

from sqlalchemy import create_engine, text
from app.core.config import get_settings

def migrate_gender_column():
    settings = get_settings()
    engine = create_engine(settings.DATABASE_URL)
    
    print("=" * 60)
    print("🔧 gender 컬럼 Enum 타입 마이그레이션")
    print("=" * 60)
    
    try:
        with engine.connect() as conn:
            # 1. user_gender_enum 타입이 이미 존재하는지 확인
            check_enum = conn.execute(text("""
                SELECT EXISTS (
                    SELECT 1 FROM pg_type WHERE typname = 'user_gender_enum'
                )
            """))
            enum_exists = check_enum.scalar()
            
            if not enum_exists:
                print("\n✅ Step 1: user_gender_enum 타입 생성")
                conn.execute(text("""
                    CREATE TYPE user_gender_enum AS ENUM ('Male', 'Female')
                """))
                conn.commit()
                print("   ✓ user_gender_enum 타입이 생성되었습니다.")
            else:
                print("\n⏭️  Step 1: user_gender_enum 타입이 이미 존재합니다.")
            
            # 2. gender 컬럼의 현재 타입 확인
            check_column_type = conn.execute(text("""
                SELECT data_type 
                FROM information_schema.columns 
                WHERE table_name = 'users' AND column_name = 'gender'
            """))
            current_type = check_column_type.scalar()
            
            print(f"\n📊 현재 gender 컬럼 타입: {current_type}")
            
            # 3. VARCHAR인 경우 user_gender_enum으로 변경
            if current_type and 'character varying' in current_type:
                print("\n✅ Step 2: gender 컬럼 타입을 user_gender_enum으로 변경")
                
                # 기존 데이터가 있는지 확인
                check_data = conn.execute(text("""
                    SELECT COUNT(*) FROM users WHERE gender IS NOT NULL
                """))
                data_count = check_data.scalar()
                
                if data_count > 0:
                    print(f"   ⚠️  경고: {data_count}개의 기존 데이터가 있습니다.")
                    print("   기존 데이터를 유지하면서 타입을 변경합니다...")
                    
                    # USING 절을 사용하여 안전하게 타입 변경
                    conn.execute(text("""
                        ALTER TABLE users 
                        ALTER COLUMN gender TYPE user_gender_enum 
                        USING gender::user_gender_enum
                    """))
                else:
                    # 데이터가 없으면 단순 타입 변경
                    conn.execute(text("""
                        ALTER TABLE users 
                        ALTER COLUMN gender TYPE user_gender_enum 
                        USING gender::user_gender_enum
                    """))
                
                conn.commit()
                print("   ✓ gender 컬럼 타입이 user_gender_enum으로 변경되었습니다.")
            else:
                print("\n⏭️  Step 2: gender 컬럼이 이미 올바른 타입입니다.")
            
            # 4. 인덱스 확인 및 생성
            check_index = conn.execute(text("""
                SELECT EXISTS (
                    SELECT 1 FROM pg_indexes 
                    WHERE tablename = 'users' AND indexname = 'idx_users_gender'
                )
            """))
            index_exists = check_index.scalar()
            
            if not index_exists:
                print("\n✅ Step 3: gender 컬럼 인덱스 생성")
                conn.execute(text("""
                    CREATE INDEX idx_users_gender ON users(gender)
                """))
                conn.commit()
                print("   ✓ idx_users_gender 인덱스가 생성되었습니다.")
            else:
                print("\n⏭️  Step 3: gender 인덱스가 이미 존재합니다.")
            
            # 5. 최종 확인
            print("\n" + "=" * 60)
            print("✅ 마이그레이션 완료!")
            print("=" * 60)
            
            final_check = conn.execute(text("""
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = 'users' AND column_name = 'gender'
            """))
            
            result = final_check.fetchone()
            if result:
                print(f"\n최종 gender 컬럼 정보:")
                print(f"  - 컬럼명: {result[0]}")
                print(f"  - 데이터 타입: {result[1]}")
                print(f"  - NULL 허용: {result[2]}")
            
    except Exception as e:
        print(f"\n❌ 오류 발생: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        engine.dispose()

if __name__ == "__main__":
    migrate_gender_column()
