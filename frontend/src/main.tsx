import React, { FormEvent, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  HandCoins,
  LayoutDashboard,
  Plus,
  Search,
  Send,
  Trash2,
  Upload,
  Users
} from "lucide-react";
import "./index.css";
import { categories, employees as seedEmployees, initialExpenses, roles } from "./data";
import type { Employee, Expense, ExpenseCategory, ExpenseStatus, ReportFilter, UserRole } from "./types";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

function App() {
  const [role, setRole] = useState<UserRole>("Admin");
  const [employees, setEmployees] = useState<Employee[]>(seedEmployees);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [employeeForm, setEmployeeForm] = useState<Employee>({
    id: "",
    name: "",
    email: "",
    department: "",
    designation: ""
  });
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    category: "Food" as ExpenseCategory,
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    description: "",
    receiptName: ""
  });
  const [report, setReport] = useState<ReportFilter>({ period: "Monthly", grouping: "Category-wise" });
  const currentEmployee = employees[0];

  const metrics = useMemo(() => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    return {
      employees: employees.length,
      submitted: expenses.length,
      pending: expenses.filter((expense) => expense.status === "Pending").length,
      approved: expenses.filter((expense) => expense.status === "Approved").length,
      reimbursed: expenses.filter((expense) => expense.status === "Reimbursed").length,
      rejected: expenses.filter((expense) => expense.status === "Rejected").length,
      total
    };
  }, [employees, expenses]);

  function addEmployee(event: FormEvent) {
    event.preventDefault();
    if (!employeeForm.name || !employeeForm.email) return;
    const id = employeeForm.id || `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
    setEmployees((items) => [{ ...employeeForm, id }, ...items]);
    setEmployeeForm({ id: "", name: "", email: "", department: "", designation: "" });
  }

  function deleteEmployee(id: string) {
    setEmployees((items) => items.filter((employee) => employee.id !== id));
  }

  function submitExpense(event: FormEvent) {
    event.preventDefault();
    if (!expenseForm.title || !expenseForm.amount) return;
    setExpenses((items) => [
      {
        id: `EXP-${Math.floor(100 + Math.random() * 900)}`,
        employeeId: currentEmployee.id,
        title: expenseForm.title,
        category: expenseForm.category,
        amount: Number(expenseForm.amount),
        date: expenseForm.date,
        description: expenseForm.description,
        status: "Pending",
        receiptName: expenseForm.receiptName,
        managerDecision: "Pending",
        financeDecision: "Pending"
      },
      ...items
    ]);
    setExpenseForm({
      title: "",
      category: "Food",
      amount: "",
      date: new Date().toISOString().slice(0, 10),
      description: "",
      receiptName: ""
    });
  }

  function updateStatus(id: string, status: ExpenseStatus) {
    setExpenses((items) =>
      items.map((expense) =>
        expense.id === id
          ? {
              ...expense,
              status,
              managerDecision: status === "Rejected" ? "Rejected" : "Approved",
              financeDecision: status === "Reimbursed" ? "Approved" : expense.financeDecision
            }
          : expense
      )
    );
  }

  const dashboardMetrics =
    role === "Admin"
      ? [
          ["Total Employees", metrics.employees],
          ["Total Expenses Submitted", metrics.submitted],
          ["Pending Approvals", metrics.pending],
          ["Approved Expenses", metrics.approved],
          ["Reimbursed Expenses", metrics.reimbursed]
        ]
      : role === "Manager"
        ? [
            ["Pending Expense Approvals", metrics.pending],
            ["Approved Expenses", metrics.approved],
            ["Rejected Expenses", metrics.rejected],
            ["Team Expense Summary", currency.format(metrics.total)]
          ]
        : role === "Finance"
          ? [
              ["Pending Reimbursements", metrics.approved],
              ["Approved Claims", metrics.approved],
              ["Monthly Expense Summary", currency.format(metrics.total)],
              ["Category-wise Expense Breakdown", categories.length]
            ]
          : [
              ["Total Submitted Expenses", expenses.filter((expense) => expense.employeeId === currentEmployee.id).length],
              ["Pending Claims", expenses.filter((expense) => expense.employeeId === currentEmployee.id && expense.status === "Pending").length],
              ["Approved Claims", expenses.filter((expense) => expense.employeeId === currentEmployee.id && expense.status === "Approved").length],
              [
                "Reimbursed Amount",
                currency.format(
                  expenses
                    .filter((expense) => expense.employeeId === currentEmployee.id && expense.status === "Reimbursed")
                    .reduce((sum, expense) => sum + expense.amount, 0)
                )
              ]
            ];

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-brand">Expense Reimbursement</p>
            <h1 className="text-2xl font-semibold">Employee Expense Dashboard</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {roles.map((item) => (
              <button
                key={item}
                className={`focus-ring rounded-md border px-3 py-2 text-sm font-medium ${
                  role === item ? "border-brand bg-brand text-white" : "border-line bg-white text-ink hover:bg-paper"
                }`}
                onClick={() => setRole(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-5 py-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {dashboardMetrics.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-line bg-white p-4 shadow-panel">
              <p className="text-sm text-slate-600">{label}</p>
              <p className="mt-2 text-2xl font-semibold">{value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Panel title="Employee Management" icon={<Users size={20} />}>
            <form className="grid gap-3 md:grid-cols-2" onSubmit={addEmployee}>
              <Input label="Employee ID" value={employeeForm.id} onChange={(value) => setEmployeeForm({ ...employeeForm, id: value })} />
              <Input label="Name" value={employeeForm.name} onChange={(value) => setEmployeeForm({ ...employeeForm, name: value })} />
              <Input label="Email" value={employeeForm.email} onChange={(value) => setEmployeeForm({ ...employeeForm, email: value })} />
              <Input
                label="Department"
                value={employeeForm.department}
                onChange={(value) => setEmployeeForm({ ...employeeForm, department: value })}
              />
              <Input
                label="Designation"
                value={employeeForm.designation}
                onChange={(value) => setEmployeeForm({ ...employeeForm, designation: value })}
              />
              <button className="focus-ring mt-6 flex h-10 items-center justify-center gap-2 rounded-md bg-brand px-4 font-medium text-white">
                <Plus size={18} /> Add Employee
              </button>
            </form>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-slate-600">
                    <th className="py-3">Employee ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id} className="border-b border-line">
                      <td className="py-3 font-medium">{employee.id}</td>
                      <td>{employee.name}</td>
                      <td>{employee.email}</td>
                      <td>{employee.department}</td>
                      <td>{employee.designation}</td>
                      <td className="text-right">
                        <button
                          className="focus-ring rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-700"
                          aria-label={`Delete ${employee.name}`}
                          onClick={() => deleteEmployee(employee.id)}
                        >
                          <Trash2 size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Submit Expense" icon={<Send size={20} />}>
            <form className="grid gap-3" onSubmit={submitExpense}>
              <Input label="Expense Title" value={expenseForm.title} onChange={(value) => setExpenseForm({ ...expenseForm, title: value })} />
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-sm font-medium">
                  Category
                  <select
                    className="focus-ring h-10 rounded-md border border-line bg-white px-3"
                    value={expenseForm.category}
                    onChange={(event) => setExpenseForm({ ...expenseForm, category: event.target.value as ExpenseCategory })}
                  >
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <Input label="Amount" type="number" value={expenseForm.amount} onChange={(value) => setExpenseForm({ ...expenseForm, amount: value })} />
              </div>
              <Input label="Date" type="date" value={expenseForm.date} onChange={(value) => setExpenseForm({ ...expenseForm, date: value })} />
              <label className="grid gap-1 text-sm font-medium">
                Description
                <textarea
                  className="focus-ring min-h-24 rounded-md border border-line px-3 py-2"
                  value={expenseForm.description}
                  onChange={(event) => setExpenseForm({ ...expenseForm, description: event.target.value })}
                />
              </label>
              <label className="grid gap-1 text-sm font-medium">
                Receipt Upload
                <span className="flex h-11 items-center gap-2 rounded-md border border-dashed border-line bg-white px-3 text-slate-600">
                  <Upload size={18} />
                  <input
                    className="w-full text-sm"
                    type="file"
                    onChange={(event) => setExpenseForm({ ...expenseForm, receiptName: event.target.files?.[0]?.name ?? "" })}
                  />
                </span>
              </label>
              <button className="focus-ring flex h-10 items-center justify-center gap-2 rounded-md bg-brand px-4 font-medium text-white">
                <Send size={18} /> Submit Expense
              </button>
            </form>
          </Panel>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Panel title="Approval Workflow" icon={<CheckCircle2 size={20} />}>
            <div className="mb-5 grid grid-cols-4 gap-2 text-center text-sm font-medium">
              {["Employee", "Manager Approval", "Finance Approval", "Reimbursed"].map((step, index) => (
                <div key={step} className="rounded-md border border-line bg-white px-2 py-3">
                  <p>{step}</p>
                  {index < 3 && <p className="mt-1 text-brand">▼</p>}
                </div>
              ))}
            </div>
            <div className="grid gap-3">
              {expenses.map((expense) => (
                <div key={expense.id} className="rounded-lg border border-line p-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold">{expense.title}</p>
                      <p className="text-sm text-slate-600">
                        {employeeName(expense.employeeId, employees)} · {expense.category} · {currency.format(expense.amount)}
                      </p>
                    </div>
                    <StatusPill status={expense.status} />
                  </div>
                  {(role === "Manager" || role === "Finance" || role === "Admin") && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <ActionButton label="Approve" onClick={() => updateStatus(expense.id, "Approved")} />
                      <ActionButton label="Reject" onClick={() => updateStatus(expense.id, "Rejected")} tone="danger" />
                      <ActionButton label="Reimburse" onClick={() => updateStatus(expense.id, "Reimbursed")} tone="accent" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Expense History" icon={<BriefcaseBusiness size={20} />}>
            <div className="mb-4 flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2">
              <Search size={18} className="text-slate-500" />
              <span className="text-sm text-slate-600">Recent expense history and approval status</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-slate-600">
                    <th className="py-3">Expense Title</th>
                    <th>Employee</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-line">
                      <td className="py-3 font-medium">{expense.title}</td>
                      <td>{employeeName(expense.employeeId, employees)}</td>
                      <td>{expense.category}</td>
                      <td>{expense.date}</td>
                      <td>{currency.format(expense.amount)}</td>
                      <td>
                        <StatusPill status={expense.status} />
                      </td>
                      <td>{expense.receiptName || "Not uploaded"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </section>

        <Panel title="Reports" icon={<BarChart3 size={20} />}>
          <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
            <div className="grid gap-3">
              <label className="grid gap-1 text-sm font-medium">
                Expense Reports
                <select
                  className="focus-ring h-10 rounded-md border border-line bg-white px-3"
                  value={report.period}
                  onChange={(event) => setReport({ ...report, period: event.target.value as ReportFilter["period"] })}
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </label>
              <label className="grid gap-1 text-sm font-medium">
                Report Type
                <select
                  className="focus-ring h-10 rounded-md border border-line bg-white px-3"
                  value={report.grouping}
                  onChange={(event) => setReport({ ...report, grouping: event.target.value as ReportFilter["grouping"] })}
                >
                  <option>Employee-wise</option>
                  <option>Category-wise</option>
                  <option>Status-wise</option>
                </select>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <ExportButton icon={<FileText size={17} />} label="PDF" />
                <ExportButton icon={<FileSpreadsheet size={17} />} label="Excel" />
                <ExportButton icon={<Download size={17} />} label="CSV" />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {["Pending Claims", "Approved Claims", "Reimbursed Claims"].map((label) => (
                <div key={label} className="rounded-lg border border-line bg-white p-4">
                  <p className="text-sm text-slate-600">{label}</p>
                  <p className="mt-2 text-xl font-semibold">
                    {expenses.filter((expense) => label.startsWith(expense.status)).length}
                  </p>
                </div>
              ))}
              <div className="rounded-lg border border-line bg-white p-4 md:col-span-3">
                <p className="font-semibold">{report.period} {report.grouping} Expenses</p>
                <div className="mt-4 grid gap-2">
                  {reportRows(expenses, employees, report.grouping).map((row) => (
                    <div key={row.label} className="grid grid-cols-[1fr_auto] items-center gap-3">
                      <div>
                        <p className="text-sm font-medium">{row.label}</p>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-brand" style={{ width: `${Math.max(8, row.percent)}%` }} />
                        </div>
                      </div>
                      <p className="text-sm font-semibold">{currency.format(row.amount)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </main>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-brand">{icon}</span>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="grid gap-1 text-sm font-medium">
      {label}
      <input className="focus-ring h-10 rounded-md border border-line px-3" type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function StatusPill({ status }: { status: ExpenseStatus }) {
  const classes = {
    Pending: "bg-amber-50 text-amber-800 border-amber-200",
    Approved: "bg-emerald-50 text-emerald-800 border-emerald-200",
    Rejected: "bg-red-50 text-red-800 border-red-200",
    Reimbursed: "bg-sky-50 text-sky-800 border-sky-200"
  };
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${classes[status]}`}>{status}</span>;
}

