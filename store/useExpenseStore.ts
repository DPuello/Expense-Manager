"use client";

import { mockExpenses } from "@/components/layout/mock-data";
import { clearExpenses } from "@/lib/application/use-cases/clear-expenses";
import { createExpense } from "@/lib/application/use-cases/create-expense";
import { deleteExpense } from "@/lib/application/use-cases/delete-expense";
import {
    createDefaultExpenseFilters,
    ExpenseFilters,
    filterExpenses,
} from "@/lib/application/use-cases/filter-expense";
import { listExpenses } from "@/lib/application/use-cases/list-expenses";
import { overrideExpenses } from "@/lib/application/use-cases/override-expenses";
import { updateExpense } from "@/lib/application/use-cases/update-expense";
import { normalizeExpenseCategory } from "@/lib/domain/constants/expense-categories";
import { Expense } from "@/lib/domain/entities/expense";
import { create } from "zustand";

const RESULTS_PER_PAGE = 20;

function normalizeExpense(expense: Expense): Expense {
    return {
        ...expense,
        description: expense.description?.trim() ?? "",
        category: normalizeExpenseCategory(expense.category),
        date: new Date(expense.date),
    };
}

function sortExpensesByDate(expenses: Expense[]): Expense[] {
    return [...expenses].sort((a, b) => b.date.getTime() - a.date.getTime());
}

function buildFilteredExpenses(expenses: Expense[], filters: ExpenseFilters): Expense[] {
    return filterExpenses(expenses, filters);
}

function buildDerivedExpensesState(
    expenses: Expense[],
    filters: ExpenseFilters,
    requestedPage: number
) {
    const filteredExpenses = buildFilteredExpenses(expenses, filters);
    const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / RESULTS_PER_PAGE));
    const currentPage = Math.min(Math.max(1, requestedPage), totalPages);

    const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
    const paginatedExpenses = filteredExpenses.slice(startIndex, startIndex + RESULTS_PER_PAGE);

    return {
        filteredExpenses,
        paginatedExpenses,
        totalPages,
        currentPage,
    };
}

type State = {
    expenses: Expense[];
    filteredExpenses: Expense[];
    paginatedExpenses: Expense[];
    filters: ExpenseFilters;
    loading: boolean;
    initialized: boolean;
    isModalOpen: boolean;
    editing?: Expense | null;
    pageSize: number;
    currentPage: number;
    totalPages: number;

    fetchExpenses: (force?: boolean) => Promise<void>;
    setQueryFilter: (query: string) => void;
    setCategoryFilter: (category: string) => void;
    setDateRange: (startDate: Date | null, endDate: Date | null) => void;
    setPage: (page: number) => void;
    clearFilters: () => void;
    openModal: (expense?: Expense | null) => void;
    closeModal: () => void;

    createExpense: (expense: Expense) => Promise<void>;
    updateExpense: (expense: Expense) => Promise<void>;
    deleteExpense: (id: string) => Promise<void>;

    loadMockData: () => Promise<void>;
    clearExpenses: () => Promise<void>;
};

export const useExpenseStore = create<State>((set, get) => {
    const initialFilters = createDefaultExpenseFilters();

    return {
        expenses: [],
        filteredExpenses: [],
        paginatedExpenses: [],
        filters: initialFilters,
        loading: false,
        initialized: false,
        isModalOpen: false,
        editing: null,
        pageSize: RESULTS_PER_PAGE,
        currentPage: 1,
        totalPages: 1,

        fetchExpenses: async (force = false) => {
            const state = get();
            if (state.loading) return;
            if (!force && state.initialized) return;

            set({ loading: true });
            try {
                const list = await listExpenses();
                const normalized = sortExpensesByDate(list.map(normalizeExpense));
                const derived = buildDerivedExpensesState(
                    normalized,
                    state.filters,
                    state.currentPage
                );

                set({
                    expenses: normalized,
                    ...derived,
                    initialized: true,
                });
            } finally {
                set({ loading: false });
            }
        },

        setQueryFilter: (query) =>
            set((state) => {
                const filters = { ...state.filters, query };
                return {
                    filters,
                    ...buildDerivedExpensesState(state.expenses, filters, 1),
                };
            }),

        setCategoryFilter: (category) =>
            set((state) => {
                const filters = { ...state.filters, category };
                return {
                    filters,
                    ...buildDerivedExpensesState(state.expenses, filters, 1),
                };
            }),

        setDateRange: (startDate, endDate) =>
            set((state) => {
                const filters = { ...state.filters, startDate, endDate };
                return {
                    filters,
                    ...buildDerivedExpensesState(state.expenses, filters, 1),
                };
            }),

        setPage: (page) =>
            set((state) => {
                const derived = buildDerivedExpensesState(state.expenses, state.filters, page);
                return {
                    ...derived,
                };
            }),

        clearFilters: () =>
            set((state) => {
                const defaultFilters = createDefaultExpenseFilters();
                return {
                    filters: defaultFilters,
                    ...buildDerivedExpensesState(state.expenses, defaultFilters, 1),
                };
            }),

        openModal: (expense = null) => set({ isModalOpen: true, editing: expense ?? null }),
        closeModal: () => set({ isModalOpen: false, editing: null }),

        createExpense: async (expense) => {
            await createExpense({
                ...expense,
                category: normalizeExpenseCategory(expense.category),
            });
            await get().fetchExpenses(true);
            get().closeModal();
        },

        updateExpense: async (expense) => {
            await updateExpense({
                ...expense,
                category: normalizeExpenseCategory(expense.category),
            });
            await get().fetchExpenses(true);
            get().closeModal();
        },

        deleteExpense: async (id) => {
            await deleteExpense(id);
            await get().fetchExpenses(true);
        },

        loadMockData: async () => {
            const normalized = sortExpensesByDate(mockExpenses.map(normalizeExpense));
            await overrideExpenses(normalized);
            await get().fetchExpenses(true);
        },

        clearExpenses: async () => {
            await clearExpenses();
            await get().fetchExpenses(true);
        },
    };
});
