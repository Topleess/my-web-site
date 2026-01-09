from tortoise import Tortoise
from app.config import settings
import logging

logger = logging.getLogger(__name__)

TORTOISE_ORM = {
    "connections": {
        "default": settings.DATABASE_URL
    },
    "apps": {
        "models": {
            "models": ["app.models", "aerich.models"],
            "default_connection": "default",
        },
    },
}


async def init_db():
    """Initialize database connection"""
    try:
        await Tortoise.init(
            db_url=settings.DATABASE_URL,
            modules={"models": ["app.models"]}
        )
        # Generate schemas
        await Tortoise.generate_schemas()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        raise


async def close_db():
    """Close database connections"""
    await Tortoise.close_connections()
    logger.info("Database connections closed")
