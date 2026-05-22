import { PageHeader } from "@/components/shell/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Integration {
  name: string;
  category: "Ads" | "Accounting" | "Banking" | "Commerce" | "Workspace";
  blurb: string;
  status: "Not connected" | "Stale" | "Connected";
  envVars?: string[];
}

const integrations: Integration[] = [
  {
    name: "Google Ads",
    category: "Ads",
    blurb: "Pull spend + insights, push campaign approvals.",
    status: "Not connected",
    envVars: ["GOOGLE_ADS_DEVELOPER_TOKEN"],
  },
  {
    name: "Meta Ads",
    category: "Ads",
    blurb: "Facebook + Instagram. Spend, ROAS, creative approvals.",
    status: "Not connected",
    envVars: ["META_ADS_ACCESS_TOKEN"],
  },
  {
    name: "QuickBooks Online",
    category: "Accounting",
    blurb: "Source of truth for Design Suites Miami. P&L, Balance Sheet, AR/AP.",
    status: "Stale",
    envVars: ["QUICKBOOKS_CLIENT_ID", "QUICKBOOKS_CLIENT_SECRET"],
  },
  {
    name: "Google Sheets",
    category: "Accounting",
    blurb: "Import Ignacio's Travel Rentals workbook on a schedule.",
    status: "Not connected",
  },
  {
    name: "Plaid",
    category: "Banking",
    blurb: "Bank balances for every entity — even the dormant holding corps.",
    status: "Not connected",
  },
  {
    name: "Stripe",
    category: "Commerce",
    blurb: "Pilates Miami, FLY Miami Art — card payments.",
    status: "Not connected",
  },
  {
    name: "Amazon Seller",
    category: "Commerce",
    blurb: "FLY Amazon — settlement reports, orders, returns.",
    status: "Not connected",
  },
  {
    name: "Shopify",
    category: "Commerce",
    blurb: "Available if FLY Miami Art moves to a Shopify storefront.",
    status: "Not connected",
  },
  {
    name: "Gmail / Google Workspace",
    category: "Workspace",
    blurb: "Pull invoices and receipts from inboxes.",
    status: "Not connected",
  },
];

export default function IntegrationsPage() {
  const groups = Array.from(new Set(integrations.map((i) => i.category)));

  return (
    <>
      <PageHeader
        title="Integrations"
        description="Each connection adds another layer of fidelity. Connect them in the order suggested on the Finance and Ads pages."
      />
      <div className="space-y-8 p-4 md:p-6">
        {groups.map((g) => (
          <section key={g} className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {g}
            </h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {integrations
                .filter((i) => i.category === g)
                .map((i) => (
                  <Card key={i.name}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{i.name}</CardTitle>
                        <Badge
                          variant={
                            i.status === "Connected"
                              ? "default"
                              : i.status === "Stale"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {i.status}
                        </Badge>
                      </div>
                      <CardDescription>{i.blurb}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {i.envVars?.length ? (
                        <div className="space-y-1">
                          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                            Env vars needed
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {i.envVars.map((v) => (
                              <code
                                key={v}
                                className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]"
                              >
                                {v}
                              </code>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      <Button size="sm" variant="outline" disabled>
                        Connect (coming soon)
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
