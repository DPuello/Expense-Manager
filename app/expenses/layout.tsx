import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expenses - Expense Manager",
  description: "Expenses - Expense Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
