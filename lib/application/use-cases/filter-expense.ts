import { Expense } from "@/lib/domain/entities/expense"

export type ExpenseFilters = {
    query: string
    category: string
    startDate: Date | null
    endDate: Date | null
}

export function getCurrentYearDateRange(referenceDate = new Date()) {
    const year = referenceDate.getFullYear()

    return {
        startDate: new Date(year, 0, 1, 0, 0, 0, 0),
        endDate: new Date(year, 11, 31, 23, 59, 59, 999),
    }
}

export function createDefaultExpenseFilters(referenceDate = new Date()): ExpenseFilters {
    const { startDate, endDate } = getCurrentYearDateRange(referenceDate)

    return {
        query: "",
        category: "all",
        startDate,
        endDate,
    }
}

function isSameCalendarDate(a: Date | null, b: Date | null): boolean {
    if (!a && !b) return true
    if (!a || !b) return false

    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    )
}

export function isDefaultExpenseFilters(
    filters: ExpenseFilters,
    referenceDate = new Date()
): boolean {
    const defaults = createDefaultExpenseFilters(referenceDate)

    return (
        filters.query.trim().length === 0 &&
        filters.category.trim().toLowerCase() === "all" &&
        isSameCalendarDate(filters.startDate, defaults.startDate) &&
        isSameCalendarDate(filters.endDate, defaults.endDate)
    )
}

export function filterExpenses(expenses: Expense[], filters: ExpenseFilters): Expense[] {
    const normalizedQuery = filters.query.trim().toLowerCase()
    const normalizedCategory = filters.category.trim().toLowerCase()

    const startDate = filters.startDate
        ? new Date(
            filters.startDate.getFullYear(),
            filters.startDate.getMonth(),
            filters.startDate.getDate(),
            0,
            0,
            0,
            0
        )
        : null

    const endDate = filters.endDate
        ? new Date(
            filters.endDate.getFullYear(),
            filters.endDate.getMonth(),
            filters.endDate.getDate(),
            23,
            59,
            59,
            999
        )
        : null

    return expenses.filter((expense) => {
        const expenseDate = new Date(expense.date)

        const matchesDescription =
            normalizedQuery.length === 0 ||
            expense.description.toLowerCase().includes(normalizedQuery)

        const matchesCategory =
            normalizedCategory.length === 0 ||
            normalizedCategory === "all" ||
            expense.category.toLowerCase() === normalizedCategory

        const matchesStartDate = !startDate || expenseDate >= startDate
        const matchesEndDate = !endDate || expenseDate <= endDate

        return matchesDescription && matchesCategory && matchesStartDate && matchesEndDate
    })
}
