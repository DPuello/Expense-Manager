import {
    Item,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemTitle,
} from "@/components/ui/item"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Expense } from "@/lib/domain/entities/expense"
import { format } from "date-fns"
import Link from "next/link"

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
})

function ExpenseRow({ expense }: { expense: Expense }) {
    return (
        <Item variant="outline" asChild role="listitem" className="border-border/70 bg-background/30">
            <article>
                <ItemContent>
                    <ItemTitle className="line-clamp-1 text-zinc-100">{expense.description}</ItemTitle>
                    <ItemDescription>
                        {expense.category} - {format(expense.date, "MMM dd, yyyy")}
                    </ItemDescription>
                </ItemContent>
                <ItemContent className="flex-none text-right">
                    <ItemDescription className="font-semibold text-sky-300">
                        {currencyFormatter.format(expense.amount)}
                    </ItemDescription>
                </ItemContent>
            </article>
        </Item>
    )
}

export function ExpenseList({
    expenses,
    title = "Recent Expenses",
}: {
    expenses: Expense[]
    title?: string
}) {
    return (
        <Card className="h-full border border-border/70 bg-card/80 shadow-lg shadow-black/25 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg text-white">{title}</CardTitle>
                <Link
                    href="/expenses"
                    className="hidden items-center gap-3 rounded-xl border border-border/70 bg-card/70 p-2 pr-4 text-white transition-colors hover:border-violet-400/40 md:flex"
                >
                    <div>
                        <p className="text-sm font-semibold">All Expenses</p>
                    </div>
                </Link>
            </CardHeader>
            <CardContent>
                {expenses.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No expenses registered yet.</p>
                ) : (
                    <ItemGroup className="gap-2">
                        {expenses.map((expense) => (
                            <ExpenseRow key={expense.id} expense={expense} />
                        ))}
                    </ItemGroup>
                )}
            </CardContent>
        </Card>
    )
}
