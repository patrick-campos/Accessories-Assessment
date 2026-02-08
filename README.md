# Accessories-Assessment

## Overview
This project contains:
- **Backend**: ASP.NET Core 10 API + PostgreSQL, Dapper repositories, use-case application layer.
- **Frontend**: Next.js + React Query + Tailwind CSS.
- **Docker**: Compose setup for database, backend and frontend.

## Google Console Setup (OAuth)
The backend uses Google Drive and Google Sheets through OAuth (not service account).

Create credentials in Google Cloud Console:
1. Create/Select a project.
2. Enable APIs:
   - **Google Drive API**
   - **Google Sheets API**
3. Create **OAuth Client ID** (type: Desktop App or Web).
4. Download the client JSON.

Required OAuth scopes:
- `https://www.googleapis.com/auth/drive.file`
- `https://www.googleapis.com/auth/spreadsheets`

Generate a refresh token using:
```
.\Accessories-Assessment\scripts\get_google_refresh_token.ps1 -ClientSecretPath "C:\path\client_secret.json"
```

## Environment Variables
Configure in `Accessories-Assessment/docker/backend.env`:
```
GoogleDrive__ClientId=...
GoogleDrive__ClientSecret=...
GoogleDrive__RefreshToken=...
GoogleDrive__FolderId=...             # Drive folder ID (optional)
GoogleDrive__ApplicationName=Luxclusif
GoogleDrive__Provider=GoogleDrive

GoogleSheet__SpreadsheetId=...         # Spreadsheet ID
GoogleSheet__SheetName=quote           # Sheet tab name
```

Frontend variables (in `Accessories-Assessment/docker/frontend.env`):
```
NEXT_PUBLIC_API_ORIGIN=http://localhost:8080
NEXT_PUBLIC_REQUEST_QUOTE_URL=http://localhost:8080/quote
```

## Running with Docker
From repository root:
```
docker compose -f Accessories-Assessment\docker\docker-compose.yml up -d --build
```

Services:
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:3000`
- Postgres: `localhost:5432`

## Backend Architecture
- **Controllers**: Thin, HTTP-only concerns.
- **Use cases**: Application layer (`UseCases/`).
- **Repositories**: Infrastructure with Dapper (SQL per repository).
- **Domain entities**: Validation and business rules.
- **Services**: Google Drive/Sheets integration.

Patterns used:
- Dependency Injection
- Repository
- Use Case (Application Service)
- DTO mapping

## Frontend Architecture
- **Controllers** (`features/*/Controller.tsx`): Data fetching and state.
- **Views** (`features/*/View.tsx`): Pure UI.
- **Shared UI components** under `src/shared/ui`.
- **React Query** for API data.

Patterns used:
- Controller/View split
- Component composition
- Feature-based folder structure
