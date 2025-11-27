"""
Personality Pydantic 스키마
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class PersonalityScoreBase(BaseModel):
    """성향 점수 기본 스키마"""
    empathy_score: float = Field(..., ge=0, le=100)
    activity_score: float = Field(..., ge=0, le=100)
    patience_score: float = Field(..., ge=0, le=100)
    independence_score: float = Field(..., ge=0, le=100)


class PersonalityTestRequest(BaseModel):
    """성향 테스트 요청 스키마 (AI 분석용)"""
    user_type: str = Field(..., pattern="^(guardian|caregiver)$")
    answers: dict = Field(..., description="질문 ID와 답변의 매핑")


# ============================================================================
# Patient Personality Schemas
# ============================================================================

class PatientPersonalityCreate(PersonalityScoreBase):
    """환자 성향 생성 스키마"""
    patient_id: int


class PatientPersonalityUpdate(BaseModel):
    """환자 성향 수정 스키마"""
    empathy_score: Optional[float] = Field(None, ge=0, le=100)
    activity_score: Optional[float] = Field(None, ge=0, le=100)
    patience_score: Optional[float] = Field(None, ge=0, le=100)
    independence_score: Optional[float] = Field(None, ge=0, le=100)


class PatientPersonalityResponse(PersonalityScoreBase):
    """환자 성향 응답 스키마"""
    personality_id: int
    patient_id: int
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# Caregiver Personality Schemas
# ============================================================================

class CaregiverPersonalityCreate(PersonalityScoreBase):
    """간병인 성향 생성 스키마"""
    caregiver_id: int


class CaregiverPersonalityUpdate(BaseModel):
    """간병인 성향 수정 스키마"""
    empathy_score: Optional[float] = Field(None, ge=0, le=100)
    activity_score: Optional[float] = Field(None, ge=0, le=100)
    patience_score: Optional[float] = Field(None, ge=0, le=100)
    independence_score: Optional[float] = Field(None, ge=0, le=100)


class CaregiverPersonalityResponse(PersonalityScoreBase):
    """간병인 성향 응답 스키마"""
    personality_id: int
    caregiver_id: int
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
