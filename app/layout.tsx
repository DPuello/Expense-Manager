import type { Metadata } from "next";
import { Toaster } from "sonner";

import { ExpenseModal } from "@/components/expenses/expense-modal";
import Navbar from "@/components/layout/navbar";

import "./globals.css";

export const metadata: Metadata = {
  title: "Expense Manager",
  description: "Offline-first expense tracking with dashboard insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">
        <div className="relative flex min-h-screen flex-col md:flex-row">
          <Navbar />
          <ExpenseModal />
          {children}
        </div>
        <Toaster position="bottom-right" theme="dark" richColors />
      </body>
    </html>
  );
}
