import type { Metadata } from "next";
import { MapPin, Mail, Phone, Clock, Beer, Coffee, Sandwich, UtensilsCrossed } from "lucide-react";

export const metadata: Metadata = {
  title: "Atelier Liquor & Bites — Convenience Store · Miami",
  description: "Liquor, snacks, deli bites, coffee and essentials. Open daily in Miami.",
};

export default function AtelierPage() {
  return (
    <main className="bg-stone-900 text-white">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[75vh] flex-col justify-between px-6 py-10 md:px-16 md:py-16">
        <nav className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-white/70">
          <span className="font-medium text-amber-400">Atelier Liquor & Bites</span>
          <div className="hidden gap-8 sm:flex">
            <a href="#menu" className="hover:text-white">What we carry</a>
            <a href="#hours" className="hover:text-white">Hours</a>
            <a href="#contact" className="hover:text-white">Find us</a>
          </div>
        </nav>

        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.25em] text-amber-400/80">Convenience · Liquor · Deli</div>
          <h1 className="serif mt-4 text-5xl leading-tight sm:text-6xl md:text-7xl lg:text-[6rem]">
            Atelier
            <br />
            Liquor
            <br />
            <span className="italic text-amber-400">& Bites.</span>
          </h1>
          <p className="serif mt-6 max-w-xl text-xl text-white/70 md:text-2xl">
            Your neighborhood spot for cold drinks, fresh deli bites and
            everything in between. Open daily in Miami.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.25em] text-white/50">
            <span className="border border-amber-400/40 px-3 py-1 text-amber-300">124 people get directions here every month</span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs uppercase tracking-[0.25em] text-white/50">
          <span>Miami, FL</span>
        </div>
      </section>

      {/* ── What we carry ─────────────────────────────────────────────── */}
      <section id="menu" className="border-t border-white/10 px-6 py-20 md:px-16 md:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-400/70">On the shelves</div>
            <h2 className="serif mt-2 text-4xl md:text-5xl">What we carry</h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <CategoryCard icon={Beer} title="Liquor & beer" desc="Spirits, wine, craft beer, seltzers. Cold cases restocked daily." />
            <CategoryCard icon={Coffee} title="Coffee & drinks" desc="Hot coffee, cold brew, juices, energy drinks, water." />
            <CategoryCard icon={Sandwich} title="Deli bites" desc="Fresh sandwiches, wraps, salads. Made in-store every morning." />
            <CategoryCard icon={UtensilsCrossed} title="Snacks" desc="Chips, candy, nuts, protein bars. Quick fuel for the day." />
            <CategoryCard icon={Clock} title="Essentials" desc="Toiletries, phone chargers, OTC medicine, cleaning supplies." />
            <CategoryCard icon={MapPin} title="Tobacco & accessories" desc="Cigarettes, cigars, lighters, rolling papers." />
          </div>
        </div>
      </section>

      {/* ── Hours ─────────────────────────────────────────────────────── */}
      <section id="hours" className="border-t border-white/10 bg-stone-950 px-6 py-20 md:px-16 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs uppercase tracking-[0.25em] text-amber-400/70">Open daily</div>
          <h2 className="serif mt-2 text-4xl md:text-5xl">Hours</h2>
          <div className="mt-8 space-y-3 text-lg">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-white/70">Monday – Saturday</span>
              <span className="font-medium">8 AM – 11 PM</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-white/70">Sunday</span>
              <span className="font-medium">9 AM – 10 PM</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-white/40">Hours may vary on holidays. Call ahead to confirm.</p>
        </div>
      </section>

      {/* ── Contact / Find us ─────────────────────────────────────────── */}
      <section id="contact" className="border-t border-white/10 px-6 py-20 md:px-16 md:py-28">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-amber-400/70">Visit</div>
            <h2 className="serif mt-2 text-4xl md:text-5xl">Find us</h2>
            <div className="mt-8 space-y-4 text-sm">
              <div className="flex items-center gap-3 text-white/80">
                <MapPin className="h-4 w-4 text-amber-400" />
                <span>Miami, FL</span>
              </div>
              <a href="mailto:fy@designsuitesmiami.com" className="flex items-center gap-3 text-white/80 hover:text-white">
                <Mail className="h-4 w-4 text-amber-400" />
                <span>fy@designsuitesmiami.com</span>
              </a>
            </div>
            <p className="mt-8 text-sm text-white/50">
              Located inside the Design Suites Miami building. Walk-in only — no delivery yet.
            </p>
          </div>
          <div className="grid h-64 place-items-center rounded-xl bg-stone-800 text-center text-sm text-white/40">
            Google Maps embed
            <br />
            <span className="text-xs">Coming in next update</span>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Atelier Liquor & Bites · Design Suites Miami Inc
      </footer>
    </main>
  );
}

function CategoryCard({ icon: Icon, title, desc }: { icon: typeof Beer; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-white/10 p-6 transition-colors hover:border-amber-400/30 hover:bg-amber-400/5">
      <Icon className="h-6 w-6 text-amber-400" />
      <h3 className="serif mt-3 text-xl">{title}</h3>
      <p className="mt-2 text-sm text-white/60">{desc}</p>
    </div>
  );
}
