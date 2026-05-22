import Link from "next/link";
import { PageHeader } from "@/components/shell/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { entities, type Entity } from "@/data/entities";

const STATUS_LABEL: Record<Entity["status"], string> = {
  active: "Active",
  holding: "Holding",
  dormant: "Dormant",
};

export default function EntitiesPage() {
  const groups = (["active", "holding", "dormant"] as const).map((status) => ({
    status,
    rows: entities.filter((e) => e.status === status),
  }));

  return (
    <>
      <PageHeader
        title="Entities"
        description="Every corporation in the portfolio. Click a row to drill in."
      />
      <div className="space-y-8 p-4 md:p-6">
        {groups
          .filter((g) => g.rows.length > 0)
          .map((g) => (
            <section key={g.status} className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {STATUS_LABEL[g.status]} · {g.rows.length}
              </h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {g.rows.map((e) => (
                  <EntityCard key={e.slug} entity={e} />
                ))}
              </div>
            </section>
          ))}
      </div>
    </>
  );
}

function EntityCard({ entity }: { entity: Entity }) {
  return (
    <Link href={`/entities/${entity.slug}`} className="block">
      <Card className="h-full transition-colors hover:bg-accent/40">
        <CardHeader>
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ background: entity.color }}
            />
            <CardTitle className="text-base">{entity.shortName}</CardTitle>
            <Badge variant="secondary" className="ml-auto">
              {entity.legalSuffix}
            </Badge>
          </div>
          <CardDescription>{entity.legalName}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">{entity.blurb}</p>
          <div className="flex flex-wrap gap-1.5">
            {entity.accountingSources.map((s) => (
              <Badge key={s} variant="outline" className="text-[10px]">
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
        </CardContent>
      </Card>
    </Link>
  );
}
