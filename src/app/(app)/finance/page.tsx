import Link from "next/link";
import {
  Banknote,
  FileSpreadsheet,
  Receipt,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { activeEntities } from "@/data/entities";
import { kpisFor, portfolioRollup } from "@/data/kpis";
import { formatMoney } from "@/lib/utils";

export default function FinancePage() {
  const active = activeEntities();
  const totals = portfolioRollup(active);
  const netMtd = totals.monthRevenueCents - totals.monthExpensesCents;

  return (
    <>
      <PageHeader
        title="Finance"
        description="Consolidated and per-entity. Every value is stored in cents, then formatted — no float drift, no rounding surprises."
        actions={
          <Button asChild size="sm" variant="outline">
            <Link href="/settings/integrations">Connect sources</Link>
          </Button>
        }
      />

      <div className="space-y-8 p-4 md:p-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Cash on hand"
            valueCents={totals.cashCents}
            icon={Banknote}
          />
          <KpiCard
            label="Revenue MTD"
            valueCents={totals.monthRevenueCents}
            icon={TrendingUp}
          />
          <KpiCard
            label="Expenses MTD"
            valueCents={totals.monthExpensesCents}
            icon={TrendingDown}
          />
          <KpiCard
            label="Net MTD"
            valueCents={netMtd}
            icon={FileSpreadsheet}
            tone={netMtd < 0 ? "negative" : "positive"}
          />
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Receivables open</CardTitle>
              <CardDescription>Money owed to us.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {formatMoney(totals.arOutstandingCents)}
              </div>
              <Button asChild variant="link" size="sm" className="px-0">
                <Link href="/finance/ar">View AR aging →</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payables open</CardTitle>
              <CardDescription>Money we owe.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {formatMoney(totals.apOutstandingCents)}
              </div>
              <Button asChild variant="link" size="sm" className="px-0">
                <Link href="/finance/ap">View AP aging →</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Monthly close</CardTitle>
              <CardDescription>
                Ignacio Zafatle prepares taxes monthly for 3 entities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">Next deadline: TBD</Badge>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Per-entity P&L (month-to-date)
          </h2>
          <Card>
            <CardContent className="px-0">
              <div className="grid grid-cols-12 px-6 py-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <div className="col-span-4">Entity</div>
                <div className="col-span-2 text-right">Cash</div>
                <div className="col-span-2 text-right">Revenue</div>
                <div className="col-span-2 text-right">Expenses</div>
                <div className="col-span-2 text-right">Net</div>
              </div>
              <div className="divide-y">
                {active.map((e) => {
                  const k = kpisFor(e);
                  const net = k.monthRevenueCents - k.monthExpensesCents;
                  return (
                    <Link
                      key={e.slug}
                      href={`/entities/${e.slug}`}
                      className="grid grid-cols-12 items-center px-6 py-3 text-sm hover:bg-accent/40"
                    >
                      <div className="col-span-4 flex items-center gap-2 truncate">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ background: e.color }}
                        />
                        <span className="truncate">{e.shortName}</span>
                      </div>
                      <div className="col-span-2 text-right">
                        {formatMoney(k.cashCents)}
                      </div>
                      <div className="col-span-2 text-right">
                        {formatMoney(k.monthRevenueCents)}
                      </div>
                      <div className="col-span-2 text-right">
                        {formatMoney(k.monthExpensesCents)}
                      </div>
                      <div className="col-span-2 text-right font-medium">
                        {formatMoney(net)}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Receipt className="h-4 w-4" /> Source-of-truth roadmap
            </CardTitle>
            <CardDescription>
              The order we'll wire books up so this page goes from zeros to live.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm">
              <li>
                <span className="font-medium">1.</span> Design Suites Miami —
                reconcile and sync QuickBooks (catch up any stale months).
              </li>
              <li>
                <span className="font-medium">2.</span> Travel Rentals — import
                Ignacio's Google Sheet on a schedule.
              </li>
              <li>
                <span className="font-medium">3.</span> Atelier Liquor & Deli —
                Plaid bank feed + POS connector.
              </li>
              <li>
                <span className="font-medium">4.</span> FLY Amazon — Amazon
                Seller settlement reports.
              </li>
              <li>
                <span className="font-medium">5.</span> FLY Miami Art + Pilates
                Miami — Stripe / Square + Plaid.
              </li>
              <li>
                <span className="font-medium">6.</span> Holding corps — Plaid
                read-only for bank balance.
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
