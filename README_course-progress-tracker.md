# Test Task: Course Progress Tracker

## Goal

Create a simple full-stack application for tracking progress in courses.

Recommended time: **about 1 hour**.

The task is intentionally small. Do not try to build a perfect production system. The goal is to show basic full-stack understanding: simple UI, API, database, Docker, and ability to explain the code.

AI tools are allowed for development: ChatGPT, Claude, Cursor, Copilot, etc.  
Do **not** connect any AI API inside the project.


---

## Tech Stack

Preferred backend stack:

- **Node.js** or **Java**

But this is not strict. You may use another backend technology if you are more comfortable with it.

Frontend:

- React / Vue / Angular / plain HTML + JS

Database:

- PostgreSQL is preferred
- SQLite is acceptable if PostgreSQL setup takes too much time

Docker:

- Docker Compose is required
- At minimum, backend and database should run in Docker
- Frontend can run in Docker or separately, but Docker setup is preferred

---

## What to Build

The user should be able to create courses, add lessons, mark lessons as completed, and see course progress.

Required features:

- View course list
- Create course
- Delete course
- Add lesson to course
- Mark lesson as completed / not completed
- Show progress percentage

To keep the task small, editing course and lesson text is optional.

---

## Course Fields

Each course should have:

```txt
id
title
description
createdAt
```

---

## Lesson Fields

Each lesson should have:

```txt
id
courseId
title
isCompleted
createdAt
```

Optional:

```txt
description
```

Relationship:

```txt
one course -> many lessons
```

---

## Progress Logic

Progress formula:

```txt
completed lessons / total lessons * 100
```

Examples:

```txt
0 / 0 = 0%
1 / 4 = 25%
2 / 4 = 50%
4 / 4 = 100%
```

The calculation can be done on the frontend or backend.

---

## Frontend Tasks

Create a simple UI with:

- Course list
- Form to create course
- Course details area or page
- Form to add lesson
- Lesson list
- Checkbox or button to mark lesson completed
- Progress text or progress bar
- Delete course button
- Delete lesson button
- Basic loading or error message

The design can be very simple.

---

## Backend Tasks

Create REST API endpoints:

```txt
GET    /courses
POST   /courses
DELETE /courses/:id

GET    /courses/:courseId/lessons
POST   /courses/:courseId/lessons
PATCH  /lessons/:id
DELETE /lessons/:id
```

Optional:

```txt
GET    /courses/:id
PATCH  /courses/:id
```

Basic validation:

- `course.title` is required
- `lesson.title` is required
- `isCompleted` must be boolean
- lesson must belong to an existing course

---

## Database

Create tables:

```txt
courses
lessons
```

Recommended `courses` fields:

```txt
id
title
description
created_at
```

Recommended `lessons` fields:

```txt
id
course_id
title
is_completed
created_at
```

You may use:

- Prisma
- TypeORM
- Sequelize
- Spring Data JPA
- Hibernate
- Raw SQL
- Any other simple database approach

The database must store courses and lessons permanently, not only in memory.

Example database URL:

```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/courses_db
```

---

## Docker

The project should run with:

```bash
docker compose up --build
```

Required services:

```txt
backend
database
```

Preferred services:

```txt
frontend
backend
database
```

Recommended ports:

```txt
frontend: http://localhost:3000
backend:  http://localhost:4000
database: localhost:5432
```

Example Docker Compose idea:

```yaml
services:
  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/courses_db
    depends_on:
      - postgres

  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: courses_db
    ports:
      - "5432:5432"
```

Frontend Docker is a bonus, but recommended.

---

## Suggested Structure

```txt
course-progress-tracker/
  frontend/
  backend/
  docker-compose.yml
  README.md
```

---

## README Requirements

Your final README must include:

- How to run the project
- Technologies used
- API endpoints
- Database description
- Docker description
- What is completed
- What is not completed
- How AI was used

Add this section:

```md
## AI Usage Report

- AI tool used:
- What I used AI for:
- 2–3 example prompts:
- What I changed manually:
- What was difficult:
```

---

## Recording Requirement

Record the development process.

The video does not need to be one continuous recording. You can pause it.

The recording should show:

1. Project setup
2. AI usage
3. Backend implementation
4. Database setup
5. Frontend implementation
6. Docker setup
7. Running the project
8. Creating a course
9. Adding lessons
10. Marking a lesson as completed
11. Showing progress change
12. Deleting a course or lesson
13. Short explanation of the project structure

---

## Submission

Submit:

- Git repository link or project archive
- Video recording link or file
- Short note if something does not work
