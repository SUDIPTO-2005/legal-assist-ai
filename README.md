# LexAssist AI

![LexAssist AI Banner](https://img.shields.io/badge/LexAssist_AI-Legal_Assistance_Platform-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-Proprietary-red)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python)
![Node](https://img.shields.io/badge/Node-20-43853D?logo=node.js)
![Django](https://img.shields.io/badge/Django-5.0-092E20?logo=django)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker)

## Product Overview and Problem Statement

**LexAssist AI** is a next-generation Generative AI-powered Legal Assistance Platform designed to augment the capabilities of legal professionals. The legal industry is burdened by the sheer volume of unstructured data (contracts, case laws, precedents, legal briefs) that require meticulous review, summarization, and analysis. Traditional methods are slow, error-prone, and prohibitively expensive.

LexAssist AI solves this by leveraging advanced Large Language Models (LLMs) and Retrieval-Augmented Generation (RAG) to provide:
- **Instant Legal Document Analysis:** Automatic contract review and anomaly detection.
- **Intelligent Legal Search:** Semantic search across vast repositories of legal precedents and case files.
- **Automated Drafting:** Generation of standard legal templates and boilerplate responses.
- **Case Summarization:** Distilling lengthy court transcripts and briefs into actionable insights.

## Architecture

```ascii
+-------------------------------------------------------------+
|                        Client Layer                         |
|  +-------------+   +----------------+   +----------------+  |
|  | Web Browser |   | Mobile Browser |   | External API   |  |
|  +------+------+   +-------+--------+   +--------+-------+  |
|         |                  |                     |          |
+---------+------------------+---------------------+----------+
          |                  |                     |
          v                  v                     v
+-------------------------------------------------------------+
|                       Nginx Reverse Proxy                   |
|                        (Ports 80/443)                       |
+---------+--------------------------+------------------------+
          |                          |
   Static/Frontend            API / WebSocket
          |                          |
          v                          v
+---------+--------+      +----------+-----------+            +-----------------+
|  React Frontend  |      |   Django Backend     | <--------> |  LLM Providers  |
|    (Port 3000)   |      |     (Port 8000)      |            | (OpenAI, Gemini)|
+------------------+      +----------+-----------+            +-----------------+
                                     |
    +--------------------------------+--------------------------------+
    |                                |                                |
    v                                v                                v
+-------------+               +--------------+                 +--------------+
| PostgreSQL  |               |    Redis     |                 | ChromaDB /   |
| (Port 5432) |               | (Port 6379)  |                 | Vector Store |
| RDBMS Data  |               | Cache/Broker |                 +--------------+
+-------------+               +------+-------+
                                     |
                              +------+-------+
                              |              |
                              v              v
                       +-------------+ +-------------+
                       | Celery Async| | Celery Beat |
                       |   Workers   | |  Scheduler  |
                       +-------------+ +-------------+
```

## Tech Stack

| Component | Technology | Version / Notes |
| :--- | :--- | :--- |
| **Frontend** | React, TypeScript, TailwindCSS | React 18, Vite |
| **Backend** | Python, Django, Django REST Framework | Python 3.11, Django 5.x |
| **Database** | PostgreSQL | v15 - Relational Data |
| **Vector DB** | ChromaDB | Embeddings & RAG |
| **Cache & Queue** | Redis | v7 - Celery Broker & Result Backend |
| **Async Workers** | Celery | Background processing, OCR, indexing |
| **LLM Integration** | OpenAI GPT-4o, Google Gemini | LLM Orchestration via LangChain/LlamaIndex |
| **Reverse Proxy** | Nginx | Load balancing, SSL, Rate limiting |
| **Containerization** | Docker, Docker Compose | Production & Dev parity |

## Quick Start (Docker)

The fastest way to get LexAssist AI running locally is using Docker.

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd Exclusive
    ```

2.  **Environment Variables:**
    Copy the sample environment file and configure it.
    ```bash
    cp .env.example .env
    ```
    *Open `.env` and fill in your `OPENAI_API_KEY` and/or `GEMINI_API_KEY`.*

3.  **Build and Run:**
    ```bash
    docker-compose up --build -d
    ```

4.  **Database Migrations & Initial Setup:**
    ```bash
    docker-compose exec backend python manage.py migrate
    docker-compose exec backend python manage.py createsuperuser
    ```

5.  **Access the Application:**
    - Frontend: `http://localhost` (or `http://localhost:3000` internally)
    - Backend API: `http://localhost/api/`
    - Django Admin: `http://localhost/api/admin/`

## Environment Setup (.env)

The `.env` file requires the following critical configurations:
- `DJANGO_SECRET_KEY`: Keep this secure.
- `DATABASE_URL`: Connection string for PostgreSQL.
- `LLM_PROVIDER`: Choose between `openai`, `gemini`, or `mock` for testing.
- `OPENAI_API_KEY`: Required if using OpenAI models.
- `JWT_ACCESS_TOKEN_LIFETIME_MINUTES`: Control session expiry.

See `.env.example` for the full list of available variables.

## Development Setup (Without Docker)

For active backend development without Docker overhead:

1.  **System Dependencies (Ubuntu/Debian):**
    ```bash
    sudo apt-get install poppler-utils tesseract-ocr libmagic1 postgresql redis
    ```

2.  **Python Virtual Environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

3.  **Database & Redis:** Ensure PostgreSQL and Redis are running locally. Update `.env` to point to `localhost` instead of docker service names.

4.  **Run Servers:**
    ```bash
    # Terminal 1: Django
    python manage.py migrate
    python manage.py runserver

    # Terminal 2: Celery Worker
    celery -A config worker -l info

    # Terminal 3: Frontend
    cd frontend && npm install && npm run dev
    ```

## API Documentation

*(This is a high-level overview. A full Swagger/OpenAPI spec is available at `/api/docs/` when the server is running)*

**Authentication:**
- `POST /api/auth/login/` - JWT Login
- `POST /api/auth/refresh/` - Refresh Token
- `POST /api/auth/register/` - User Registration

**Documents:**
- `POST /api/documents/upload/` - Upload legal document (PDF, DOCX)
- `GET /api/documents/` - List user documents
- `GET /api/documents/{id}/` - Retrieve document details and parsed text
- `DELETE /api/documents/{id}/` - Delete document

**Analysis & AI:**
- `POST /api/analysis/summarize/` - Generate document summary
- `POST /api/analysis/extract-clauses/` - Extract specific legal clauses
- `POST /api/analysis/chat/` - Chat with a document (RAG)

## Database Schema Overview

- **Users:** Custom user model with role-based access control (Admin, Lawyer, Paralegal, Client).
- **Workspaces:** Multi-tenant isolation for different law firms or departments.
- **Documents:** Metadata, upload paths, OCR status, and relationships to Workspaces.
- **Analyses:** Stored results of AI operations linked to specific Documents.
- **AuditLogs:** Tracking all system access and AI prompt history for compliance.

## Security Features

- **Data Segregation:** Workspace-level isolation.
- **Authentication:** JWT-based stateless authentication.
- **Rate Limiting:** Nginx-level API and Auth endpoint throttling to prevent abuse/brute-force.
- **Security Headers:** Strict HSTS, CSP, and X-Frame-Options configured in Nginx.
- **Upload Restrictions:** Configurable max upload size (`MAX_UPLOAD_SIZE_MB`) and MIME type validation (`libmagic`).
- **PII Redaction:** Configurable pipeline step to scrub Personally Identifiable Information before sending data to external LLMs.

## Testing Instructions

```bash
# Run Backend Tests (Pytest)
docker-compose exec backend pytest

# Run Frontend Tests (Vitest)
docker-compose exec frontend npm run test
```

## Deployment Guide

For production deployment:

1.  Use `docker-compose.prod.yml` which includes resource limits and optimized logging.
    ```bash
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
    ```
2.  Ensure `DJANGO_DEBUG=False` in your `.env`.
3.  Configure proper SSL certificates in Nginx (e.g., via Let's Encrypt / Certbot).
4.  Set up an external managed Database (e.g., AWS RDS) and Redis (e.g., AWS ElastiCache) for high availability, overriding the local docker services.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

Ensure all code follows PEP8 (Python) and ESLint/Prettier formatting (Frontend). All new features must include appropriate test coverage.

## Legal Disclaimer

LexAssist AI provides AI-assisted document analysis and information retrieval. It is **not** a substitute for professional legal advice. Users must independently verify all AI-generated outputs, summaries, and analyses. The creators of LexAssist AI assume no liability for errors, omissions, or any damages arising from the use of this software.
