"""
Patient Pydantic 스키마
"""

from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict
from app.models.profile import GenderEnum, CareLevelEnum


class PatientBase(BaseModel):
    """Patient 기본 스키마"""
    name: str = Field(..., min_length=1, max_length=50)
    birth_date: date
    gender: GenderEnum
    height: Optional[int] = Field(None, gt=0, lt=300)
    weight: Optional[int] = Field(None, gt=0, lt=500)
    care_address: str = Field(..., max_length=255)
    region_code: str = Field(..., max_length=50)
    care_level: Optional[CareLevelEnum] = None
    profile_image_url: Optional[str] = None


class PatientCreate(PatientBase):
    """Patient 생성 스키마"""
    guardian_id: int


class PatientUpdate(BaseModel):
    """Patient 수정 스키마"""
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    birth_date: Optional[date] = None
    gender: Optional[GenderEnum] = None
    height: Optional[int] = Field(None, gt=0, lt=300)
    weight: Optional[int] = Field(None, gt=0, lt=500)
    care_address: Optional[str] = Field(None, max_length=255)
    region_code: Optional[str] = Field(None, max_length=50)
    care_level: Optional[CareLevelEnum] = None
    profile_image_url: Optional[str] = None


class PatientResponse(PatientBase):
    """Patient 응답 스키마"""
    patient_id: int
    guardian_id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# Forward references for detailed response
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.schemas.health import HealthConditionResponse, MedicationResponse, DietaryPreferenceResponse
    from app.schemas.personality import PatientPersonalityResponse


class PatientDetailResponse(PatientResponse):
    """Patient 상세 응답 스키마 (건강 정보 포함)"""
    personality: Optional["PatientPersonalityResponse"] = None
    health_conditions: List["HealthConditionResponse"] = []
    medications: List["MedicationResponse"] = []
    dietary_preferences: List["DietaryPreferenceResponse"] = []
    
    model_config = ConfigDict(from_attributes=True)
