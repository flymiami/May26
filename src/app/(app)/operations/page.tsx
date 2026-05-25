import Link from "next/link";
import { CheckSquare, Plus, FileText, Users } from "lucide-react";
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

interface SeedTask {
  id: string;
  entitySlug: string;
  title: string;
  due: string;
  status: "open" | "blocked" | "in_progress";
}

const SEED_TASKS: SeedTask[] = [
  {
    id: "t1",
    entitySlug: "design-suites-miami",
    title: "Reconcile QuickBooks ledger for the last 3 months",
    due: "This week",
    status: "open",
  },
  {
    id: "t2",
    entitySlug: "travel-rentals",
    title: "Get read-only access to Ignacio's master Google Sheet",
    due: "This week",
    status: "open",
  },
  {
    id: "t3",
    entitySlug: "fly-amazon",
    title: "Pull last 30 days of Amazon settlement report",
    due: "Next week",
    status: "open",
  },
  {
    id: "t4",
    entitySlug: "atelier-liquor-deli",
    title: "Choose POS — first step toward to-the-penny daily sales",
    due: "This month",
    status: "open",
  },
  {
    id: "t5",
    entitySlug: "pilates-miami",
    title: "Confirm Stripe (or Square) handles class bookings",
    due: "This month",
    status: "open",
  },
];

export default function OperationsPage() {
  const active = activeEntities();
  const byEntity = (slug: string) =>
    active.find((e) => e.slug === slug);

  return (
    <>
      <PageHeader
        title="Operations"
        description="One inbox of work across every entity. Tasks, docs and contacts feed the executive dashboard's alert counts."
        actions={
          <Button size="sm" disabled>
            <Plus className="mr-2 h-4 w-4" /> New task
          </Button>
        }
      />

      <div className="space-y-8 p-4 md:p-6">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckSquare className="h-4 w-4" /> Tasks
              </CardTitle>
              <CardDescription>
                Everything that needs to happen, across entities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{SEED_TASKS.length}</div>
              <div className="text-xs text-muted-foreground">Open</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4" /> Documents
              </CardTitle>
              <CardDescription>
                Operating agreements, leases, tax filings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">0</div>
              <div className="text-xs text-muted-foreground">Stored</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4" /> Contacts
              </CardTitle>
              <CardDescription>
                Tenants, customers, vendors, accountants.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">0</div>
              <div className="text-xs text-muted-foreground">In CRM</div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Open tasks · seed
          </h2>
          <Card>
            <CardContent className="px-0">
              <div className="divide-y">
                {SEED_TASKS.map((t) => {
                  const e = byEntity(t.entitySlug);
                  return (
                    <div
                      key={t.id}
                      className="flex items-start gap-3 px-6 py-3 text-sm"
                    >
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 cursor-not-allowed"
                        disabled
                        aria-label={t.title}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium">{t.title}</div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                          {e ? (
                            <Link
                              href={`/entities/${e.slug}`}
                              className="inline-flex items-center gap-1.5 hover:underline"
                            >
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{ background: e.color }}
                              />
                              {e.shortName}
                            </Link>
                          ) : null}
                          <span>·</span>
                          <span>{t.due}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {t.status.replace(/_/g, " ")}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
