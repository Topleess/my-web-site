from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ProjectBase(BaseModel):
    title: str = Field(..., description="Project title")
    category: str = Field(..., description="Project category")
    status: str = Field(..., description="Project status")
    year: str = Field(..., description="Year of completion")
    image: str = Field(..., description="Main image URL")
    description: str = Field(..., description="Project description")
    client: Optional[str] = Field(None, description="Client name")
    role: Optional[str] = Field(None, description="Your role in project")
    images: List[str] = Field(default_factory=list, description="Additional images")
    title_en: Optional[str] = Field(None, description="Project title in English")
    description_en: Optional[str] = Field(None, description="Project description in English")


class ProjectCreate(ProjectBase):
    """Schema for creating a project"""
    pass


class ProjectUpdate(BaseModel):
    """Schema for updating a project (all fields optional)"""
    title: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    year: Optional[str] = None
    image: Optional[str] = None
    description: Optional[str] = None
    client: Optional[str] = None
    role: Optional[str] = None
    images: Optional[List[str]] = None
    title_en: Optional[str] = None
    description_en: Optional[str] = None


class ProjectResponse(ProjectBase):
    """Schema for project response"""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ProjectListResponse(BaseModel):
    """Schema for projects list response"""
    projects: List[ProjectResponse]
    total: int
    
    
class MessageResponse(BaseModel):
    """Generic message response"""
    message: str
