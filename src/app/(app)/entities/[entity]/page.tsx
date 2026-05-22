import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Banknote,
  Building2,
  Megaphone,
  Receipt,
  TrendingUp,
  Users,
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { entities, getEntity } from "@/data/entities";
import { kpisFor } from "@/data/kpis";

export function generateStaticParams() {
  return entities.map((e) => ({ entity: e.slug }));
}

export default function EntityPage({ params }: { params: { entity: string } }) {
  const entity = getEntity(params.entity);
  if (!entity) notFound();
  const k = kpisFor(entity);
  const parent = entity.parentSlug ? getEntity(entity.parentSlug) : null;
  const children = entities.filter((e) => e.parentSlug === entity.slug);

  return (
    <>
      <PageHeader
        title={entity.legalName}
        description={entity.blurb}
        actions={
          <Button asChild size="sm" variant="outline">
            <Link href="/entities">
              <ArrowLeft className="mr-2 h-4 w-4" /> All entities
            </Link>
          </Button>
        }
      />
      <div className="space-y-8 p-4 md:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="capitalize">
            {entity.status}
          </Badge>
          <Badge variant="secondary">{entity.legalSuffix}</Badge>
          <Badge variant="secondary" className="capitalize">
            {entity.kind.replace(/_/g, " ")}
          </Badge>
          {parent ? (
            <Link
              href={`/entities/${parent.slug}`}
              className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              Owned by {parent.shortName}
            </Link>
          ) : null}
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Cash"
            valueCents={k.cashCents}
            icon={Banknote}
            hint="Bank balance"
          />
          <KpiCard
            label="Revenue MTD"
            valueCents={k.monthRevenueCents}
            icon={TrendingUp}
          />
          <KpiCard
            label="Ad spend MTD"
            valueCents={k.adSpendMtdCents}
            icon={Megaphone}
          />
          <KpiCard
            label="AR open"
            valueCents={k.arOutstandingCents}
            icon={Receipt}
          />
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4" /> People
              </CardTitle>
              <CardDescription>
                Who's responsible for this entity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {entity.contacts.map((c) => (
                  <li
                    key={`${c.role}-${c.name}`}
                    className="flex flex-wrap items-baseline gap-x-2"
                  >
                    <span className="font-medium">{c.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {c.role}
                    </span>
                    {c.email ? (
                      <a
                        href={`mailto:${c.email}`}
                        className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                      >
                        {c.email}
                      </a>
                    ) : null}
                    {c.note ? (
                      <span className="text-xs text-muted-foreground">
                        — {c.note}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="h-4 w-4" /> Books & integrations
              </CardTitle>
              <CardDescription>
                Where this entity's financial truth lives today.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {entity.accountingSources.map((s) => (
                  <Badge key={s} variant="outline" className="capitalize">
                    {s.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>
              {entity.notes?.length ? (
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {entity.notes.map((n) => (
                    <li key={n}>· {n}</li>
                  ))}
                </ul>
              ) : null}
              <Button size="sm" variant="outline" asChild>
                <Link href={`/settings/integrations?entity=${entity.slug}`}>
                  Connect / reconnect data sources
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {children.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sub-entities</CardTitle>
              <CardDescription>
                Companies operated under {entity.shortName}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {children.map((c) => (
                <Link
                  key={c.slug}
                  href={`/entities/${c.slug}`}
                  className="flex items-center gap-3 rounded-md p-2 hover:bg-accent/40"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: c.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{c.legalName}</div>
                    <div className="text-xs text-muted-foreground">
                      {c.blurb}
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </>
  );
}
