import { expenseRepository } from "@/lib/infrastructure/container"

export async function clearExpenses() {
    return expenseRepository.clear()
}