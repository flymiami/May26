import Link from "next/link";
import { Megaphone, Plus, Sparkles, Target } from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
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
import { kpisFor } from "@/data/kpis";
import { formatMoney } from "@/lib/utils";

export default function AdsPage() {
  const active = activeEntities();

  return (
    <>
      <PageHeader
        title="Ads"
        description="Day-1 priority. Plan, launch and measure Google + Meta campaigns per entity, with revenue attribution rolling up to the executive dashboard."
        actions={
          <>
            <Button size="sm" variant="outline" asChild>
              <Link href="/settings/integrations">Connect Google + Meta</Link>
            </Button>
            <Button size="sm" disabled>
              <Plus className="mr-2 h-4 w-4" /> New campaign
            </Button>
          </>
        }
      />

      <div className="space-y-8 p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Connect ad platforms to unlock this view
            </CardTitle>
            <CardDescription>
              Once Google Ads and Meta accounts are connected per entity, you'll
              see live spend, ROAS and an approval flow for new creatives here.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <PlatformCard
              name="Google Ads"
              status="Not connected"
              hint="Search, Performance Max, YouTube"
            />
            <PlatformCard
              name="Meta Ads"
              status="Not connected"
              hint="Facebook, Instagram, Audience Network"
            />
          </CardContent>
        </Card>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Active entities · spend snapshot
          </h2>
          <Card>
            <CardContent className="px-0">
              <div className="grid grid-cols-12 px-6 py-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <div className="col-span-4">Entity</div>
                <div className="col-span-3 text-right">Spend MTD</div>
                <div className="col-span-3 text-right">Revenue MTD</div>
                <div className="col-span-2 text-right">ROAS</div>
              </div>
              <div className="divide-y">
                {active.map((e) => {
                  const k = kpisFor(e);
                  const roas =
                    k.adSpendMtdCents > 0
                      ? (k.adRevenueMtdCents / k.adSpendMtdCents).toFixed(2)
                      : "—";
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
                      <div className="col-span-3 text-right">
                        {formatMoney(k.adSpendMtdCents)}
                      </div>
                      <div className="col-span-3 text-right">
                        {formatMoney(k.adRevenueMtdCents)}
                      </div>
                      <div className="col-span-2 text-right text-muted-foreground">
                        {roas}
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
              <Target className="h-4 w-4" /> Campaign ideas the portal can run
            </CardTitle>
            <CardDescription>
              Suggested starting points per active entity — review and approve
              once integrations land.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <CampaignIdea
              entity="FLY Amazon"
              platform="Google · Pmax"
              hypothesis="Drive Amazon listing sessions on best-margin SKUs."
            />
            <CampaignIdea
              entity="FLY Miami Art"
              platform="Meta · Instagram"
              hypothesis="Local Miami collectors — carousel + DM CTA."
            />
            <CampaignIdea
              entity="Atelier Liquor & Deli"
              platform="Meta · Geo-targeted"
              hypothesis="2 mi radius — daily deli specials + delivery."
            />
            <CampaignIdea
              entity="Pilates Miami"
              platform="Google · Search"
              hypothesis="Capture 'pilates near me' intent in Miami zip codes."
            />
            <CampaignIdea
              entity="Travel Rentals"
              platform="Meta · Lookalike"
              hypothesis="ES-AR audiences for Argentine hotels."
            />
            <CampaignIdea
              entity="Design Suites Miami"
              platform="Google · Search"
              hypothesis="Commercial-tenant prospecting for available units."
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function PlatformCard({
  name,
  status,
  hint,
}: {
  name: string;
  status: string;
  hint: string;
}) {
  return (
    <div className="flex items-start justify-between rounded-lg border p-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Megaphone className="h-4 w-4 text-muted-foreground" />
          {name}
        </div>
        <div className="text-xs text-muted-foreground">{hint}</div>
      </div>
      <Badge variant="outline">{status}</Badge>
    </div>
  );
}

function CampaignIdea({
  entity,
  platform,
  hypothesis,
}: {
  entity: string;
  platform: string;
  hypothesis: string;
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{entity}</div>
        <Badge variant="secondary" className="text-[10px]">
          {platform}
        </Badge>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{hypothesis}</p>
    </div>
  );
}
