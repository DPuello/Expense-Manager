import { Expense } from "@/lib/domain/entities/expense"

export type DashboardInsights = {
    totalSpent: number
    monthSpent: number
    averageExpense: number
    averageDailyExpense: number
    totalExpenses: number
    topCategory: {
        name: string
        amount: number
    }
    totalMonthTransactions: number
}

function isSameMonth(date: Date, referenceDate: Date) {
    return (
        date.getFullYear() === referenceDate.getFullYear() &&
        date.getMonth() === referenceDate.getMonth()
    )
}

function getSpentDaysTotal(expenses: Expense[]) {
    const days = new Set<number>()
    expenses.forEach((expense) => days.add(expense.date.getDate()))
    return days.size
}

export function getDashboardInsights(
    expenses: Expense[],
    referenceDate = new Date()
): DashboardInsights {
    const totalSpent = expenses.reduce((acc, expense) => acc + expense.amount, 0)
    const monthSpent = expenses
        .filter((expense) => isSameMonth(expense.date, referenceDate))
        .reduce((acc, expense) => acc + expense.amount, 0)

    const averageExpense = expenses.length === 0 ? 0 : totalSpent / expenses.length
    const spentDaysTotal = getSpentDaysTotal(expenses)
    const averageDailyExpense = expenses.length === 0 ? 0 : totalSpent / spentDaysTotal

    const categoryTotals = expenses.reduce<Record<string, number>>((acc, expense) => {
        acc[expense.category] = (acc[expense.category] ?? 0) + expense.amount
        return acc
    }, {})

    const [topCategoryName, topCategoryAmount] =
        Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0] ?? ["None", 0]

    const totalMonthTransactions = expenses.filter((expense) => isSameMonth(expense.date, referenceDate)).length

    return {
        totalSpent,
        monthSpent,
        averageExpense,
        averageDailyExpense,
        totalExpenses: expenses.length,
        topCategory: {
            name: topCategoryName,
            amount: topCategoryAmount,
        },
        totalMonthTransactions,
    }
}

