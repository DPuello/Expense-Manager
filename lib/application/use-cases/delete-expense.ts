import { expenseRepository } from "@/lib/infrastructure/container"

export async function deleteExpense(id: string) {
    return expenseRepository.delete(id)
}

