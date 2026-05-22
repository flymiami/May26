import Link from "next/link";
import {
  Wallet,
  Megaphone,
  Coins,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Banknote,
  Receipt,
} from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  activeEntities,
  entities,
  entityTree,
  type Entity,
} from "@/data/entities";
import { kpisFor, portfolioRollup } from "@/data/kpis";
import { formatMoney } from "@/lib/utils";

export default function DashboardPage() {
  const active = activeEntities();
  const totals = portfolioRollup(active);
  const allCount = entities.length;
  const activeCount = active.length;

  return (
    <>
      <PageHeader
        title="Executive dashboard"
        description={`The forest view across all ${allCount} entities (${activeCount} active). Numbers stay at zero until each entity is wired to its source of truth.`}
        actions={
          <Button asChild size="sm" variant="outline">
            <Link href="/settings/integrations">Connect a data source</Link>
          </Button>
        }
      />

      <div className="space-y-8 p-4 md:p-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Cash on hand"
            valueCents={totals.cashCents}
            icon={Banknote}
            hint="Across all bank accounts"
          />
          <KpiCard
            label="Revenue (MTD)"
            valueCents={totals.monthRevenueCents}
            icon={TrendingUp}
            hint="Consolidated, month-to-date"
          />
          <KpiCard
            label="Ad spend (MTD)"
            valueCents={totals.adSpendMtdCents}
            icon={Megaphone}
            hint="Google + Meta combined"
          />
          <KpiCard
            label="AR outstanding"
            valueCents={totals.arOutstandingCents}
            icon={Receipt}
            hint="Open customer invoices"
          />
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>Active entities</CardTitle>
                <CardDescription>
                  One row per operating company — click to drill in.
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/entities">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="px-0">
              <div className="divide-y">
                {active.map((entity) => (
                  <EntityRow key={entity.slug} entity={entity} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Day-1 setup</CardTitle>
              <CardDescription>
                Wire these up in this order to start pulling real numbers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm">
                <SetupStep
                  done={false}
                  label="Connect Google Ads + Meta Ads"
                  href="/ads"
                  hint="Priority 1 — push spend, pull ROAS"
                />
                <SetupStep
                  done={false}
                  label="Sync QuickBooks (Design Suites)"
                  href="/settings/integrations"
                  hint="Pull P&L · Balance Sheet · AR/AP"
                />
                <SetupStep
                  done={false}
                  label="Import Ignacio's sheet (Travel Rentals)"
                  href="/entities/travel-rentals"
                  hint="Google Sheets → ledger"
                />
                <SetupStep
                  done={false}
                  label="Add Plaid bank feeds (all entities)"
                  href="/settings/integrations"
                  hint="Cash balance to the penny"
                />
                <SetupStep
                  done={false}
                  label="Invite Ignacio + brother"
                  href="/settings/team"
                  hint="Scoped access per entity"
                />
              </ol>
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Coins className="h-4 w-4" /> Per-entity P&L
              </CardTitle>
              <CardDescription>
                Drill into any active entity for a full income statement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/finance">Open finance</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Megaphone className="h-4 w-4" /> Push ads
              </CardTitle>
              <CardDescription>
                Plan and approve campaigns across Google + Meta.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/ads">Open ads</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2 className="h-4 w-4" /> Tasks & ops
              </CardTitle>
              <CardDescription>
                Single inbox of work across every entity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/operations">Open operations</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <OwnershipTree />
      </div>
    </>
  );
}

function EntityRow({ entity }: { entity: Entity }) {
  const k = kpisFor(entity);
  return (
    <Link
      href={`/entities/${entity.slug}`}
      className="flex items-center gap-3 px-6 py-3 transition-colors hover:bg-accent/40"
    >
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ background: entity.color }}
      />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{entity.shortName}</div>
        <div className="truncate text-xs text-muted-foreground">
          {entity.blurb}
        </div>
      </div>
      <div className="hidden text-right sm:block">
        <div className="text-xs text-muted-foreground">Cash</div>
        <div className="text-sm font-medium">{formatMoney(k.cashCents)}</div>
      </div>
      <div className="hidden text-right md:block">
        <div className="text-xs text-muted-foreground">Rev MTD</div>
        <div className="text-sm font-medium">
          {formatMoney(k.monthRevenueCents)}
        </div>
      </div>
      <div className="hidden text-right md:block">
        <div className="text-xs text-muted-foreground">Ad spend MTD</div>
        <div className="text-sm font-medium">
          {formatMoney(k.adSpendMtdCents)}
        </div>
      </div>
      {k.alerts > 0 ? (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" /> {k.alerts}
        </Badge>
      ) : null}
    </Link>
  );
}

function SetupStep({
  done,
  label,
  href,
  hint,
}: {
  done: boolean;
  label: string;
  href: string;
  hint: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={
          done
            ? "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-600"
            : "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border bg-muted text-muted-foreground"
        }
      >
        {done ? <CheckCircle2 className="h-3 w-3" /> : <Wallet className="h-3 w-3" />}
      </span>
      <div className="min-w-0 flex-1">
        <Link
          href={href}
          className="block text-sm font-medium leading-tight hover:underline"
        >
          {label}
        </Link>
        <div className="text-xs text-muted-foreground">{hint}</div>
      </div>
    </li>
  );
}

function OwnershipTree() {
  const tree = entityTree();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ownership tree</CardTitle>
        <CardDescription>
          How the 12 corps relate. Holding entities are collapsed for clarity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {tree
            .filter(({ root }) => root.status !== "holding")
            .map(({ root, children }) => (
              <li key={root.slug}>
                <Link
                  href={`/entities/${root.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: root.color }}
                  />
                  {root.legalName}
                </Link>
                {children.length > 0 ? (
                  <ul className="ml-5 mt-1 space-y-1 border-l pl-3">
                    {children.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/entities/${c.slug}`}
                          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:underline"
                        >
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ background: c.color }}
                          />
                          {c.legalName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
        </ul>
        <div className="mt-4 text-xs text-muted-foreground">
          + 7 holding corps (real-estate title-holders) — see{" "}
          <Link href="/entities" className="underline">
            full list
          </Link>
          .
        </div>
      </CardContent>
    </Card>
  );
}
