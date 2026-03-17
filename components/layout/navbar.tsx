"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Menu, Plus, Receipt, WalletMinimal } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import { useExpenseStore } from "@/store/useExpenseStore"

const navigationItems = [
    {
        href: "/",
        label: "Dashboard",
        icon: LayoutDashboard,
    },
    {
        href: "/expenses",
        label: "Expenses",
        icon: Receipt,
    },
]

export default function Navbar() {
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const openModal = useExpenseStore((state) => state.openModal)
    const loadMockData = useExpenseStore((state) => state.loadMockData)
    const clearExpenses = useExpenseStore((state) => state.clearExpenses)

    const closeMobileMenu = () => setIsMobileMenuOpen(false)

    return (
        <>
            <nav className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur-md md:h-screen md:w-72 md:border-r md:border-b-0">
                <div className="flex w-full items-center justify-between gap-3 p-3 md:h-full md:flex-col md:items-stretch md:justify-start md:gap-6 md:p-6">
                    <Link
                        href="/"
                        className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/70 p-2 pr-4 text-white transition-colors hover:border-violet-400/40"
                    >
                        <div className="rounded-lg border border-border/70 p-2">
                            <Image src="/jc-logo.png" alt="Expense Manager logo" width={24} height={24} />
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-semibold">Expense Manager</p>
                            <p className="text-xs text-muted-foreground">Offline-first tracker</p>
                        </div>
                    </Link>

                    <div className="hidden items-center gap-2 md:flex md:flex-col md:items-stretch">
                        {navigationItems.map(({ href, label, icon: Icon }) => {
                            const isActive = pathname === href

                            return (
                                <Button
                                    key={href}
                                    asChild
                                    variant={isActive ? "default" : "ghost"}
                                    className={cn(
                                        "w-full justify-start",
                                        isActive
                                            ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white"
                                            : "text-zinc-200 hover:bg-violet-500/15 hover:text-white"
                                    )}
                                >
                                    <Link href={href}>
                                        <Icon className="h-4 w-4" />
                                        {label}
                                    </Link>
                                </Button>
                            )
                        })}
                    </div>

                    <div className="hidden gap-2 md:flex md:flex-1 md:flex-col md:justify-end">
                        <Button variant="outline" onClick={() => void loadMockData()}>
                            Load Mock Data
                        </Button>
                        <Button variant="outline" onClick={() => void clearExpenses()}>
                            Clear Data
                        </Button>
                        <Button
                            onClick={() => openModal()}
                            className="bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500 text-white shadow-lg shadow-indigo-500/30 hover:opacity-95"
                        >
                            <Plus className="h-4 w-4" />
                            Add Expense
                        </Button>
                        <p className="mt-4 inline-flex items-center gap-1 text-xs text-zinc-400">
                            <WalletMinimal className="h-3 w-3" />
                            Data lives in your browser storage.
                        </p>
                    </div>

                    <div className="md:hidden">
                        <Button variant="outline" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </div>
                </div>
            </nav>

            <Drawer open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <DrawerContent className="border-t border-border/70 bg-background/95 backdrop-blur-sm">
                    <DrawerHeader className="text-left">
                        <DrawerTitle>Menu</DrawerTitle>
                        <DrawerDescription>Navigate and run quick actions.</DrawerDescription>
                    </DrawerHeader>

                    <div className="space-y-2 px-4 pb-2">
                        {navigationItems.map(({ href, label, icon: Icon }) => {
                            const isActive = pathname === href

                            return (
                                <Button
                                    key={href}
                                    asChild
                                    variant={isActive ? "default" : "ghost"}
                                    className={cn(
                                        "w-full justify-start",
                                        isActive
                                            ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white"
                                            : "text-zinc-200 hover:bg-violet-500/15 hover:text-white"
                                    )}
                                >
                                    <Link href={href} onClick={closeMobileMenu}>
                                        <Icon className="h-4 w-4" />
                                        {label}
                                    </Link>
                                </Button>
                            )
                        })}
                    </div>

                    <DrawerFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                closeMobileMenu()
                                void loadMockData()
                            }}
                        >
                            Load Mock Data
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                closeMobileMenu()
                                void clearExpenses()
                            }}
                        >
                            Clear Data
                        </Button>
                        <Button
                            onClick={() => {
                                closeMobileMenu()
                                openModal()
                            }}
                            className="bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500 text-white shadow-lg shadow-indigo-500/30 hover:opacity-95"
                        >
                            <Plus className="h-4 w-4" />
                            Add Expense
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="ghost">Close menu</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}
