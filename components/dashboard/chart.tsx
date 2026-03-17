"use client"

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import useMounted from "@/hooks/use-mounted"
import { ExpenseTrendPoint } from "@/lib/application/use-cases/get-expense-trend"

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
})

type DashboardChartProps = {
    data: ExpenseTrendPoint[]
}

export default function DashboardChart({ data }: DashboardChartProps) {
    const mounted = useMounted()
    const hasExpenseData = data.some((point) => point.total > 0)

    if (!mounted) {
        return (
            <Card className="relative h-full border border-border/70 bg-card/80 shadow-lg shadow-black/25 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-lg text-white">Spending Trend</CardTitle>
                    <CardDescription>Daily expense totals over the last 14 days.</CardDescription>
                </CardHeader>
                <CardContent className="h-[320px]" />
            </Card>
        )
    }

    return (
        <Card className="relative h-full border border-border/70 bg-card/80 shadow-lg shadow-black/25 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-lg text-white">Spending Trend</CardTitle>
                <CardDescription>
                    Daily expense totals over the last 14 days.
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ left: 8, right: 8, top: 16, bottom: 4 }}>
                        <defs>
                            <linearGradient id="spend-fill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.6} />
                                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="4 4" stroke="rgba(148, 163, 184, 0.2)" />
                        <XAxis
                            dataKey="label"
                            stroke="rgba(226, 232, 240, 0.75)"
                            tickLine={false}
                            axisLine={false}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            stroke="rgba(226, 232, 240, 0.75)"
                            tickFormatter={(value: number) => `$${value}`}
                            tickLine={false}
                            axisLine={false}
                            width={44}
                        />
                        <Tooltip
                            cursor={{ stroke: "rgba(167, 139, 250, 0.35)", strokeWidth: 2 }}
                            contentStyle={{
                                background: "rgba(9, 9, 12, 0.95)",
                                border: "1px solid rgba(167, 139, 250, 0.35)",
                                borderRadius: "12px",
                                color: "#f8fafc",
                            }}
                            formatter={(value) => currencyFormatter.format(Number(value ?? 0))}
                            labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Area
                            type="monotone"
                            dataKey="total"
                            stroke="#a78bfa"
                            strokeWidth={3}
                            fill="url(#spend-fill)"
                            activeDot={{ r: 6, fill: "#facc15", stroke: "#0b0f1a", strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
                {!hasExpenseData ? (
                    <p className="mt-3 text-xs text-muted-foreground">
                        No spending activity in this period yet.
                    </p>
                ) : null}
            </CardContent>
        </Card>
    )
}

