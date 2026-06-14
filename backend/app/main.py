from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import courses, lessons

# Generate data tables directly if migrations are missing
# Base.metadata.create_all(bind=engine)

# Add this async function to handle table creation


async def init_db():
    async with engine.begin() as conn:
        # conn.run_sync allows running synchronous metadata operations inside an async context
        await conn.run_sync(Base.metadata.create_all)

# If you are using FastAPI, use the lifespan context manager (or @app.on_event("startup")):


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Trigger database table creation on startup
    await init_db()
    yield

app = FastAPI(title="Course Progress Tracker API", lifespan=lifespan)

# Resolve Cross-Origin Resource Sharing for the React Client development environment
app.add_middleware(
    CORSMiddleware,
    # Restrict to specific URL targets in actual deployment
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(courses.router)
app.include_router(lessons.router)
