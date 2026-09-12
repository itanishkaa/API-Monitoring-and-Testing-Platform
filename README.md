# 🔎 API Monitoring and Testing Platform

A full-stack web application for registering URLs, checking endpoint availability, validating HTTP responses, and monitoring response times through a simple React dashboard.

The original backend was implemented with Spring Boot, JPA, MySQL, and Java. This version replaces that backend with **Python + FastAPI** while preserving the frontend's existing monitor workflow and API paths.

## Features

- Add and name URL monitors
- Validate URL format with Pydantic
- Perform live HTTP health checks
- Track HTTP response status
- Measure response time
- Optionally validate expected response content
- Show `UP`, `DOWN`, or `UNKNOWN` monitor status
- Edit and delete monitors
- Re-check all configured monitors
- Automatic frontend refresh every 30 seconds
- FastAPI Swagger/OpenAPI documentation
- SQLite persistence by default
- Pytest coverage for core API flows
- CORS configuration for local React development

## Architecture

```text
┌──────────────────────────────┐
│ React + Vite Frontend        │
│ frontend/monitor             │
└──────────────┬───────────────┘
               │ HTTP / JSON
               ▼
┌──────────────────────────────┐
│ FastAPI Backend              │
│ backend/app                  │
│                              │
│ Routes → Services → Models   │
└──────────────┬───────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌──────────────┐  ┌────────────────┐
│ SQLite       │  │ External APIs  │
│ URL monitors │  │ HTTP checks    │
└──────────────┘  └────────────────┘
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Backend | Python, FastAPI |
| HTTP checks | HTTPX |
| Validation | Pydantic |
| ORM | SQLAlchemy |
| Database | SQLite |
| API docs | OpenAPI / Swagger UI |
| Testing | Pytest |

## Project Structure

```text
API-Monitoring-and-Testing-Platform/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── health.py
│   │   │       └── urlmonitor.py
│   │   ├── core/
│   │   │   └── config.py
│   │   ├── db/
│   │   │   └── session.py
│   │   ├── models/
│   │   │   └── url_monitor.py
│   │   ├── schemas/
│   │   │   └── url_monitor.py
│   │   ├── services/
│   │   │   └── monitor_service.py
│   │   └── main.py
│   ├── tests/
│   │   ├── conftest.py
│   │   ├── test_health.py
│   │   └── test_urlmonitor.py
│   ├── .env.example
│   └── requirements.txt
│
└── frontend/
    └── monitor/
        ├── src/
        │   ├── components/
        │   ├── api.js
        │   ├── App.jsx
        │   └── types.ts
        ├── package.json
        └── vite.config.js
```

## Backend Setup

### 1. Create a virtual environment

```bash
cd backend

python -m venv .venv
```

Activate it:

**Windows**
```bash
.venv\Scripts\activate
```

**macOS/Linux**
```bash
source .venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

Copy `.env.example` to `.env` if you want to customize the defaults.

```env
DATABASE_URL=sqlite:///./api_monitor.db
CORS_ORIGINS=http://localhost:5173
REQUEST_TIMEOUT_SECONDS=10
```

### 4. Start FastAPI

From `backend/`:

```bash
uvicorn app.main:app --reload --port 8000
```

Backend:

```text
http://localhost:8000
```

Swagger UI:

```text
http://localhost:8000/docs
```

ReDoc:

```text
http://localhost:8000/redoc
```

## Frontend Setup

Open a second terminal:

```bash
cd frontend/monitor
npm install
npm run dev
```

The frontend runs on the Vite development server, normally:

```text
http://localhost:5173
```

The API base URL can be overridden with:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## API Endpoints

### Health

```http
GET /api/health
```

### URL Monitors

```http
GET    /api/urlmonitor/allrecords
POST   /api/urlmonitor/add
PUT    /api/urlmonitor/update
DELETE /api/urlmonitor/delete
```

The existing frontend contract is intentionally retained, so the React application can continue using the same endpoint paths.

### Example: Add a monitor

```bash
curl -X POST http://localhost:8000/api/urlmonitor/add \
  -H "Content-Type: application/json" \
  -d '{"name":"Example","url":"https://example.com"}'
```

Example response:

```json
{
  "id": 1,
  "name": "Example",
  "url": "https://example.com",
  "expectedContent": null,
  "status": "UP",
  "valid": true,
  "validUrl": true,
  "response": "200",
  "validResponse": true,
  "validContent": true,
  "responseTime": 142.37,
  "lastChecked": "2026-09-12T12:00:00"
}
```

## Monitoring Logic

For every configured monitor, the backend:

1. Validates the URL through the API schema.
2. Sends an HTTP `GET` request.
3. Measures request duration.
4. Records the HTTP status code.
5. Treats HTTP `200` as a valid response, matching the original implementation.
6. If expected content is configured, checks whether it occurs in the response body.
7. Sets the monitor status to `UP` when the response and content checks pass.
8. Sets it to `DOWN` when a check fails.
9. Stores the latest check timestamp and response time.

The frontend refreshes the monitor list every 30 seconds.

## Database

The migrated backend uses SQLite by default so the project can run without a separate database server.

The main entity is:

```text
UrlMonitor
├── id
├── name
├── url
├── expected_content
├── status
├── valid
├── valid_url
├── valid_response
├── valid_content
├── response
├── response_time
└── updated_on
```

The database URL is configurable through `DATABASE_URL`, so a different SQLAlchemy-supported database can be introduced later without changing the API layer.

## Migration from Spring Boot

The original project used:

- Java 17
- Spring Boot 3.4.3
- Spring Data JPA
- Spring Data REST
- MySQL
- Async HTTP Client
- Maven

The backend has been migrated to:

- Python
- FastAPI
- SQLAlchemy
- SQLite by default
- HTTPX
- Pydantic
- Pytest

The original monitor operations remain conceptually the same:

```text
Add Monitor
     ↓
Validate URL
     ↓
HTTP GET
     ↓
Validate response
     ↓
Validate expected content
     ↓
Persist result
     ↓
Return monitor status
```

The frontend API paths were retained to minimize the amount of frontend code that needed to change.

## Why FastAPI?

FastAPI makes the backend smaller and easier to maintain for this API-focused application while providing:

- Type-driven request validation
- Automatic OpenAPI documentation
- Clear route definitions
- Straightforward JSON APIs
- Easy integration with HTTPX for outbound API checks
- Simple testing with FastAPI's TestClient

## Future Improvements

Potential next steps:

- Scheduled server-side monitoring instead of frontend-triggered refreshes
- Monitor intervals configurable per endpoint
- Historical health-check records
- Uptime percentage calculations
- Response-time charts
- Alerting through email or Slack
- Custom HTTP methods and headers
- Authentication and user-specific monitors
- Retry policies and failure thresholds
- PostgreSQL for production deployments
- Background workers for large monitor sets

## Disclaimer

This project is intended as a software engineering and API monitoring demonstration. When monitoring external endpoints, respect their terms of service, rate limits, and acceptable-use policies.
