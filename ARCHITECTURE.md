# 🏗️ Архитектура проекта

## 📐 Общая схема

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                   React + TypeScript + Vite                      │
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐            │
│  │  Pages      │  │ Components  │  │   Hooks      │            │
│  │             │  │             │  │              │            │
│  │ - Home      │  │ - Header    │  │ - useProjects│            │
│  │ - Project   │  │ - Hero      │  │ - useProject │            │
│  │   Page      │  │ - Projects  │  │              │            │
│  │             │  │ - Contact   │  │              │            │
│  │             │  │ - Footer    │  │              │            │
│  └─────────────┘  └─────────────┘  └──────────────┘            │
│                           │                                      │
│                           ▼                                      │
│                  ┌─────────────────┐                            │
│                  │   API Client    │                            │
│                  │   (client.ts)   │                            │
│                  └─────────────────┘                            │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            │ HTTP/REST
                            │ (JSON)
                            │
┌───────────────────────────▼──────────────────────────────────────┐
│                         BACKEND                                   │
│                    FastAPI + Python                               │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                     FastAPI App                             │ │
│  │                                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  API Endpoints (main.py)                             │ │ │
│  │  │                                                       │ │ │
│  │  │  GET  /api/projects          - Все проекты          │ │ │
│  │  │  GET  /api/projects/{id}     - Один проект          │ │ │
│  │  │  POST /api/projects          - Создать проект       │ │ │
│  │  │  GET  /api/categories        - Категории            │ │ │
│  │  │  GET  /api/health            - Healthcheck          │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                           │                                 │ │
│  │  ┌────────────────────────▼─────────────────────────────┐ │ │
│  │  │  Pydantic Schemas (schemas.py)                       │ │ │
│  │  │  - ProjectResponse                                   │ │ │
│  │  │  - ProjectCreate                                     │ │ │
│  │  │  - ProjectListResponse                               │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                           │                                 │ │
│  │  ┌────────────────────────▼─────────────────────────────┐ │ │
│  │  │  Tortoise-ORM Models (models.py)                     │ │ │
│  │  │  - Project                                           │ │ │
│  │  │    ├─ id                                             │ │ │
│  │  │    ├─ title, category, status                        │ │ │
│  │  │    ├─ year, image, description                       │ │ │
│  │  │    ├─ client, role                                   │ │ │
│  │  │    ├─ images (JSON array)                            │ │ │
│  │  │    ├─ created_at, updated_at                         │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              │ asyncpg                            │
│                              ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              PostgreSQL Database                          │   │
│  │                                                           │   │
│  │  Table: projects                                         │   │
│  │  - id (serial, PK)                                       │   │
│  │  - title (varchar)                                       │   │
│  │  - category (varchar)                                    │   │
│  │  - status (varchar)                                      │   │
│  │  - year (varchar)                                        │   │
│  │  - image (text)                                          │   │
│  │  - description (text)                                    │   │
│  │  - client (varchar, nullable)                            │   │
│  │  - role (varchar, nullable)                              │   │
│  │  - images (jsonb)                                        │   │
│  │  - created_at (timestamp)                                │   │
│  │  - updated_at (timestamp)                                │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Поток данных

### 1️⃣ Загрузка списка проектов

```
User → Browser → ProjectsComponent
                      │
                      ├─ useProjects() hook
                      │     │
                      │     ├─ apiClient.getProjects()
                      │     │     │
                      │     │     ▼
                      │     │  HTTP GET /api/projects?category=...
                      │     │     │
                      │     │     ▼
                      │     │  FastAPI endpoint
                      │     │     │
                      │     │     ├─ Query filters
                      │     │     ├─ Tortoise-ORM query
                      │     │     │     │
                      │     │     │     ▼
                      │     │     │  PostgreSQL SELECT
                      │     │     │     │
                      │     │     │  ┌──┴─────────────┐
                      │     │     └─►│ Project[]      │
                      │     │        │ (from DB)      │
                      │     │        └────────────────┘
                      │     │             │
                      │     │             ▼
                      │     │        Pydantic serialize
                      │     │             │
                      │     │             ▼
                      │     └────────── JSON Response
                      │                   │
                      └─────────────── setState(projects)
                                          │
                                          ▼
                                     Re-render UI
```

### 2️⃣ Загрузка конкретного проекта

```
User clicks project → Navigate to /project/:id
                           │
                           ▼
                    ProjectPage component
                           │
                           ├─ useProject(id) hook
                           │     │
                           │     ├─ apiClient.getProject(id)
                           │     │     │
                           │     │     ▼
                           │     │  HTTP GET /api/projects/5
                           │     │     │
                           │     │     ▼
                           │     │  FastAPI endpoint
                           │     │     │
                           │     │     ├─ Tortoise-ORM get_or_none()
                           │     │     │     │
                           │     │     │     ▼
                           │     │     │  PostgreSQL SELECT WHERE id=5
                           │     │     │     │
                           │     │     └─────► Project (single)
                           │     │             │
                           │     │             ▼
                           │     │        Pydantic serialize
                           │     │             │
                           │     └────────── JSON Response
                           │                   │
                           └─────────────── setState(project)
                                               │
                                               ▼
                                          Render project details
```

