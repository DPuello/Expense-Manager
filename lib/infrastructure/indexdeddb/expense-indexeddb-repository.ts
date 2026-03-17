import { ExpenseRepository } from "@/lib/domain/repositories/expense-repository"
import { Expense } from "@/lib/domain/entities/expense"
import { runTransaction, saveExpenses, clearExpenses } from "./db"

export class IndexedDBExpenseRepository implements ExpenseRepository {

    async create(expense: Expense): Promise<void> {
        await runTransaction("readwrite", (store) => store.add(expense))
    }

    async update(expense: Expense): Promise<void> {
        await runTransaction("readwrite", (store) => store.put(expense))
    }

    async delete(id: string): Promise<void> {
        await runTransaction("readwrite", (store) => store.delete(id))
    }

    async findAll(): Promise<Expense[]> {
        return runTransaction<Expense[]>("readonly", (store) => store.getAll())
    }

    async saveAll(expenses: Expense[]): Promise<void> {
        await saveExpenses(expenses);
    }

    async clear(): Promise<void> {
        await clearExpenses();
    }
}
