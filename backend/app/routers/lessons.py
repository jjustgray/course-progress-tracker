from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
from typing import List
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/api/lessons", tags=["Lessons"])


@router.get("/", response_model=List[schemas.LessonResponse])
async def get_lessons(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Lesson))
    lessons = result.scalars().all()
    return [
        schemas.LessonResponse(
            id=lesson.id,
            course_id=lesson.course_id,
            title=lesson.title,
            description=lesson.description,
            is_completed=lesson.is_completed
        )
        for lesson in lessons
    ]


@router.post("/", response_model=schemas.LessonResponse, status_code=status.HTTP_201_CREATED)
async def create_lesson(lesson: schemas.LessonCreate, db: AsyncSession = Depends(get_db)):
    # Verify target course exists before linking the lesson
    course_result = await db.execute(
        select(models.Course).filter(models.Course.id == lesson.course_id)
    )
    course_exists = course_result.scalars().first()

    if not course_exists:
        raise HTTPException(status_code=404, detail="Target course not found")

    db_lesson = models.Lesson(**lesson.model_dump(exclude_unset=True))
    db.add(db_lesson)
    await db.commit()
    await db.refresh(db_lesson)

    return schemas.LessonResponse(
        id=db_lesson.id,
        course_id=db_lesson.course_id,
        title=db_lesson.title,
        description=db_lesson.description,
        is_completed=db_lesson.is_completed
    )


@router.patch("/{lesson_id}", response_model=schemas.LessonResponse)
async def update_lesson_status(lesson_id: UUID, lesson_update: schemas.LessonUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.Lesson).filter(models.Lesson.id == lesson_id)
    )
    db_lesson = result.scalars().first()

    if not db_lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    db_lesson.is_completed = lesson_update.is_completed
    await db.commit()
    await db.refresh(db_lesson)

    return schemas.LessonResponse(
        id=db_lesson.id,
        course_id=db_lesson.course_id,
        title=db_lesson.title,
        description=db_lesson.description,
        is_completed=db_lesson.is_completed
    )


@router.delete("/{lesson_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_lesson(lesson_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.Lesson).filter(models.Lesson.id == lesson_id)
    )
    db_lesson = result.scalars().first()

    if not db_lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    await db.delete(db_lesson)
    await db.commit()
    return None
