import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div className="max-w-md space-y-4">
        <div className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          404
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          That page isn't part of the portfolio.
        </h1>
        <p className="text-sm text-muted-foreground">
          Head back to the executive dashboard.
        </p>
        <Button asChild>
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
