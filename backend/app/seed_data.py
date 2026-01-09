"""
Script to seed the database with initial project data
Run with: uv run python -m app.seed_data
"""
import asyncio
from tortoise import Tortoise
from app.config import settings
from app.models import Project

# Initial project data (from your original projects.ts file)
INITIAL_PROJECTS = [
    {
        "title": "FinTech App",
        "category": "Разработка",
        "status": "Завершен",
        "year": "2023",
        "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
        "description": "Комплексное банковское приложение, ориентированное на упрощение денежных переводов и аналитику расходов. Мы создали интуитивно понятный интерфейс, который позволяет пользователям отслеживать свои финансы в реальном времени.",
        "client": "NeoBank Ltd.",
        "role": "Frontend & UI/UX",
        "images": [
            "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=1470&auto=format&fit=crop"
        ]
    },
    {
        "title": "Modern Branding",
        "category": "Дизайн",
        "status": "Завершен",
        "year": "2024",
        "image": "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2500&auto=format&fit=crop",
        "description": "Ребрендинг для архитектурного бюро. Задача состояла в том, чтобы передать ощущение монументальности и легкости одновременно через типографику и цветовую палитру.",
        "client": "ArchTech",
        "role": "Art Direction",
        "images": [
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1473&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1470&auto=format&fit=crop"
        ]
    },
    {
        "title": "Eco Startup",
        "category": "Стартапы",
        "status": "В работе",
        "year": "2024",
        "image": "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop",
        "description": "Платформа для отслеживания углеродного следа малого бизнеса. Проект находится в стадии активной разработки MVP.",
        "client": "GreenLife",
        "role": "Full Stack Dev",
        "images": [
            "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5fa5?q=80&w=1413&auto=format&fit=crop"
        ]
    },
    {
        "title": "Abstract 3D",
        "category": "Другое",
        "status": "Завершен",
        "year": "2022",
        "image": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
        "description": "Серия 3D-иллюстраций для музыкального фестиваля электронной музыки. Исследование форм, света и текстур.",
        "role": "3D Artist",
        "images": [
            "https://images.unsplash.com/photo-1614730341194-75c607400070?q=80&w=1474&auto=format&fit=crop"
        ]
    },
    {
        "title": "Crypto Dashboard",
        "category": "Разработка",
        "status": "Завершен",
        "year": "2023",
        "image": "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=2532&auto=format&fit=crop",
        "description": "Аналитическая панель для трейдеров криптовалют с обновлением данных в реальном времени через WebSockets.",
        "client": "CryptoFin",
        "role": "Frontend Lead",
        "images": [
            "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1632&auto=format&fit=crop"
        ]
    },
]


async def seed_database():
    """Seed the database with initial project data"""
    print("Connecting to database...")
    await Tortoise.init(
        db_url=settings.DATABASE_URL,
        modules={"models": ["app.models"]}
    )
    
    print("Generating schemas...")
    await Tortoise.generate_schemas()
    
    # Check if data already exists
    existing_count = await Project.all().count()
    if existing_count > 0:
        print(f"Database already contains {existing_count} projects.")
        print("Clearing existing projects...")
        await Project.all().delete()
    
    print("Seeding database with initial projects...")
    for project_data in INITIAL_PROJECTS:
        project = await Project.create(**project_data)
        print(f"[OK] Created: {project.title}")
    
    total = await Project.all().count()
    print(f"\n[SUCCESS] Successfully seeded {total} projects!")
    
    await Tortoise.close_connections()
    print("Database connection closed.")


if __name__ == "__main__":
    asyncio.run(seed_database())
