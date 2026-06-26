export type UserRole = "Admin" | "Manager" | "Finance" | "Employee";

export type ExpenseStatus = "Pending" | "Approved" | "Rejected" | "Reimbursed";

export type ExpenseCategory =
  | "Food"
  | "Travel"
  | "Accommodation"
  | "Fuel"
  | "Internet"
  | "Office Supplies"
  | "Medical"
  | "Miscellaneous";

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  managerId?: string;
}

export interface Expense {
  id: string;
  employeeId: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  description: string;
  status: ExpenseStatus;
  receiptName?: string;
  managerDecision?: "Pending" | "Approved" | "Rejected";
  financeDecision?: "Pending" | "Approved" | "Rejected";
}

export interface ReportFilter {
  period: "Daily" | "Weekly" | "Monthly";
  grouping: "Employee-wise" | "Category-wise" | "Status-wise";
}
