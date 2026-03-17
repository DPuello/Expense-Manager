"use client"

import DashboardChart from "@/components/dashboard/chart"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { ExpenseList } from "@/components/expenses/expenses-list"
import { Card, CardContent } from "@/components/ui/card"
import { getDashboardInsights } from "@/lib/application/use-cases/get-dashboard-insights"
import { getExpenseTrend } from "@/lib/application/use-cases/get-expense-trend"
import { useExpenseStore } from "@/store/useExpenseStore"
import {
    CalendarDays,
    CircleDollarSign,
    Layers3,
    TrendingUp,
    Wallet,
} from "lucide-react"
import { useEffect, useMemo } from "react"

const currencyFormatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
})

export default function DashboardPage() {
    const expenses = useExpenseStore((state) => state.expenses)
    const loading = useExpenseStore((state) => state.loading)
    const initialized = useExpenseStore((state) => state.initialized)
    const fetchExpenses = useExpenseStore((state) => state.fetchExpenses)

    useEffect(() => {
        void fetchExpenses()
    }, [fetchExpenses])

    const dashboardInsights = useMemo(() => getDashboardInsights(expenses), [expenses])
    const trendData = useMemo(() => getExpenseTrend(expenses, 14), [expenses])
    const recentExpenses = useMemo(() => expenses.slice(0, 6), [expenses])

    const currentMonthLabel = new Intl.DateTimeFormat("es-CO", {
        month: "long",
        year: "numeric",
    }).format(new Date())

    const cards = [
        {
            title: "Total Month Spend",
            description: currentMonthLabel,
            value: currencyFormatter.format(dashboardInsights.monthSpent),
            icon: <CircleDollarSign className="h-4 w-4" />,
            toneClassName: "bg-gradient-to-br from-violet-500/80 via-transparent to-sky-500/60",
        },
        {
            title: "Average Daily Expense",
            description: "Average amount per day.",
            value: currencyFormatter.format(dashboardInsights.averageDailyExpense),
            icon: <TrendingUp className="h-4 w-4" />,
            toneClassName: "bg-gradient-to-br from-fuchsia-500/80 via-transparent to-blue-500/60",
        },
        {
            title: "Top Category",
            description: `${currencyFormatter.format(dashboardInsights.topCategory.amount)} spent`,
            value: dashboardInsights.topCategory.name,
            icon: <Layers3 className="h-4 w-4" />,
            toneClassName: "bg-gradient-to-br from-yellow-500/70 via-transparent to-violet-500/50",
        },
        {
            title: "Total Month Transactions",
            description: currentMonthLabel,
            value: dashboardInsights.totalMonthTransactions + "",
            icon: <CalendarDays className="h-4 w-4" />,
            toneClassName: "bg-gradient-to-br from-indigo-500/80 via-transparent to-cyan-500/60",
        },
    ]

    if (!initialized && loading) {
        return (
            <div className="flex flex-1 items-center justify-center p-6">
                <Card className="w-full max-w-md border-border/70 bg-card/70">
                    <CardContent className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                        Loading dashboard data...
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex flex-1 overflow-y-auto">
            <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 pb-10 md:p-8">
                <header className="space-y-1 animate-in fade-in-50 slide-in-from-top-2 duration-500">
                    <p className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-violet-200">
                        <Wallet className="h-3.5 w-3.5" />
                        Offline-First Overview
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                        Dashboard Overview
                    </h1>
                    <p className="max-w-2xl text-sm text-zinc-300">
                        Your expense data is synced from local IndexedDB storage and rendered from a
                        single state source.
                    </p>
                </header>

                <section className="animate-in fade-in-50 slide-in-from-bottom-1 duration-500">
                    <SummaryCards cards={cards} />
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.3fr_1fr] animate-in fade-in-50 slide-in-from-bottom-2 duration-700">
                    <DashboardChart data={trendData} />
                    <ExpenseList expenses={recentExpenses} />
                </section>
            </main>
        </div>
    )
}

