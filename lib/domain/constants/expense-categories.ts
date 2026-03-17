export const EXPENSE_CATEGORIES = [
    "Food",
    "Transport",
    "Entertainment",
    "Health",
    "Shopping",
    "Services",
    "Other",
] as const

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]

const CATEGORY_ALIASES: Record<string, ExpenseCategory> = {
    food: "Food",
    groceries: "Food",
    grocery: "Food",
    dining: "Food",
    restaurant: "Food",

    transport: "Transport",
    transportation: "Transport",
    taxi: "Transport",
    bus: "Transport",
    fuel: "Transport",
    gas: "Transport",

    entertainment: "Entertainment",
    cinema: "Entertainment",
    movie: "Entertainment",
    streaming: "Entertainment",

    health: "Health",
    healthcare: "Health",
    medical: "Health",
    pharmacy: "Health",

    shopping: "Shopping",
    purchase: "Shopping",

    services: "Services",
    utilities: "Services",
    utility: "Services",
    bills: "Services",
    internet: "Services",
    electricity: "Services",
    water: "Services",

    other: "Other",
    education: "Other",
    misc: "Other",
}

export function normalizeExpenseCategory(category: string): ExpenseCategory {
    const normalized = category.trim().toLowerCase()
    return CATEGORY_ALIASES[normalized] ?? "Other"
}
