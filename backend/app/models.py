from sqlalchemy import Date, Enum, Float, ForeignKey, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

from .domain import ExpenseCategory, ExpenseStatus, Role


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    role: Mapped[Role] = mapped_column(Enum(Role), default=Role.employee)


class EmployeeRecord(Base):
    __tablename__ = "employees"

    id: Mapped[str] = mapped_column(String(32), primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    department: Mapped[str] = mapped_column(String(100))
    designation: Mapped[str] = mapped_column(String(100))
    manager_id: Mapped[str | None] = mapped_column(ForeignKey("employees.id"), nullable=True)
    expenses: Mapped[list["ExpenseRecord"]] = relationship(back_populates="employee")


class ExpenseRecord(Base):
    __tablename__ = "expenses"

    id: Mapped[str] = mapped_column(String(32), primary_key=True)
    employee_id: Mapped[str] = mapped_column(ForeignKey("employees.id"))
    title: Mapped[str] = mapped_column(String(160))
    category: Mapped[ExpenseCategory] = mapped_column(Enum(ExpenseCategory))
    amount: Mapped[float] = mapped_column(Float)
    date: Mapped[Date] = mapped_column(Date)
    description: Mapped[str] = mapped_column(Text, default="")
    receipt_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[ExpenseStatus] = mapped_column(Enum(ExpenseStatus), default=ExpenseStatus.pending)
    employee: Mapped[EmployeeRecord] = relationship(back_populates="expenses")
