import { Expense } from "@/lib/domain/entities/expense"
import { expenseRepository } from "@/lib/infrastructure/container"

export async function overrideExpenses(
    expenses: Expense[]
) {
    return expenseRepository.saveAll(expenses)
}