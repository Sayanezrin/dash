import type { Employee, Expense, ExpenseCategory, UserRole } from "./types";

export const roles: UserRole[] = ["Admin", "Manager", "Finance", "Employee"];

export const categories: ExpenseCategory[] = [
  "Food",
  "Travel",
  "Accommodation",
  "Fuel",
  "Internet",
  "Office Supplies",
  "Medical",
  "Miscellaneous"
];

export const employees: Employee[] = [
  {
    id: "EMP-1001",
    name: "Aarav Mehta",
    email: "aarav.mehta@example.com",
    department: "Engineering",
    designation: "Frontend Engineer",
    managerId: "EMP-2001"
  },
  {
    id: "EMP-1002",
    name: "Maya Iyer",
    email: "maya.iyer@example.com",
    department: "Sales",
    designation: "Account Executive",
    managerId: "EMP-2001"
  },
  {
    id: "EMP-2001",
    name: "Nisha Rao",
    email: "nisha.rao@example.com",
    department: "Operations",
    designation: "Manager"
  },
  {
    id: "EMP-3001",
    name: "Kabir Sethi",
    email: "kabir.sethi@example.com",
    department: "Finance",
    designation: "Finance Analyst"
  }
];

export const initialExpenses: Expense[] = [
  {
    id: "EXP-501",
    employeeId: "EMP-1001",
    title: "Client visit cab fare",
    category: "Travel",
    amount: 1850,
    date: "2026-06-18",
    description: "Airport transfers for a client workshop.",
    status: "Pending",
    receiptName: "cab-invoice.pdf",
    managerDecision: "Pending",
    financeDecision: "Pending"
  },
  {
    id: "EXP-502",
    employeeId: "EMP-1002",
    title: "Team lunch",
    category: "Food",
    amount: 4200,
    date: "2026-06-12",
    description: "Lunch during quarterly sales planning.",
    status: "Approved",
    receiptName: "restaurant-bill.jpg",
    managerDecision: "Approved",
    financeDecision: "Pending"
  },
  {
    id: "EXP-503",
    employeeId: "EMP-1001",
    title: "Broadband reimbursement",
    category: "Internet",
    amount: 1299,
    date: "2026-06-04",
    description: "Monthly home internet reimbursement.",
    status: "Reimbursed",
    receiptName: "internet-june.pdf",
    managerDecision: "Approved",
    financeDecision: "Approved"
  },
  {
    id: "EXP-504",
    employeeId: "EMP-1002",
    title: "Conference hotel",
    category: "Accommodation",
    amount: 9800,
    date: "2026-05-29",
    description: "Two-night stay for partner conference.",
    status: "Rejected",
    receiptName: "hotel-tax-invoice.pdf",
    managerDecision: "Rejected",
    financeDecision: "Pending"
  }
];
