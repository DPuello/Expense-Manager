import ExpenseCreateButton from "@/components/expenses/expense-create-button"
import ExpenseFilters from "@/components/expenses/expense-filters"
import { ExpensesTable } from "@/components/expenses/expenses-table"
import { Card } from "@/components/ui/card"
import { ReceiptText } from "lucide-react"

export default function ExpensesPage() {
  return (
    <div className="flex flex-1 overflow-y-auto">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 pb-10 md:p-8">
        <header className="flex items-center justify-between space-y-1 animate-in fade-in-50 slide-in-from-top-2 duration-500">
          <div className="space-y-1">
            <p className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-sky-200">
              <ReceiptText className="h-3.5 w-3.5" />
              Expense Registry
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">Expenses</h1>
            <p className="max-w-2xl text-sm text-zinc-300">
              Search, filter, and manage your records. Updates are persisted locally for offline use.
            </p>
          </div>
          <ExpenseCreateButton />
        </header>

        <ExpenseFilters />

        <Card className="overflow-hidden border border-border/70 bg-card/80 p-4 shadow-lg shadow-black/25 backdrop-blur-sm">
          <ExpensesTable />
        </Card>
      </main>
    </div>
  )
}

