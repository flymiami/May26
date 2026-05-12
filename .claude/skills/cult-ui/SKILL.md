---
name: cult-ui
description: Install and use Cult UI components (https://cult-ui.com). Use when the user wants to add Cult UI components to a React/Next.js project, configure the Cult UI shadcn registry, or asks about specific Cult UI components like texture-card, texture-button, text-gif, family-button, dynamic-island, gradient-heading, neumorph-button, side-panel, sortable-list, tweet-grid, etc.
---

# Cult UI

Cult UI (https://www.cult-ui.com) is a shadcn-compatible component library for React/Next.js. Components are styled with Tailwind CSS, animated with Framer Motion, and installed through the shadcn CLI using Cult's namespaced registry (`@cult-ui/<component>`).

## Prerequisites

Before installing Cult UI components, the project must have:

1. **React + TypeScript** (Next.js, Vite, Remix, Astro, or Tanstack Start all work).
2. **Tailwind CSS v4** configured.
3. **shadcn/ui initialized** with a `components.json` at the project root.

If `components.json` does not exist, initialize shadcn first:

```bash
pnpm dlx shadcn@latest init
```

Use `npx` / `yarn dlx` / `bunx` as appropriate for the project's package manager.

## Configure the Cult UI registry

Cult UI is a namespaced registry. Add it under `registries` in `components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {
    "@cult-ui": "https://www.cult-ui.com/r/{name}.json"
  }
}
```

Only the `registries` block is required — keep the project's existing settings for everything else. Edit the file with Edit/Write, do not recreate it from scratch.

## Install components

Use the shadcn beta CLI with the `@cult-ui/<name>` prefix:

```bash
# Single component
pnpm dlx shadcn@beta add @cult-ui/texture-card

# Multiple components in one call
pnpm dlx shadcn@beta add @cult-ui/texture-card @cult-ui/texture-button

# Discover what's available
pnpm dlx shadcn@beta search @cult-ui --query "button"
```

The `@beta` tag is required — namespaced registries are not in stable shadcn yet. Match the package manager to the project (`npx shadcn@beta`, `bunx shadcn@beta`, `yarn dlx shadcn@beta`).

Installed components land in `components/ui/` (or wherever the `ui` alias points). Any dependencies (other Cult components, shadcn primitives, npm packages like `framer-motion`) are pulled in automatically by the CLI.

## Common components

A non-exhaustive list — use `shadcn@beta search @cult-ui` to discover more:

- `texture-card`, `texture-button` — tactile, layered surfaces
- `text-gif` — text rendered with a looping GIF fill
- `family-button` — Apple-style expanding action button
- `dynamic-island` — animated iOS-style status pill
- `gradient-heading` — preset gradient text styles
- `neumorph-button` — soft neumorphic button
- `side-panel` — sliding sheet panel
- `sortable-list` — drag-and-drop reorderable list
- `tweet-grid` — masonry grid of embedded tweets
- `direction-aware-tabs`, `minimal-card`, `popover-form`, `feature-with-image-carousel`

## Usage after install

Import from the project's UI alias and use like any shadcn component:

```tsx
import { TextureCard, TextureCardContent } from "@/components/ui/texture-card"

export function Example() {
  return (
    <TextureCard>
      <TextureCardContent>Hello from Cult UI</TextureCardContent>
    </TextureCard>
  )
}
```

## Troubleshooting

- **"Unknown registry @cult-ui"** — `components.json` is missing the `registries` entry, or the project is using stable `shadcn` instead of `shadcn@beta`.
- **Tailwind classes not applying** — confirm Tailwind v4 is set up and `globals.css` is imported in the root layout.
- **Animations missing** — most motion components require `framer-motion` / `motion`; the CLI adds it, but verify it's in `package.json` if a component renders statically.
- **403 fetching the registry** — Cult's site blocks some user agents; the CLI works, but plain `curl` may not. Use the CLI to install, not manual downloads.

## References

- Docs: https://www.cult-ui.com/docs
- Installation guide: https://www.cult-ui.com/docs/installation
- Source: https://github.com/nolly-studio/cult-ui
