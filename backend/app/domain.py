from enum import StrEnum


class Role(StrEnum):
    admin = "Admin"
    manager = "Manager"
    finance = "Finance"
    employee = "Employee"


class ExpenseStatus(StrEnum):
    pending = "Pending"
    approved = "Approved"
    rejected = "Rejected"
    reimbursed = "Reimbursed"


class ExpenseCategory(StrEnum):
    food = "Food"
    travel = "Travel"
    accommodation = "Accommodation"
    fuel = "Fuel"
    internet = "Internet"
    office_supplies = "Office Supplies"
    medical = "Medical"
    miscellaneous = "Miscellaneous"
