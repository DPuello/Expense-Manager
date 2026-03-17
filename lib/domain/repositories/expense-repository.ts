import { Expense } from "../entities/expense"

export interface ExpenseRepository {
    create(expense: Expense): Promise<void>
    update(expense: Expense): Promise<void>
    delete(id: string): Promise<void>
    findAll(): Promise<Expense[]>
}