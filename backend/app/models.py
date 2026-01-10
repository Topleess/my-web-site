from tortoise import fields
from tortoise.models import Model
from typing import List
from enum import Enum


class CategoryEnum(str, Enum):
    DESIGN = "Дизайн"
    DEVELOPMENT = "Разработка"
    STARTUPS = "Стартапы"
    OTHER = "Другое"


class StatusEnum(str, Enum):
    IN_PROGRESS = "В работе"
    COMPLETED = "Завершен"


# Маппинг категорий на английский
CATEGORY_TRANSLATIONS = {
    "Дизайн": "Design",
    "Разработка": "Development",
    "Стартапы": "Startups",
    "Другое": "Other"
}

# Обратный маппинг
CATEGORY_TRANSLATIONS_REVERSE = {v: k for k, v in CATEGORY_TRANSLATIONS.items()}

# Маппинг статусов на английский
STATUS_TRANSLATIONS = {
    "В работе": "In Progress",
    "Завершен": "Completed"
}

# Обратный маппинг статусов
STATUS_TRANSLATIONS_REVERSE = {v: k for k, v in STATUS_TRANSLATIONS.items()}


class Project(Model):
    """
    Project model representing portfolio projects
    """
    id = fields.IntField(pk=True)
    title = fields.CharField(max_length=255)
    category = fields.CharEnumField(CategoryEnum)
    status = fields.CharEnumField(StatusEnum, default=StatusEnum.COMPLETED)
    year = fields.CharField(max_length=10)
    image = fields.TextField()  # URL to main image
    description = fields.TextField()
    client = fields.CharField(max_length=255, null=True)
    role = fields.CharField(max_length=255, null=True)
    images = fields.JSONField(default=list)  # Array of additional image URLs
    
    # Английские переводы
    title_en = fields.CharField(max_length=255, null=True)
    description_en = fields.TextField(null=True)
    
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)
    
    class Meta:
        table = "projects"
        ordering = ["-created_at"]
    
    def __str__(self):
        return f"{self.title} ({self.year})"
