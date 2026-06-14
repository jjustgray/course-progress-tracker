from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional
from uuid import UUID

# --- LESSON SCHEMAS ---


class LessonBase(BaseModel):
    title: str
    description: Optional[str] = None


class LessonCreate(LessonBase):
    course_id: UUID


class LessonUpdate(BaseModel):
    is_completed: bool


class LessonResponse(LessonBase):
    id: UUID
    course_id: UUID = Field(alias="courseId")
    is_completed: bool = Field(alias="isCompleted")

    model_config = ConfigDict(populate_by_name=True,
                              by_alias=True, from_attributes=True)


# --- COURSE SCHEMAS ---
class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None


class CourseCreate(CourseBase):
    pass


class CourseResponse(CourseBase):
    id: UUID
    progress_percentage: float = Field(default=0.0, alias="progressPercentage")
    lessons: List[LessonResponse] = Field(default_factory=list)

    model_config = ConfigDict(populate_by_name=True,
                              by_alias=True, from_attributes=True)