### 3️⃣ Создание нового проекта

```
Admin → Swagger UI (/docs) → POST /api/projects
                                    │
                                    ├─ Request body (JSON)
                                    │     │
                                    │     ▼
                                    │  Pydantic validation
                                    │     │
                                    │     ▼
                                    │  FastAPI endpoint
                                    │     │
                                    │     ├─ Project.create(**data)
                                    │     │     │
                                    │     │     ▼
                                    │     │  PostgreSQL INSERT
                                    │     │     │
                                    │     └─────► New Project (with id)
                                    │             │
                                    │             ▼
                                    │        Pydantic serialize
                                    │             │
                                    └────────── JSON Response (201 Created)
```

---

## 🔌 API Спецификация

### Endpoints

| Method | Endpoint              | Описание                    | Query Params                        |
|--------|----------------------|-----------------------------|-------------------------------------|
| GET    | `/`                  | Корневой endpoint           | -                                   |
| GET    | `/api/health`        | Проверка здоровья           | -                                   |
| GET    | `/api/projects`      | Список проектов             | `category`, `status`, `limit`       |
| GET    | `/api/projects/{id}` | Конкретный проект           | -                                   |
| POST   | `/api/projects`      | Создать проект              | -                                   |
| GET    | `/api/categories`    | Категории с количеством     | -                                   |

### Примеры запросов

**Получить все проекты:**
```bash
GET http://localhost:8000/api/projects
```

**Фильтр по категории:**
```bash
GET http://localhost:8000/api/projects?category=Разработка
```

**Получить проект:**
```bash
GET http://localhost:8000/api/projects/1
```

**Создать проект:**
```bash
POST http://localhost:8000/api/projects
Content-Type: application/json

{
  "title": "Новый проект",
  "category": "Разработка",
  "status": "В работе",
  "year": "2024",
  "image": "https://example.com/image.jpg",
  "description": "Описание",
  "client": "Клиент",
  "role": "Разработчик",
  "images": ["https://example.com/img1.jpg"]
}
```

---

## 🗂️ Структура файлов

```
my-web-site/
│
├── backend/                      # Backend (FastAPI)
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # 🚀 FastAPI app + endpoints
│   │   ├── models.py            # 🗄️ Tortoise-ORM models
│   │   ├── schemas.py           # 📋 Pydantic schemas
│   │   ├── database.py          # 🔌 DB connection
│   │   ├── config.py            # ⚙️ Settings from .env
│   │   └── seed_data.py         # 🌱 Initial data script
│   ├── .env.example             # 📝 Environment template
│   ├── .env                     # 🔐 Environment config (create!)
│   ├── pyproject.toml           # 📦 uv dependencies
│   ├── requirements.txt         # 📦 pip alternative
│   ├── run.ps1                  # 🏃 Quick start script
│   ├── init-db.ps1              # 📊 DB init script
│   ├── README.md                # 📖 Backend docs
│   └── PRODUCTION-DEPLOY.md     # 🚀 Deploy guide
│
├── api/
│   └── client.ts                # 🔌 API client (fetch wrapper)
│
├── hooks/
│   ├── useProjects.ts           # 🎣 Hook: load projects list
│   └── useProject.ts            # 🎣 Hook: load single project
│
├── components/
│   ├── Header.tsx               # 🎨 Header component
│   ├── Hero.tsx                 # 🎨 Hero section
│   ├── Intro.tsx                # 🎨 Intro section
│   ├── Projects.tsx             # 🎨 Projects grid (✨ updated)
│   ├── Contact.tsx              # 🎨 Contact section
│   └── Footer.tsx               # 🎨 Footer component
│
├── pages/
│   ├── Home.tsx                 # 📄 Home page
│   └── ProjectPage.tsx          # 📄 Project detail page (✨ updated)
│
├── data/
│   └── projects.ts              # 📋 TypeScript types
│
├── .env.example                 # 📝 Frontend env template
├── .env                         # 🔐 Frontend env config
├── package.json                 # 📦 Node dependencies
├── tsconfig.json                # ⚙️ TypeScript config
├── vite.config.ts               # ⚙️ Vite config
├── .gitignore                   # 🚫 Git ignore rules
│
├── START-HERE.md                # 🎯 Start here!
├── QUICKSTART.md                # ⚡ Quick start guide
├── README.md                    # 📖 Main documentation
├── DEPLOYMENT.md                # 🚀 Deployment guide
├── ARCHITECTURE.md              # 🏗️ This file
└── FINAL-SUMMARY.md             # 📋 Project summary
```

---

## 🛠️ Технологический стек

