# Expense Dashboard

Full-stack expense reimbursement starter based on the provided modules.

## Stack

- Frontend: React, TypeScript, Tailwind CSS, Vite
- Backend: FastAPI, PostgreSQL-ready SQLAlchemy models
- Auth: role-aware local demo session
- Uploads: local storage by default, S3-ready service boundary

## Frontend

```powershell
cd frontend
pnpm install
pnpm dev
```

## Backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Demo Roles

Use the role switcher in the frontend to view Admin, Manager, Finance, and Employee experiences.
