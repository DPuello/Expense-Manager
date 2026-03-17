export default function Aside({ children }: { children: React.ReactNode }) {
    return (
        <aside className="flex flex-col gap-4 h-screen bg-gray-200 p-4 items-center">
            {children}
        </aside>
    )
}