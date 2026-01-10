from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from typing import Optional
import logging

from app.config import settings
from app.database import init_db, close_db
from app.models import Project, CATEGORY_TRANSLATIONS, STATUS_TRANSLATIONS
from app.schemas import (
    ProjectResponse, 
    ProjectListResponse, 
    ProjectCreate,
    ProjectUpdate,
    MessageResponse
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events"""
    # Startup
    logger.info("Starting up...")
    await init_db()
    yield
    # Shutdown
    logger.info("Shutting down...")
    await close_db()


# Initialize FastAPI app
app = FastAPI(
    title="Portfolio Backend API",
    description="Backend API for portfolio website",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_model=MessageResponse)
async def root():
    """Root endpoint"""
    return {"message": "Portfolio Backend API is running"}


@app.get("/api/health", response_model=MessageResponse)
async def health_check():
    """Health check endpoint"""
    return {"message": "OK"}


@app.get("/api/projects", response_model=ProjectListResponse)
async def get_projects(
    category: Optional[str] = Query(None, description="Filter by category"),
    status: Optional[str] = Query(None, description="Filter by status"),
    limit: Optional[int] = Query(None, description="Limit number of results"),
    lang: Optional[str] = Query("ru", description="Language code (ru/en)"),
):
    """
    Get all projects with optional filters
    
    - **category**: Filter by category (works with both RU and EN names)
    - **status**: Filter by status (В работе, Завершен)
    - **limit**: Limit number of results
    - **lang**: Language for response (ru/en)
    """
    try:
        query = Project.all()
        
        # Apply filters - поддержка фильтрации и по русским и по английским названиям
        if category and category != "Все" and category != "All":
            # Попробуем найти по русскому названию или по английскому
            ru_category = category
            # Если передана английская категория, конвертируем в русскую для фильтра
            if category in ["Design", "Development", "Startups", "Other"]:
                category_map = {
                    "Design": "Дизайн",
                    "Development": "Разработка", 
                    "Startups": "Стартапы",
                    "Other": "Другое"
                }
                ru_category = category_map.get(category, category)
            query = query.filter(category=ru_category)
        if status:
            query = query.filter(status=status)
        
        # Get total count
        total = await query.count()
        
        # Apply limit
        if limit:
            query = query.limit(limit)
        
        projects = await query
        
        # Добавим переводы категорий в ответ
        projects_data = []
        for project in projects:
            project_dict = {
                "id": project.id,
                "title": project.title,
                "title_en": project.title_en,
                "category": project.category,
                "category_en": CATEGORY_TRANSLATIONS.get(project.category, project.category),
                "status": project.status,
                "status_en": STATUS_TRANSLATIONS.get(project.status, project.status),
                "year": project.year,
                "image": project.image,
                "description": project.description,
                "description_en": project.description_en,
                "client": project.client,
                "role": project.role,
                "images": project.images,
                "created_at": project.created_at,
                "updated_at": project.updated_at,
            }
            projects_data.append(project_dict)
        
        return {
            "projects": projects_data,
            "total": total
        }
    except Exception as e:
        logger.error(f"Error fetching projects: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/projects/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: int):
    """
    Get a specific project by ID
    
    - **project_id**: The ID of the project
    """
    try:
        project = await Project.get_or_none(id=project_id)
        
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Добавим переводы
        project_dict = {
            "id": project.id,
            "title": project.title,
            "title_en": project.title_en,
            "category": project.category,
            "category_en": CATEGORY_TRANSLATIONS.get(project.category, project.category),
            "status": project.status,
            "status_en": STATUS_TRANSLATIONS.get(project.status, project.status),
            "year": project.year,
            "image": project.image,
            "description": project.description,
            "description_en": project.description_en,
            "client": project.client,
            "role": project.role,
            "images": project.images,
            "created_at": project.created_at,
            "updated_at": project.updated_at,
        }
        
        return project_dict
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching project {project_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/projects", response_model=ProjectResponse, status_code=201)
async def create_project(project_data: ProjectCreate):
    """
    Create a new project
    
    This endpoint can be used for adding projects through an admin panel
    """
    try:
        project = await Project.create(**project_data.model_dump())
        return project
    except Exception as e:
        logger.error(f"Error creating project: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/api/projects/{project_id}", response_model=ProjectResponse)
@app.patch("/api/projects/{project_id}", response_model=ProjectResponse)
async def update_project(project_id: int, project_data: ProjectUpdate):
    """
    Update an existing project
    
    - **project_id**: The ID of the project to update
    - Supports both PUT (full update) and PATCH (partial update)
    """
    try:
        project = await Project.get_or_none(id=project_id)
        
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Update only provided fields
        update_data = project_data.model_dump(exclude_unset=True)
        await project.update_from_dict(update_data).save()
        
        return project
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating project {project_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/projects/{project_id}", response_model=MessageResponse)
async def delete_project(project_id: int):
    """
    Delete a project
    
    - **project_id**: The ID of the project to delete
    """
    try:
        project = await Project.get_or_none(id=project_id)
        
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        await project.delete()
        
        return {"message": f"Project {project_id} deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting project {project_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/categories")
async def get_categories(lang: Optional[str] = Query("ru", description="Language code (ru/en)")):
    """Get all available categories with project counts"""
    try:
        all_count = await Project.all().count()
        design_count = await Project.filter(category="Дизайн").count()
        dev_count = await Project.filter(category="Разработка").count()
        startup_count = await Project.filter(category="Стартапы").count()
        other_count = await Project.filter(category="Другое").count()
        
        if lang == "en":
            categories = [
                {"name": "All", "name_ru": "Все", "count": all_count},
                {"name": "Design", "name_ru": "Дизайн", "count": design_count},
                {"name": "Development", "name_ru": "Разработка", "count": dev_count},
                {"name": "Startups", "name_ru": "Стартапы", "count": startup_count},
                {"name": "Other", "name_ru": "Другое", "count": other_count},
            ]
        else:
            categories = [
                {"name": "Все", "name_en": "All", "count": all_count},
                {"name": "Дизайн", "name_en": "Design", "count": design_count},
                {"name": "Разработка", "name_en": "Development", "count": dev_count},
                {"name": "Стартапы", "name_en": "Startups", "count": startup_count},
                {"name": "Другое", "name_en": "Other", "count": other_count},
            ]
        
        return {"categories": categories}
    except Exception as e:
        logger.error(f"Error fetching categories: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.ENV == "development"
    )
