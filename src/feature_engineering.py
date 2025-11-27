# ========================================
# 늘봄케어 매칭 모델 - 특성 생성
# ========================================
# 파일: src/feature_engineering.py
# 설명: 환자-간병인 쌍에 대한 학습용 특성(Feature) 생성

import pandas as pd
import numpy as np
from typing import Tuple, List


class FeatureEngineer:
    """특성 생성 클래스"""
    
    def __init__(self):
        """특성 컬럼 목록 정의 (시급 제외)"""
        self.feature_columns = [
            # 성격 차이 (4개)
            "personality_diff_empathy",
            "personality_diff_activity", 
            "personality_diff_patience",
            "personality_diff_independence",
            # 전문분야 일치
            "specialty_match_ratio",
            # 지역 일치
            "region_match_score",
            # 간병인 정보
            "caregiver_experience",
            "caregiver_specialties_count",
            # 환자 정보
            "patient_care_level",
            "patient_disease_count",
        ]
        
    def calculate_personality_diff(
        self, 
        patient_row: pd.Series, 
        caregiver_row: pd.Series
    ) -> dict:
        """
        성격 점수 차이 계산
        
        Args:
            patient_row: 환자 데이터 행
            caregiver_row: 간병인 데이터 행
            
        Returns:
            dict: 성격 차이 점수들
        """
        personality_types = ["empathy", "activity", "patience", "independence"]
        diffs = {}
        
        for ptype in personality_types:
            p_score = patient_row.get(f"{ptype}_score", 50)
            c_score = caregiver_row.get(f"{ptype}_score", 50)
            
            # 차이의 절대값 (0~100 범위)
            diff = abs(float(p_score) - float(c_score))
            diffs[f"personality_diff_{ptype}"] = diff
            
        return diffs
    
    def calculate_specialty_match(
        self,
        patient_diseases: List[str],
        caregiver_specialties: List[str]
    ) -> float:
        """
        전문분야 일치율 계산
        
        Args:
            patient_diseases: 환자 질병 리스트
            caregiver_specialties: 간병인 전문분야 리스트
            
        Returns:
            float: 일치율 (0~1)
        """
        if not patient_diseases or not caregiver_specialties:
            return 0.0
        
        # 환자 질병 중 간병인이 전문으로 하는 비율
        matched = sum(1 for d in patient_diseases if d in caregiver_specialties)
        return matched / len(patient_diseases)
    
    def calculate_region_score(
        self,
        patient_region: str,
        caregiver_region: str
    ) -> float:
        """
        지역 일치 점수 계산
        
        Args:
            patient_region: 환자 지역 코드
            caregiver_region: 간병인 지역 코드
            
        Returns:
            float: 지역 점수 (0, 0.5, 0.75, 1.0)
        """
        if pd.isna(patient_region) or pd.isna(caregiver_region):
            return 0.5
        
        # 완전 일치
        if patient_region == caregiver_region:
            return 1.0
        
        # 같은 시/도
        p_city = patient_region.split("_")[0]
        c_city = caregiver_region.split("_")[0]
        
        if p_city == c_city:
            return 0.75
        
        # 수도권 내 (서울-경기-인천)
        capital_area = ["SEOUL", "GYEONGGI", "INCHEON"]
        if p_city in capital_area and c_city in capital_area:
            return 0.5
        
        # 그 외 (지역 불일치)
        return 0.0
    
    def create_features_for_pair(
        self,
        patient_row: pd.Series,
        caregiver_row: pd.Series
    ) -> dict:
        """
        환자-간병인 쌍에 대한 특성 생성
        
        Args:
            patient_row: 환자 데이터 행
            caregiver_row: 간병인 데이터 행
            
        Returns:
            dict: 생성된 특성들
        """
        features = {}
        
        # 1. 성격 차이 (4개)
        personality_diffs = self.calculate_personality_diff(patient_row, caregiver_row)
        features.update(personality_diffs)
        
        # 2. 전문분야 일치율
        patient_diseases = patient_row.get("diseases_list", [])
        caregiver_specialties = caregiver_row.get("specialties_list", [])
        
        # 문자열인 경우 빈 리스트로 처리
        if isinstance(patient_diseases, str):
            patient_diseases = []
        if isinstance(caregiver_specialties, str):
            caregiver_specialties = []
            
        features["specialty_match_ratio"] = self.calculate_specialty_match(
            patient_diseases, caregiver_specialties
        )
        
        # 3. 지역 일치 점수
        features["region_match_score"] = self.calculate_region_score(
            patient_row.get("region_code", ""),
            caregiver_row.get("service_region", "")
        )
        
        # 4. 간병인 정보
        features["caregiver_experience"] = float(caregiver_row.get("experience_years", 0))
        features["caregiver_specialties_count"] = float(caregiver_row.get("specialties_count", 0))
        
        # 5. 환자 정보
        features["patient_care_level"] = float(patient_row.get("care_level_num", 3))
        features["patient_disease_count"] = float(patient_row.get("disease_count", 0))
        
        return features
    
    def create_training_dataset(
        self,
        matching_results: pd.DataFrame,
        patients: pd.DataFrame,
        caregivers: pd.DataFrame,
        target_column: str = "total_score"
    ) -> Tuple[pd.DataFrame, pd.Series]:
        """
        학습용 데이터셋 생성
        
        Args:
            matching_results: 매칭 결과 데이터
            patients: 전처리된 환자 데이터
            caregivers: 전처리된 간병인 데이터
            target_column: 타겟 변수 컬럼명
            
        Returns:
            Tuple[X, y]: 특성 데이터프레임과 타겟 시리즈
        """
        print(f"🔧 특성 생성 시작... (총 {len(matching_results)}건)")
        
        # 환자, 간병인 데이터를 딕셔너리로 변환 (빠른 조회)
        patients_dict = patients.set_index("patient_id").to_dict("index")
        caregivers_dict = caregivers.set_index("caregiver_id").to_dict("index")
        
        features_list = []
        targets = []
        
        for idx, row in matching_results.iterrows():
            patient_id = row["patient_id"]
            caregiver_id = row["caregiver_id"]
            
            # 환자, 간병인 정보 조회
            patient_data = patients_dict.get(patient_id)
            caregiver_data = caregivers_dict.get(caregiver_id)
            
            if patient_data is None or caregiver_data is None:
                continue
            
            # 특성 생성
            features = self.create_features_for_pair(
                pd.Series(patient_data),
                pd.Series(caregiver_data)
            )
            
            features_list.append(features)
            targets.append(row[target_column])
        
        # 데이터프레임 생성
        X = pd.DataFrame(features_list)
        y = pd.Series(targets, name=target_column)
        
        # 컬럼 순서 정렬
        X = X[self.feature_columns]
        
        print(f"✅ 특성 생성 완료!")
        print(f"   - 특성 수: {len(self.feature_columns)}개")
        print(f"   - 샘플 수: {len(X)}개")
        
        return X, y
    
    def create_features_for_prediction(
        self,
        patient_id: int,
        caregiver_ids: List[int],
        patients: pd.DataFrame,
        caregivers: pd.DataFrame
    ) -> pd.DataFrame:
        """
        예측용 특성 생성 (새로운 매칭 추천 시 사용)
        
        Args:
            patient_id: 환자 ID
            caregiver_ids: 후보 간병인 ID 리스트
            patients: 전처리된 환자 데이터
            caregivers: 전처리된 간병인 데이터
            
        Returns:
            pd.DataFrame: 예측용 특성 데이터프레임
        """
        patients_dict = patients.set_index("patient_id").to_dict("index")
        caregivers_dict = caregivers.set_index("caregiver_id").to_dict("index")
        
        patient_data = patients_dict.get(patient_id)
        if patient_data is None:
            raise ValueError(f"환자 ID {patient_id}를 찾을 수 없습니다.")
        
        features_list = []
        valid_caregiver_ids = []
        
        for cg_id in caregiver_ids:
            caregiver_data = caregivers_dict.get(cg_id)
            if caregiver_data is None:
                continue
            
            features = self.create_features_for_pair(
                pd.Series(patient_data),
                pd.Series(caregiver_data)
            )
            features_list.append(features)
            valid_caregiver_ids.append(cg_id)
        
        X = pd.DataFrame(features_list)
        X = X[self.feature_columns]
        X["caregiver_id"] = valid_caregiver_ids
        
        return X
    
    def get_feature_names(self) -> List[str]:
        """특성 컬럼 이름 반환"""
        return self.feature_columns.copy()


# ========================================
# 테스트 실행
# ========================================
if __name__ == "__main__":
    from data_preprocessing import DataPreprocessor
    
    # 데이터 전처리
    preprocessor = DataPreprocessor(data_dir="data")
    processed_data = preprocessor.run_all_preprocessing()
    
    # 특성 생성
    engineer = FeatureEngineer()
    
    X, y = engineer.create_training_dataset(
        matching_results=processed_data["matching_results"],
        patients=processed_data["patients"],
        caregivers=processed_data["caregivers"],
        target_column="total_score"
    )
    
    # 결과 확인
    print("\n" + "=" * 50)
    print("📊 생성된 특성 데이터")
    print("=" * 50)
    print(f"\n특성 컬럼: {engineer.get_feature_names()}")
    print(f"\nX shape: {X.shape}")
    print(f"y shape: {y.shape}")
    
    print("\n[특성 샘플 (5개)]")
    print(X.head())
    
    print("\n[타겟 샘플 (5개)]")
    print(y.head())
    
    print("\n[특성 통계]")
    print(X.describe().round(2))