from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from uuid import UUID
from typing import List
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/api/courses", tags=["Courses"])


def calculate_progress(course: models.Course) -> float:
    """Calculate progress percentage for a course"""
    if not course.lessons:
        return 0.0
    completed = sum(1 for lesson in course.lessons if lesson.is_completed)
    return round((completed / len(course.lessons)) * 100)


@router.get("/", response_model=List[schemas.CourseResponse])
async def get_courses(db: AsyncSession = Depends(get_db)):
    # Use selectinload to eagerly load lessons to avoid lazy loading issues with async
    result = await db.execute(select(models.Course).options(selectinload(models.Course.lessons)))
    courses = result.unique().scalars().all()

    # Calculate progress for each course and construct response
    return [
        schemas.CourseResponse(
            id=course.id,
            title=course.title,
            description=course.description,
            progress_percentage=calculate_progress(course),
            lessons=[
                schemas.LessonResponse(
                    id=lesson.id,
                    course_id=lesson.course_id,
                    title=lesson.title,
                    description=lesson.description,
                    is_completed=lesson.is_completed
                )
                for lesson in course.lessons
            ]
        )
        for course in courses
    ]


@router.post("/", response_model=schemas.CourseResponse, status_code=status.HTTP_201_CREATED)
async def create_course(course: schemas.CourseCreate, db: AsyncSession = Depends(get_db)):
    db_course = models.Course(**course.model_dump())
    db.add(db_course)

    # Session lifecycle methods must be awaited
    await db.commit()
    await db.refresh(db_course, ["lessons"])

    return schemas.CourseResponse(
        id=db_course.id,
        title=db_course.title,
        description=db_course.description,
        progress_percentage=calculate_progress(db_course),
        lessons=[]
    )


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_course(course_id: UUID, db: AsyncSession = Depends(get_db)):
    # Async query filtering by course_id
    result = await db.execute(
        select(models.Course).filter(models.Course.id == course_id)
    )
    db_course = result.scalars().first()

    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")

    await db.delete(db_course)
    await db.commit()
    return None
