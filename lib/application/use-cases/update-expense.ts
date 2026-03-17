import { Expense } from "@/lib/domain/entities/expense"
import { expenseRepository } from "@/lib/infrastructure/container"

export async function updateExpense(expense: Expense) {
    return expenseRepository.update(expense)
}

