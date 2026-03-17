import { Expense } from "@/lib/domain/entities/expense"
import { expenseRepository } from "@/lib/infrastructure/container"

export async function createExpense(
    expense: Expense
) {
    return expenseRepository.create(expense)
}