import { Expense } from "@/lib/domain/entities/expense"

export type ExpenseTrendPoint = {
    dateKey: string
    label: string
    total: number
}

function formatDateKey(date: Date): string {
    const year = date.getFullYear()
    const month = `${date.getMonth() + 1}`.padStart(2, "0")
    const day = `${date.getDate()}`.padStart(2, "0")
    return `${year}-${month}-${day}`
}

function getDateLabel(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
    }).format(date)
}

export function getExpenseTrend(
    expenses: Expense[],
    days = 14,
    referenceDate = new Date()
): ExpenseTrendPoint[] {
    const endDate = new Date(referenceDate)
    endDate.setHours(23, 59, 59, 999)

    const startDate = new Date(referenceDate)
    startDate.setHours(0, 0, 0, 0)
    startDate.setDate(startDate.getDate() - (days - 1))

    const timeline = new Map<string, ExpenseTrendPoint>()

    for (let index = 0; index < days; index += 1) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + index)

        const dateKey = formatDateKey(date)
        timeline.set(dateKey, {
            dateKey,
            label: getDateLabel(date),
            total: 0,
        })
    }

    for (const expense of expenses) {
        if (expense.date < startDate || expense.date > endDate) {
            continue
        }

        const dateKey = formatDateKey(expense.date)
        const current = timeline.get(dateKey)
        if (!current) continue

        current.total += expense.amount
    }

    return Array.from(timeline.values())
}

