"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import useMounted from "@/hooks/use-mounted"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useExpenseStore } from "@/store/useExpenseStore"
import ExpenseForm from "./expense-form"

export function ExpenseModal() {
    const mounted = useMounted()
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const isOpen = useExpenseStore((state) => state.isModalOpen)
    const editing = useExpenseStore((state) => state.editing)
    const close = useExpenseStore((state) => state.closeModal)

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            close()
        }
    }

    if (!mounted) return null

    if (isDesktop) {
        return (
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle>{editing ? "Edit" : "Add"} Expense</DialogTitle>
                        <DialogDescription>
                            {editing ? "Update the selected expense." : "Create a new expense entry."}
                        </DialogDescription>
                    </DialogHeader>
                    <ExpenseForm editing={editing} />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={isOpen} onOpenChange={handleOpenChange}>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{editing ? "Edit" : "Add"} Expense</DrawerTitle>
                    <DrawerDescription>
                        {editing ? "Update the selected expense." : "Create a new expense entry."}
                    </DrawerDescription>
                </DrawerHeader>
                <ExpenseForm editing={editing} />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