### Frontend
- **Framework:** React 19
- **Language:** TypeScript 5.8
- **Build Tool:** Vite 6.2
- **Styling:** TailwindCSS (inline)
- **Routing:** React Router DOM 7
- **Icons:** Lucide React
- **HTTP Client:** Fetch API (native)

### Backend
- **Framework:** FastAPI 0.115+
- **Language:** Python 3.11+
- **ORM:** Tortoise-ORM 0.21+
- **Database Driver:** asyncpg 0.30+
- **Validation:** Pydantic 2.0+
- **Server:** Uvicorn (ASGI)
- **Package Manager:** uv

### Database
- **RDBMS:** PostgreSQL 13+
- **JSON Support:** JSONB (для массива images)

### DevOps
- **Process Manager:** systemd
- **Reverse Proxy:** Nginx
- **SSL:** Let's Encrypt (Certbot)

---

## 🔒 Безопасность

### CORS (Cross-Origin Resource Sharing)
```python
# backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,  # Из .env
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Environment Variables
Все чувствительные данные в `.env`:
- ✅ Database credentials
- ✅ API URLs
- ✅ Allowed origins
- ❌ Никаких хардкодов в коде!

### SQL Injection Protection
Tortoise-ORM автоматически экранирует запросы.

### Production Checklist
- [ ] HTTPS everywhere
- [ ] Strong database passwords
- [ ] Firewall configured
- [ ] CORS restricted to your domain
- [ ] Regular backups
- [ ] Keep dependencies updated

---

## 📊 Performance

### Backend
- **Async/await:** Все операции асинхронные
- **Connection pooling:** asyncpg pool (настраивается)
- **Multiple workers:** uvicorn --workers 4
- **Caching:** Можно добавить Redis в будущем

### Frontend
- **Code splitting:** React.lazy() (можно добавить)
- **Image optimization:** URL-based (нужна CDN)
- **Build optimization:** Vite production build

### Database
- **Indexes:** Автоматически на PK
- **JSON queries:** Эффективные JSONB операции
- **Query optimization:** Tortoise-ORM select_related / prefetch_related

---

## 🔄 Lifecycle

### Backend Startup
```
1. Load .env → settings
2. Initialize FastAPI app
3. Setup CORS middleware
4. Connect to PostgreSQL (asyncpg)
5. Generate DB schemas (if not exist)
6. Start Uvicorn server
7. Ready to accept requests
```

### Frontend Mount
```
1. Load React app
2. Router initialized
3. Component mounts
4. useProjects/useProject called
5. Fetch from API
6. setState → re-render
7. Display data
```

### Request Lifecycle
```
1. User action (click, page load)
2. React component calls hook
3. Hook calls API client
4. Fetch sends HTTP request
5. Nginx forwards to Uvicorn
6. FastAPI routes to endpoint
7. Pydantic validates input
8. Tortoise-ORM queries PostgreSQL
9. DB returns data
10. Pydantic serializes output
11. FastAPI sends JSON response
12. API client receives data
13. Hook updates state
14. Component re-renders
15. User sees result
```

---

## 🎯 Design Patterns

### Frontend
- **Custom Hooks:** Reusable state logic
- **Composition:** Small, focused components
- **Single Responsibility:** One component = one purpose
- **Props drilling avoidance:** Hooks instead of context (для простоты)

### Backend
- **Layered Architecture:**
  - Routes (main.py)
  - Schemas (schemas.py)
  - Models (models.py)
  - Database (database.py)
- **Dependency Injection:** FastAPI dependencies (можно расширить)
- **Settings Pattern:** Pydantic Settings from .env
- **Repository Pattern:** Tortoise-ORM (implicit)

---

## 📈 Scalability

### Horizontal Scaling
- Multiple Uvicorn workers
- Multiple server instances (behind load balancer)
- PostgreSQL read replicas

### Vertical Scaling
- Increase workers: `--workers 8`
- Increase connection pool size
- More server resources (CPU/RAM)

### Caching Strategy (future)
```
Browser → CDN → Nginx → FastAPI → Redis Cache → PostgreSQL
                                       │
                                       └─→ Cache hit: return
                                       └─→ Cache miss: query DB
```

---

## 🧪 Testing Strategy (рекомендации)

### Frontend
```bash
npm install --save-dev vitest @testing-library/react
```
- Unit tests для hooks
- Component tests для UI
- Integration tests для API client

### Backend
```bash
uv add --dev pytest pytest-asyncio httpx
```
- Unit tests для models
- API tests для endpoints
- Integration tests с test DB

---

## 📝 Maintenance

### Regular Tasks
- [ ] Update dependencies (weekly)
- [ ] Check logs (daily)
- [ ] Database backup (daily)
- [ ] Monitor disk space
- [ ] Review API usage

### Commands
```bash
# Backend updates
cd backend
uv sync --upgrade

# Frontend updates
npm update

# Database backup
pg_dump -U portfolio_user portfolio > backup_$(date +%Y%m%d).sql

# View logs
sudo journalctl -u portfolio-api --since today
```

---

**Архитектура обновлена:** 9 января 2026