function ActionButton({ label, onClick, tone = "brand" }: { label: string; onClick: () => void; tone?: "brand" | "danger" | "accent" }) {
  const classes = tone === "danger" ? "border-red-200 text-red-700 hover:bg-red-50" : tone === "accent" ? "border-amber-200 text-amber-800 hover:bg-amber-50" : "border-brand text-brand hover:bg-emerald-50";
  return (
    <button className={`focus-ring rounded-md border px-3 py-1.5 text-sm font-medium ${classes}`} onClick={onClick}>
      {label}
    </button>
  );
}

function ExportButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="focus-ring flex h-10 items-center justify-center gap-1 rounded-md border border-line bg-white text-sm font-medium hover:bg-paper">
      {icon}
      {label}
    </button>
  );
}

function employeeName(id: string, employees: Employee[]) {
  return employees.find((employee) => employee.id === id)?.name ?? id;
}

function reportRows(expenses: Expense[], employees: Employee[], grouping: ReportFilter["grouping"]) {
  const totals = new Map<string, number>();
  expenses.forEach((expense) => {
    const key =
      grouping === "Employee-wise"
        ? employeeName(expense.employeeId, employees)
        : grouping === "Category-wise"
          ? expense.category
          : expense.status;
    totals.set(key, (totals.get(key) ?? 0) + expense.amount);
  });
  const max = Math.max(...totals.values(), 1);
  return Array.from(totals.entries()).map(([label, amount]) => ({ label, amount, percent: (amount / max) * 100 }));
}

createRoot(document.getElementById("root")!).render(<App />);
