# Course Progress Tracker
**Author:** Pshenychnyi Serhij

## How to run the project
```bash
docker compose up --build

## Technologies used
Frontend: React + TypeScript + Tailwind CSS (bundled via Vite)

Backend: Python + REST API + FastAPI (Asynchronous engine)

Database: PostgreSQL (with SQLAlchemy ORM and asyncpg driver)

## API endpoints
The backend exposes a fully documented REST API. Interactive Swagger UI documentation can be accessed locally at http://localhost:4000/docs or http://localhost:4000/redoc.

Courses
GET /courses — View course list with computed progress percentages.

POST /courses — Create a new course.

DELETE /courses/{course_id} — Delete a course (automatically cascades and deletes all associated lessons).

Lessons
POST /lessons — Add a lesson to a specific course.

PATCH /lessons/{lesson_id} — Mark a lesson as completed / not completed (updates is_completed boolean status).

DELETE /lessons/{lesson_id} — Optional / auxiliary deletion of a single lesson.

## Database description
The database uses a sequential auto-incrementing integer identifier layout for records, connected cleanly to Pydantic serialization schemas. It enforces a One-to-Many relationship between Courses and Lessons.

**courses Table**
Column Name,Data Type,Constraints / Notes
id,INT,"Primary Key, Auto-increment"
title,VARCHAR,"Required, Name of the course"
description,TEXT,Optional summary details

**lessons Table**
Column Name,Data Type,Constraints / Notes
id,INT,"Primary Key, Auto-increment"
course_id,INT,Foreign Key referencing courses(id) ON DELETE CASCADE
title,VARCHAR,Name of the lesson
description,TEXT,Lesson contextual content
is_completed,BOOLEAN,Default: FALSE. Explicit flag tracking completion status

## Docker description
course_tracker_db: Mounts a containerized instance of PostgreSQL. Utilizes a healthy polling mechanism check (pg_isready) so the stack boots deterministically without backend connection errors.

course_tracker_backend: A Docker container built over python:3.11-slim. It uses asyncpg to maintain rapid non-blocking connections to the database on port 5432 and opens port 4000 for API traffic.

course_tracker_frontend: Runs a Node workspace using Vite preview server. Bundled flags mirror production environments directly to port 3000 while enabling the application to listen on 0.0.0.0 network hosts.

## What is completed
Everything is done by help of AI

## What is not completed
Restyling UI, optimize structure of frontend and resources.

Text Editing / Inline Updates: Updating previously typed names or descriptions for existing courses or lessons (marked as optional per task rules).

Advanced Authentication: Multi-user authentication, roles, or personal course workspaces (beyond scope).

Granular Re-ordering: Drag-and-drop systems or sorting indexes to reposition how lessons look inside the dashboard lists.

## How AI was used

## AI Usage Report
- AI tool used: 
Google Gemini, GitHub Copilot

- What I used AI for:
create base structure, fill basic functionality, debug and fix errors

- 2–3 example prompts:
1) lets start from zero.
Build frontend project structure and some basic code/configurations

2) PS F:\projects\course-progress-tracker> docker compose up --build
[+] Running 12/12
 ✔ database Pulled                                                                13.3s 
   ✔ ca93057fc4d5 Pull complete   

3) сделал как ты сказал и вот
PS F:\projects\course-progress-tracker> docker compose up --build
unable to get image 'postgres:16-alpine': error during connect: Get                                            

- What I changed manually:
config files, ports, links, code view, UI interface view

- What was difficult:
work on fullstack project for time
not enough expirience with ui layout elements, database connectivity to frontend through API
configurate project on start, fights with package versions