import Link from "next/link";
import { PageHeader } from "@/components/shell/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plug, Users, Building2, ShieldCheck } from "lucide-react";

const cards = [
  {
    href: "/settings/integrations",
    icon: Plug,
    title: "Integrations",
    blurb: "Connect QuickBooks, Plaid, Stripe, Google + Meta Ads, etc.",
  },
  {
    href: "/settings/team",
    icon: Users,
    title: "Team & access",
    blurb: "Invite Ignacio, your brother and other operators. Per-entity scopes.",
  },
  {
    href: "/entities",
    icon: Building2,
    title: "Entities",
    blurb: "Rename, archive or add corporations.",
  },
  {
    href: "/settings/security",
    icon: ShieldCheck,
    title: "Security",
    blurb: "MFA, sessions, audit log.",
  },
];

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Wire integrations, manage who can see what, and harden access."
      />
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 md:p-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.href} href={c.href as string}>
              <Card className="h-full transition-colors hover:bg-accent/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Icon className="h-4 w-4" />
                    {c.title}
                  </CardTitle>
                  <CardDescription>{c.blurb}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-xs text-muted-foreground">Open →</span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </>
  );
}
