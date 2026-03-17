"use client";

import { format } from "date-fns"
import { useEffect } from "react"
import { toast } from "sonner"

import {
    isDefaultExpenseFilters,
} from "@/lib/application/use-cases/filter-expense"
import { useExpenseStore } from "@/store/useExpenseStore"
import { Button } from "@/components/ui/button"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from "@/components/ui/empty"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
})

export function ExpensesTable() {
    const expenses = useExpenseStore((state) => state.expenses)
    const filteredExpenses = useExpenseStore((state) => state.filteredExpenses)
    const paginatedExpenses = useExpenseStore((state) => state.paginatedExpenses)
    const filters = useExpenseStore((state) => state.filters)
    const fetchExpenses = useExpenseStore((state) => state.fetchExpenses)
    const openModal = useExpenseStore((state) => state.openModal)
    const deleteExpense = useExpenseStore((state) => state.deleteExpense)
    const loading = useExpenseStore((state) => state.loading)
    const currentPage = useExpenseStore((state) => state.currentPage)
    const totalPages = useExpenseStore((state) => state.totalPages)
    const pageSize = useExpenseStore((state) => state.pageSize)
    const setPage = useExpenseStore((state) => state.setPage)

    const requestDeleteExpense = (id: string, description: string) => {
        toast("Delete expense?", {
            description: description || "This record will be permanently removed.",
            action: {
                label: "Delete",
                onClick: () => {
                    void deleteExpense(id)
                },
            },
            cancel: {
                label: "Cancel",
                onClick: () => undefined,
            },
            duration: 8000,
        })
    }

    useEffect(() => {
        void fetchExpenses()
    }, [fetchExpenses])

    if (loading && expenses.length === 0) {
        return <div className="text-sm text-muted-foreground">Loading expenses...</div>
    }

    if (filteredExpenses.length === 0) {
        const usingDefaultWindow = isDefaultExpenseFilters(filters)

        return (
            <Empty className="rounded-xl border border-dashed border-border/80 bg-card/40">
                <EmptyHeader>
                    <EmptyTitle>
                        {usingDefaultWindow ? "No expenses for the current year" : "No matching expenses"}
                    </EmptyTitle>
                    <EmptyDescription>
                        {usingDefaultWindow
                            ? "Create an expense or adjust the date range to include previous years."
                            : "Try changing category, description, or date range filters."}
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent className="flex-row justify-center gap-2">
                    <Button onClick={() => openModal()}>Create Expense</Button>
                </EmptyContent>
            </Empty>
        )
    }

    const totalAmount = filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0)
    const startResult = (currentPage - 1) * pageSize + 1
    const endResult = Math.min(currentPage * pageSize, filteredExpenses.length)

    return (
        <div className="space-y-4">
            <Table>
                <TableCaption>
                    Showing {startResult}-{endResult} of {filteredExpenses.length} filtered expenses.
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedExpenses.map((expense) => (
                        <TableRow key={expense.id}>
                            <TableCell className="max-w-[280px] truncate">
                                {expense.description || "No description"}
                            </TableCell>
                            <TableCell className="text-right text-sky-300">
                                {currencyFormatter.format(expense.amount)}
                            </TableCell>
                            <TableCell>{expense.category}</TableCell>
                            <TableCell>{format(expense.date, "MMM dd, yyyy")}</TableCell>
                            <TableCell className="text-right">
                                <div className="inline-flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => openModal(expense)}>
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() =>
                                            requestDeleteExpense(expense.id, expense.description)
                                        }
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={4}>Filtered total</TableCell>
                        <TableCell className="text-right">{currencyFormatter.format(totalAmount)}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>

            <div className="flex flex-col gap-3 border-t border-border/70 pt-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                    Page {currentPage} of {totalPages} ({pageSize} per page)
                </p>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(currentPage - 1)}
                        disabled={currentPage <= 1}
                    >
                        Previous
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
