import { Card, CardContent } from "@/components/ui/card";
import { cn, formatMoney } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

export function KpiCard({
  label,
  valueCents,
  hint,
  delta,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  valueCents: number;
  hint?: string;
  /** -1..1, negative is bad. Pass undefined when no delta yet. */
  delta?: number;
  icon: LucideIcon;
  tone?: "neutral" | "positive" | "negative";
}) {
  const isNeg = (delta ?? 0) < 0;
  const Arrow = isNeg ? ArrowDownRight : ArrowUpRight;
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </div>
            <div
              className={cn(
                "text-2xl font-semibold tracking-tight",
                tone === "positive" && "text-emerald-600 dark:text-emerald-400",
                tone === "negative" && "text-rose-600 dark:text-rose-400",
              )}
            >
              {formatMoney(valueCents, { compact: true })}
            </div>
            {hint ? (
              <div className="text-xs text-muted-foreground">{hint}</div>
            ) : null}
          </div>
          <div className="grid h-9 w-9 place-items-center rounded-md bg-muted text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>
        </div>
        {delta !== undefined ? (
          <div
            className={cn(
              "mt-3 inline-flex items-center gap-1 text-xs font-medium",
              isNeg
                ? "text-rose-600 dark:text-rose-400"
                : "text-emerald-600 dark:text-emerald-400",
            )}
          >
            <Arrow className="h-3 w-3" />
            {(delta * 100).toFixed(1)}% vs last month
          </div>
        ) : (
          <div className="mt-3 text-xs text-muted-foreground">
            No data yet — waiting on integration
          </div>
        )}
      </CardContent>
    </Card>
  );
}
