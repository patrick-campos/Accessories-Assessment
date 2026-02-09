# Accessories-Assessment

## Overview
This project contains:
- **Backend**: ASP.NET Core 10 API + PostgreSQL, Dapper repositories, use-case application layer.
- **Frontend**: Next.js + React Query + Tailwind CSS.
- **Docker**: Compose setup for database, backend and frontend.

## Google Console Setup (OAuth)
The backend uses Google Drive and Google Sheets through OAuth (not service account).

Create credentials in Google Cloud Console (passo a passo):
1. Create/Select a project.
2. Configure the **OAuth consent screen**:
   - Choose **External** (or **Internal** if you are in a Google Workspace domain).
   - Fill in **App name**, **User support email**, and **Developer contact information**.
   - Add the scopes used by the app:
     - `https://www.googleapis.com/auth/drive.file`
     - `https://www.googleapis.com/auth/spreadsheets`
   - Add your Google account in **Test users** (required while the app is in Testing).
3. Enable APIs:
   - **Google Drive API**
   - **Google Sheets API**
4. Create **OAuth Client ID**:
   - For local development, prefer **Desktop App**.
   - If you choose **Web application**, add **Authorized redirect URIs**:
     - `http://localhost:8080`
     - `http://localhost:8080/oauth2/callback`
5. Download the client JSON.
   - You will need **Client ID** and **Client Secret** from this file.
   - Keep this file private (do not commit it).

Required OAuth scopes:
- `https://www.googleapis.com/auth/drive.file`
- `https://www.googleapis.com/auth/spreadsheets`

Google Drive permissions required:
- The OAuth user must have access to the target folder.
- Share the folder with the OAuth user (or upload inside their own Drive).
- For image rendering, the folder is set to **Anyone with the link** (reader).

Generate a refresh token using the script:
```
.\scripts\get_google_refresh_token.ps1 -ClientSecretPath "C:\path\client_secret.json"
```
You will be prompted to open a URL, sign in with the OAuth user, and paste the authorization code back into the script.
Copy the generated **Refresh Token** into `GoogleDrive__RefreshToken`.

Alternative (manual request): you can generate the refresh token by calling the token endpoint directly.
1. Open the consent URL in the browser to get an authorization `code`:
   - Base URL: `https://accounts.google.com/o/oauth2/v2/auth`
   - Required query params (expected values):
     - `client_id`: from your downloaded JSON.
     - `redirect_uri`: `http://localhost:53682/` (same as the script).
     - `response_type`: `code`
     - `scope`: `https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets`
     - `access_type`: `offline`
     - `prompt`: `consent`
2. Exchange the `code` for tokens with a POST to:
   - URL: `https://oauth2.googleapis.com/token`
   - Content-Type: `application/x-www-form-urlencoded`
   - Required body params (expected values):
     - `code`: the authorization code returned from step 1.
     - `client_id`: from your downloaded JSON.
     - `client_secret`: from your downloaded JSON.
     - `redirect_uri`: `http://localhost:53682/`
     - `grant_type`: `authorization_code`
3. The response contains `refresh_token`. Use it in `GoogleDrive__RefreshToken`.

Checklist for common issues:
- If you get `invalid_grant`, re-run the script and ensure the OAuth user is in **Test users**.
- If you get `redirect_uri_mismatch`, confirm the OAuth client type and redirect URIs.
- If the consent screen warns about unverified app, make sure you are using a test user or publish the app.

## How to Get Drive Folder ID and Sheet ID
**Google Drive folder ID**
1. Open the folder in Google Drive.
2. The URL looks like: `https://drive.google.com/drive/folders/<FOLDER_ID>`.
3. Copy the `<FOLDER_ID>` and set it in `GoogleDrive__FolderId`.

**Google Sheets spreadsheet ID**
1. Open the spreadsheet in Google Sheets.
2. The URL looks like: `https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit#gid=...`.
3. Copy the `<SPREADSHEET_ID>` and set it in `GoogleSheet__SpreadsheetId`.

**Sheet tab name**
- Use the tab name shown at the bottom of the sheet (e.g., `quote`) for `GoogleSheet__SheetName`.

## Environment Variables
Backend **requires** Google variables configured to work correctly.
Configure in `docker/backend.env`:
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

Frontend variables are only required for production (in `docker/frontend.env`):
```
NEXT_PUBLIC_API_ORIGIN=http://localhost:8080
NEXT_PUBLIC_REQUEST_QUOTE_URL=http://localhost:8080/quote
```

## Running with Docker
From repository root:
```
docker compose -f docker\docker-compose.yml up -d --build
```

Services:
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:3000`
- Postgres: `localhost:5432`
Swagger: access the API docs at `http://localhost:8080/swagger`.

## Backend Architecture (Hexagonal)
- **Controllers (Adapters/In)**: Thin, HTTP-only concerns.
- **Use cases (Application/Core)**: Application layer (`UseCases/`).
- **Repositories (Adapters/Out)**: Infrastructure with Dapper (SQL per repository).
- **Domain entities (Core)**: Validation and business rules.
- **Services (Adapters/Out)**: Google Drive/Sheets integration.

Patterns used:
- Dependency Injection
- Repository
- Use Case (Application Service)
- DTO mapping

## Frontend Architecture (Feature-Based)
- **Controllers** (`features/*/Controller.tsx`): Data fetching and state.
- **Views** (`features/*/View.tsx`): Pure UI.
- **Shared UI components** under `src/shared/ui`.
- **React Query** for API data.

Patterns used:
- Controller/View split
- Component composition
- Feature-based folder structure
