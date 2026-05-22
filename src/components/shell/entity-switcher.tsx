"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronsUpDown, Check, Building } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { entities, type Entity } from "@/data/entities";
import { cn } from "@/lib/utils";

const STATUS_ORDER: Record<Entity["status"], number> = {
  active: 0,
  holding: 1,
  dormant: 2,
};

export function EntitySwitcher() {
  const params = useParams<{ entity?: string }>();
  const active = entities.find((e) => e.slug === params?.entity);

  const sorted = [...entities].sort(
    (a, b) =>
      STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
      a.shortName.localeCompare(b.shortName),
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 min-w-[220px] justify-between gap-2"
        >
          <span className="flex items-center gap-2 truncate">
            {active ? (
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: active.color }}
              />
            ) : (
              <Building className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="truncate">
              {active ? active.shortName : "Portfolio view"}
            </span>
          </span>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[280px]">
        <DropdownMenuLabel>Switch entity</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer">
            <Building className="mr-2 h-4 w-4" />
            Portfolio view (all entities)
            {!active && <Check className="ml-auto h-4 w-4" />}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
          Active
        </DropdownMenuLabel>
        {sorted
          .filter((e) => e.status === "active")
          .map((e) => (
            <EntityItem key={e.slug} entity={e} activeSlug={active?.slug} />
          ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
          Holding / dormant
        </DropdownMenuLabel>
        {sorted
          .filter((e) => e.status !== "active")
          .map((e) => (
            <EntityItem key={e.slug} entity={e} activeSlug={active?.slug} />
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function EntityItem({
  entity,
  activeSlug,
}: {
  entity: Entity;
  activeSlug?: string;
}) {
  const isActive = entity.slug === activeSlug;
  return (
    <DropdownMenuItem asChild>
      <Link
        href={`/entities/${entity.slug}`}
        className={cn("cursor-pointer", isActive && "bg-accent")}
      >
        <span
          className="mr-2 h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ background: entity.color }}
        />
        <span className="flex-1 truncate">{entity.shortName}</span>
        {isActive && <Check className="ml-auto h-4 w-4" />}
      </Link>
    </DropdownMenuItem>
  );
}
