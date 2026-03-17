"use client"

import {
    createDefaultExpenseFilters,
    isDefaultExpenseFilters,
} from "@/lib/application/use-cases/filter-expense"
import { EXPENSE_CATEGORIES } from "@/lib/domain/constants/expense-categories"
import { useExpenseStore } from "@/store/useExpenseStore"
import { Search, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function formatInputDate(date: Date | null): string {
    if (!date) return ""

    const year = date.getFullYear()
    const month = `${date.getMonth() + 1}`.padStart(2, "0")
    const day = `${date.getDate()}`.padStart(2, "0")

    return `${year}-${month}-${day}`
}

function parseInputDate(value: string): Date | null {
    if (!value) return null

    const [year, month, day] = value.split("-").map(Number)
    return new Date(year, month - 1, day)
}

export default function ExpenseFilters() {
    const expenses = useExpenseStore((state) => state.expenses)
    const filteredExpenses = useExpenseStore((state) => state.filteredExpenses)
    const filters = useExpenseStore((state) => state.filters)
    const setQueryFilter = useExpenseStore((state) => state.setQueryFilter)
    const setCategoryFilter = useExpenseStore((state) => state.setCategoryFilter)
    const setDateRange = useExpenseStore((state) => state.setDateRange)
    const clearFilters = useExpenseStore((state) => state.clearFilters)

    const hasActiveFilters = !isDefaultExpenseFilters(filters)
    const defaultFilters = createDefaultExpenseFilters()

    return (
        <section className="rounded-xl border border-border/70 bg-card/70 p-4 shadow-lg shadow-black/20 backdrop-blur-sm">
            <div className="grid gap-3 lg:grid-cols-[1.3fr_220px_190px_190px_auto]">
                <div className="relative">
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={filters.query}
                        onChange={(event) => setQueryFilter(event.target.value)}
                        placeholder="Search by description"
                        className="pl-9"
                    />
                </div>

                <Select value={filters.category} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {EXPENSE_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Input
                    type="date"
                    value={formatInputDate(filters.startDate)}
                    onChange={(event) =>
                        setDateRange(parseInputDate(event.target.value), filters.endDate)
                    }
                    max={formatInputDate(filters.endDate)}
                />

                <Input
                    type="date"
                    value={formatInputDate(filters.endDate)}
                    onChange={(event) =>
                        setDateRange(filters.startDate, parseInputDate(event.target.value))
                    }
                    min={formatInputDate(filters.startDate)}
                />

                <Button
                    type="button"
                    variant="outline"
                    className="w-full lg:w-auto"
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                >
                    <XCircle className="h-4 w-4" />
                    Reset
                </Button>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
                Showing {filteredExpenses.length} of {expenses.length} expenses. Default window: {formatInputDate(defaultFilters.startDate)} to {formatInputDate(defaultFilters.endDate)}.
            </p>
        </section>
    )
}
