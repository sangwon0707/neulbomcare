"""
Guardian Pydantic 스키마
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class GuardianBase(BaseModel):
    """Guardian 기본 스키마"""
    address: Optional[str] = Field(None, max_length=255)
    relationship_to_patient: Optional[str] = Field(None, max_length=50)
    emergency_contact: Optional[str] = Field(None, max_length=20)


class GuardianCreate(GuardianBase):
    """Guardian 생성 스키마"""
    user_id: int


class GuardianUpdate(GuardianBase):
    """Guardian 수정 스키마"""
    pass


class GuardianResponse(GuardianBase):
    """Guardian 응답 스키마"""
    guardian_id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
