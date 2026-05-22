"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  Wallet,
  CheckSquare,
  Building2,
  Settings,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  /** subtitle shown under the label */
  hint?: string;
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Portfolio",
    items: [
      {
        href: "/dashboard",
        label: "Executive",
        icon: LayoutDashboard,
        hint: "Rollup across all entities",
      },
      {
        href: "/entities",
        label: "Entities",
        icon: Building2,
        hint: "12 corps · ownership tree",
      },
    ],
  },
  {
    label: "Day-1 priorities",
    items: [
      {
        href: "/ads",
        label: "Ads",
        icon: Megaphone,
        hint: "Google + Meta · ROAS",
      },
      {
        href: "/finance",
        label: "Finance",
        icon: Wallet,
        hint: "P&L · cash · AR/AP",
      },
      {
        href: "/operations",
        label: "Operations",
        icon: CheckSquare,
        hint: "Tasks · docs · contacts",
      },
    ],
  },
  {
    label: "System",
    items: [{ href: "/settings", label: "Settings", icon: Settings }],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-card md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">
          <Building className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-semibold leading-tight">May26</div>
          <div className="text-xs leading-tight text-muted-foreground">
            Business portal
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-4">
            <div className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {group.label}
            </div>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-start gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                      )}
                    >
                      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                      <div className="flex flex-col leading-tight">
                        <span className="font-medium text-foreground/90">
                          {item.label}
                        </span>
                        {item.hint ? (
                          <span className="text-[11px] text-muted-foreground">
                            {item.hint}
                          </span>
                        ) : null}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t p-3 text-[11px] text-muted-foreground">
        <div>Signed in as</div>
        <div className="truncate font-medium text-foreground">
          fy@designsuitesmiami.com
        </div>
      </div>
    </aside>
  );
}
