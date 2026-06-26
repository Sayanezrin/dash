from datetime import date
from pathlib import Path
from typing import Annotated
from uuid import uuid4

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field

from .domain import ExpenseCategory, ExpenseStatus, Role
from .settings import settings


class EmployeeIn(BaseModel):
    name: str = Field(min_length=2)
    email: EmailStr
    department: str
    designation: str
    manager_id: str | None = None


class Employee(EmployeeIn):
    id: str


class ExpenseIn(BaseModel):
    employee_id: str
    title: str = Field(min_length=3)
    category: ExpenseCategory
    amount: float = Field(gt=0)
    date: date
    description: str = ""
    receipt_name: str | None = None


class Expense(ExpenseIn):
    id: str
    status: ExpenseStatus = ExpenseStatus.pending
    manager_decision: ExpenseStatus = ExpenseStatus.pending
    finance_decision: ExpenseStatus = ExpenseStatus.pending


app = FastAPI(title="Expense Dashboard API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

employees: dict[str, Employee] = {
    "EMP-1001": Employee(
        id="EMP-1001",
        name="Aarav Mehta",
        email="aarav.mehta@example.com",
        department="Engineering",
        designation="Frontend Engineer",
        manager_id="EMP-2001",
    )
}
expenses: dict[str, Expense] = {}
upload_dir = Path(settings.upload_dir)
upload_dir.mkdir(exist_ok=True)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/roles")
def list_roles() -> list[Role]:
    return list(Role)


@app.get("/employees")
def list_employees() -> list[Employee]:
    return list(employees.values())


@app.post("/employees", status_code=201)
def add_employee(payload: EmployeeIn) -> Employee:
    employee_id = f"EMP-{len(employees) + 1001}"
    employee = Employee(id=employee_id, **payload.model_dump())
    employees[employee.id] = employee
    return employee


@app.put("/employees/{employee_id}")
def edit_employee(employee_id: str, payload: EmployeeIn) -> Employee:
    if employee_id not in employees:
        raise HTTPException(status_code=404, detail="Employee not found")
    employee = Employee(id=employee_id, **payload.model_dump())
    employees[employee_id] = employee
    return employee


@app.delete("/employees/{employee_id}", status_code=204)
def delete_employee(employee_id: str) -> None:
    if employee_id not in employees:
        raise HTTPException(status_code=404, detail="Employee not found")
    del employees[employee_id]


@app.get("/expenses")
def list_expenses() -> list[Expense]:
    return list(expenses.values())


@app.post("/expenses", status_code=201)
def submit_expense(payload: ExpenseIn) -> Expense:
    if payload.employee_id not in employees:
        raise HTTPException(status_code=400, detail="Invalid employee_id")
    expense = Expense(id=f"EXP-{uuid4().hex[:8].upper()}", **payload.model_dump())
    expenses[expense.id] = expense
    return expense


@app.post("/expenses/{expense_id}/status")
def update_expense_status(expense_id: str, status: ExpenseStatus) -> Expense:
    if expense_id not in expenses:
        raise HTTPException(status_code=404, detail="Expense not found")
    expense = expenses[expense_id].model_copy(update={"status": status})
    expenses[expense_id] = expense
    return expense


@app.post("/receipts")
async def upload_receipt(file: Annotated[UploadFile, File()]) -> dict[str, str]:
    target = upload_dir / f"{uuid4().hex}_{file.filename}"
    target.write_bytes(await file.read())
    return {"file_name": file.filename or target.name, "stored_as": str(target)}
