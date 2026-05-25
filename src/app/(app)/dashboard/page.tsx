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
  Instagram,
  MapPin,
  Eye,
  Heart,
  MousePointer,
  Phone,
  Navigation,
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
import { metricsFor, rollupMetrics } from "@/data/metrics";

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
}

export default function DashboardPage() {
  const active = activeEntities();
  const slugs = active.map((e) => e.slug);
  const totals = rollupMetrics(slugs);
  const allCount = entities.length;
  const activeCount = active.length;

  return (
    <>
      <PageHeader
        title="Executive dashboard"
        description={`Forest view across all ${allCount} entities (${activeCount} active). Financial data wires up when accounting sources connect. Social + Google Business numbers are live.`}
        actions={
          <Button asChild size="sm" variant="outline">
            <Link href="/settings/integrations">Connect a data source</Link>
          </Button>
        }
      />

      <div className="space-y-8 p-4 md:p-6">
        {/* Social + GMB — LIVE data */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Live — Instagram + Google Business (30 days)
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <StatCard icon={Instagram} label="IG followers" value={fmt(totals.igFollowers)} />
            <StatCard icon={Eye} label="IG views" value={fmt(totals.igViews30d)} />
            <StatCard icon={Heart} label="IG likes" value={fmt(totals.igLikes30d)} />
            <StatCard icon={MapPin} label="GMB impressions" value={fmt(totals.gmbImpressions30d)} />
            <StatCard icon={MousePointer} label="GMB clicks" value={fmt(totals.gmbClicks30d)} />
            <StatCard icon={Navigation} label="Directions" value={fmt(totals.gmbDirectionRequests30d)} />
          </div>
        </section>

        {/* Financial KPIs — $0 until accounting wired */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Financial (waiting on accounting sources)
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Cash on hand" valueCents={totals.cashCents} icon={Banknote} hint="Across all bank accounts" />
            <KpiCard label="Revenue (MTD)" valueCents={totals.monthRevenueCents} icon={TrendingUp} hint="Consolidated" />
            <KpiCard label="Ad spend (MTD)" valueCents={totals.adSpendMtdCents} icon={Megaphone} hint="Google + Meta" />
            <KpiCard label="AR outstanding" valueCents={totals.arOutstandingCents} icon={Receipt} hint="Open invoices" />
          </div>
        </section>

        {/* Per-entity social + GMB table */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>Active entities — live metrics</CardTitle>
                <CardDescription>
                  Instagram + Google Business data. Click a row to drill in.
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/entities">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="px-0">
              <div className="grid grid-cols-12 px-6 py-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <div className="col-span-3">Entity</div>
                <div className="col-span-2 text-right">IG followers</div>
                <div className="col-span-2 text-right">IG views 30d</div>
                <div className="col-span-2 text-right">GMB impr.</div>
                <div className="col-span-1 text-right">Clicks</div>
                <div className="col-span-2 text-right">Directions</div>
              </div>
              <div className="divide-y">
                {active.map((entity) => {
                  const m = metricsFor(entity.slug);
                  return (
                    <Link
                      key={entity.slug}
                      href={`/entities/${entity.slug}`}
                      className="grid grid-cols-12 items-center px-6 py-3 text-sm hover:bg-accent/40"
                    >
                      <div className="col-span-3 flex items-center gap-2 truncate">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: entity.color }} />
                        <span className="truncate">{entity.shortName}</span>
                      </div>
                      <div className="col-span-2 text-right font-medium">
                        {m.igFollowers > 0 ? fmt(m.igFollowers) : "—"}
                      </div>
                      <div className="col-span-2 text-right">
                        {m.igViews30d > 0 ? fmt(m.igViews30d) : "—"}
                      </div>
                      <div className="col-span-2 text-right">
                        {m.gmbImpressions30d > 0 ? fmt(m.gmbImpressions30d) : "—"}
                      </div>
                      <div className="col-span-1 text-right">
                        {m.gmbClicks30d > 0 ? fmt(m.gmbClicks30d) : "—"}
                      </div>
                      <div className="col-span-2 text-right">
                        {m.gmbDirectionRequests30d > 0 ? fmt(m.gmbDirectionRequests30d) : "—"}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Setup progress</CardTitle>
              <CardDescription>
                What's done, what's next.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm">
                <SetupStep done label="Pull Instagram metrics (Windsor.ai)" href="/ads" hint="18K + 4.8K followers live" />
                <SetupStep done label="Pull Google Business data" href="/ads" hint="5 locations, 30d metrics" />
                <SetupStep done label="Build FLY Miami Art website" href="/art" hint="Live at /art" />
                <SetupStep done={false} label="Build Pilates + Atelier websites" href="/ads" hint="Unblocks local ads" />
                <SetupStep done={false} label="Reactivate Google Ads (FLY Miami Art)" href="/ads" hint="$668 spent last year, now paused" />
                <SetupStep done={false} label="Sync QuickBooks (Design Suites)" href="/settings/integrations" hint="Pull P&L · AR/AP" />
                <SetupStep done={false} label="Import Ignacio's sheet (Travel Rentals)" href="/entities/travel-rentals" hint="Google Sheets → ledger" />
              </ol>
            </CardContent>
          </Card>
        </section>

        {/* Insights — real signals from data */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Insights from live data
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="h-4 w-4" /> Atelier: 124 directions, no website
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-amber-800 dark:text-amber-300">
                People walk to Atelier every day (124 direction requests / month) but there's no website to order ahead or see hours. A simple landing page could convert those 124 visits into pre-orders.
              </CardContent>
            </Card>
            <Card className="border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="h-4 w-4" /> FLY Miami Art: ads paused 30+ days
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-amber-800 dark:text-amber-300">
                Google Ads spent $668 and got 30K clicks last year. Campaign "Sales-Performance Max-2" has been inactive 30+ days. The /art website is now live — ads can resume.
              </CardContent>
            </Card>
            <Card className="border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-emerald-700 dark:text-emerald-400">
                  <TrendingUp className="h-4 w-4" /> Pilates: strong organic demand
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-emerald-800 dark:text-emerald-300">
                4.8K followers, 1,981 GMB impressions, 126 website clicks and 62 direction requests — all organic. A small ad budget on Google "pilates near me" could double bookings.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick links */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Coins className="h-4 w-4" /> Per-entity P&L
              </CardTitle>
              <CardDescription>Full income statement per entity.</CardDescription>
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
              <CardDescription>Google + Meta campaigns per entity.</CardDescription>
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
              <CardDescription>Single inbox across every entity.</CardDescription>
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

function StatCard({ icon: Icon, label, value }: { icon: typeof Instagram; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="text-lg font-semibold leading-tight">{value}</div>
          <div className="text-[11px] text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function SetupStep({ done, label, href, hint }: { done: boolean; label: string; href: string; hint: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className={done
        ? "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-600"
        : "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border bg-muted text-muted-foreground"
      }>
        {done ? <CheckCircle2 className="h-3 w-3" /> : <Wallet className="h-3 w-3" />}
      </span>
      <div className="min-w-0 flex-1">
        <Link href={href} className="block text-sm font-medium leading-tight hover:underline">{label}</Link>
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
        <CardDescription>How the 12 corps relate.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {tree.filter(({ root }) => root.status !== "holding").map(({ root, children }) => (
            <li key={root.slug}>
              <Link href={`/entities/${root.slug}`} className="inline-flex items-center gap-2 text-sm font-medium hover:underline">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: root.color }} />
                {root.legalName}
              </Link>
              {children.length > 0 ? (
                <ul className="ml-5 mt-1 space-y-1 border-l pl-3">
                  {children.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/entities/${c.slug}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:underline">
                        <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
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
          + 7 holding corps — see <Link href="/entities" className="underline">full list</Link>.
        </div>
      </CardContent>
    </Card>
  );
}
