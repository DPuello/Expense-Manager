import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export type SummaryCardItem = {
    title: string
    description: string
    value: string
    icon: React.ReactNode
    toneClassName?: string
}

function SummaryCard({
    title,
    description,
    value,
    icon,
    toneClassName,
}: SummaryCardItem) {
    return (
        <Card
            size="sm"
            className="relative overflow-hidden border border-border/70 bg-card/80 shadow-lg shadow-black/25 backdrop-blur-sm"
        >
            <div
                aria-hidden
                className={`pointer-events-none absolute inset-0 opacity-20 ${
                    toneClassName ?? "bg-gradient-to-br from-violet-500/60 via-transparent to-sky-500/40"
                }`}
            />
            <CardHeader className="relative">
                <CardAction className="rounded-lg border border-border/70 bg-background/60 p-2 text-violet-200">
                    {icon}
                </CardAction>
                <CardTitle className="text-sm font-medium text-zinc-200">{title}</CardTitle>
            </CardHeader>
            <CardContent className="relative">
                <p className="text-2xl font-semibold tracking-tight text-white">{value}</p>
            </CardContent>
            <CardDescription className="relative px-4 text-xs text-zinc-400">
                {description}
            </CardDescription>
        </Card>
    )
}

export function SummaryCards({ cards }: { cards: SummaryCardItem[] }) {
    return (
        <div className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <SummaryCard key={card.title} {...card} />
            ))}
        </div>
    )
}

