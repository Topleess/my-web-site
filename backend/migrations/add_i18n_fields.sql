-- Migration: Добавление полей для интернационализации (i18n)
-- Дата: 2026-01-10
-- Описание: Добавляем поля title_en и description_en в таблицу projects

-- Добавление колонки для английского заголовка
ALTER TABLE projects 
ADD COLUMN title_en VARCHAR(255) NULL;

-- Добавление колонки для английского описания
ALTER TABLE projects 
ADD COLUMN description_en TEXT NULL;

-- Комментарии к новым колонкам (опционально, для PostgreSQL)
COMMENT ON COLUMN projects.title_en IS 'Project title in English';
COMMENT ON COLUMN projects.description_en IS 'Project description in English';

-- Проверка результата
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM 
    information_schema.columns
WHERE 
    table_name = 'projects' 
    AND column_name IN ('title_en', 'description_en')
ORDER BY 
    ordinal_position;
