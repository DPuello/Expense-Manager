import { expenseRepository } from "@/lib/infrastructure/container"

export async function listExpenses() {
    return expenseRepository.findAll()
}