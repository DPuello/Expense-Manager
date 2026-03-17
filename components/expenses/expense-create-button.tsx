"use client"

import { Plus } from "lucide-react"

import { useExpenseStore } from "@/store/useExpenseStore"
import { Button } from "../ui/button"

export default function ExpenseCreateButton() {
    const openModal = useExpenseStore((state) => state.openModal)

    return (
        <Button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500 text-white shadow-lg shadow-indigo-500/30 hover:opacity-95"
        >
            <Plus className="h-4 w-4" />
            Add Expense
        </Button>
    )
}

