import Link from "next/link";
import { Instagram, MapPin, Mail } from "lucide-react";

const WORKS = [
  { title: "Untitled No. 1", medium: "Mixed media on canvas", year: "2024", gradient: "from-orange-500 via-pink-500 to-purple-700" },
  { title: "Florence Series I", medium: "Oil on linen", year: "2024", gradient: "from-amber-300 via-rose-400 to-red-700" },
  { title: "Miami Light", medium: "Acrylic on panel", year: "2024", gradient: "from-sky-400 via-cyan-500 to-emerald-600" },
  { title: "Proud Love", medium: "Mixed media", year: "2024", gradient: "from-fuchsia-500 via-pink-600 to-rose-700" },
  { title: "Untitled No. 5", medium: "Oil on canvas", year: "2024", gradient: "from-slate-400 via-zinc-500 to-stone-700" },
  { title: "Studio Notes", medium: "Charcoal on paper", year: "2024", gradient: "from-neutral-300 via-stone-400 to-stone-700" },
];

export default function FlyMiamiArtPage() {
  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[88vh] flex-col justify-between px-6 py-10 md:px-16 md:py-16">
        <nav className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-white/70">
          <span>FLY Miami Art</span>
          <div className="hidden gap-8 sm:flex">
            <a href="#works" className="hover:text-white">Works</a>
            <a href="#about" className="hover:text-white">About</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </div>
        </nav>

        <div className="max-w-4xl">
          <h1 className="serif text-[15vw] leading-[0.9] sm:text-7xl md:text-[8rem] lg:text-[10rem]">
            FLY
            <br />
            Miami
            <br />
            <span className="italic text-white/70">Art.</span>
          </h1>
          <p className="serif mt-8 max-w-xl text-xl text-white/70 md:text-2xl">
            Original paintings and mixed-media works by{" "}
            <span className="italic">Facundo Yebne</span>. Studio in Miami,
            shown in Florence.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.25em] text-white/50">
          <span>Established 2024</span>
          <span className="hidden sm:inline">·</span>
          <a
            href="https://instagram.com/flymiami.art"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 hover:text-white"
          >
            <Instagram className="h-4 w-4" /> @flymiami.art
          </a>
        </div>
      </section>

      {/* ── Works ──────────────────────────────────────────────────────── */}
      <section id="works" className="border-t border-white/10 px-6 py-20 md:px-16 md:py-32">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-white/50">Selected</div>
            <h2 className="serif mt-2 text-5xl md:text-6xl">Works</h2>
          </div>
          <Link
            href="#contact"
            className="hidden text-xs uppercase tracking-[0.25em] text-white/70 hover:text-white sm:inline"
          >
            Inquire →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WORKS.map((w) => (
            <figure key={w.title} className="group cursor-pointer">
              <div
                className={`aspect-[4/5] w-full bg-gradient-to-br ${w.gradient} transition-transform duration-500 group-hover:scale-[1.02]`}
              />
              <figcaption className="mt-3 flex items-baseline justify-between text-sm">
                <span className="serif text-lg italic">{w.title}</span>
                <span className="text-xs uppercase tracking-wider text-white/50">
                  {w.year}
                </span>
              </figcaption>
              <div className="text-xs text-white/50">{w.medium}</div>
            </figure>
          ))}
        </div>

        <p className="mt-12 max-w-xl text-sm text-white/50">
          Placeholder images. Upload real artwork through the portal →{" "}
          <Link href="/entities/fly-miami-art" className="underline">
            Manage in portal
          </Link>
          .
        </p>
      </section>

      {/* ── About ──────────────────────────────────────────────────────── */}
      <section
        id="about"
        className="border-t border-white/10 px-6 py-20 md:px-16 md:py-32"
      >
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="text-xs uppercase tracking-[0.25em] text-white/50">
              The studio
            </div>
            <h2 className="serif mt-2 text-5xl md:text-6xl">About</h2>
          </div>
          <div className="space-y-6 md:col-span-7 md:col-start-6">
            <p className="serif text-2xl leading-snug text-white/90 md:text-3xl">
              FLY Miami Art is the studio practice of Facundo Yebne — paintings,
              works on paper, and mixed media that travel between Miami and
              Florence.
            </p>
            <p className="text-base text-white/70">
              Each piece is original and signed. The studio takes on a small
              number of private commissions every year — message through the
              form below or reach out on Instagram.
            </p>
          </div>
        </div>
      </section>

      {/* ── Instagram CTA ─────────────────────────────────────────────── */}
      <section className="border-t border-white/10 px-6 py-20 md:px-16 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <Instagram className="mx-auto h-8 w-8 text-white/50" />
          <h2 className="serif mt-6 text-4xl md:text-5xl">
            Follow the work as it happens.
          </h2>
          <p className="mt-4 text-white/70">
            New pieces, studio progress and exhibition notes.
          </p>
          <a
            href="https://instagram.com/flymiami.art"
            target="_blank"
            rel="noreferrer noopener"
            className="mt-8 inline-flex items-center gap-2 border border-white/30 px-6 py-3 text-xs uppercase tracking-[0.25em] transition-colors hover:bg-white hover:text-black"
          >
            @flymiami.art on Instagram
          </a>
        </div>
      </section>

      {/* ── Contact ───────────────────────────────────────────────────── */}
      <section
        id="contact"
        className="border-t border-white/10 px-6 py-20 md:px-16 md:py-32"
      >
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="text-xs uppercase tracking-[0.25em] text-white/50">
              Inquiries
            </div>
            <h2 className="serif mt-2 text-5xl md:text-6xl">Contact</h2>
            <p className="mt-6 max-w-md text-white/70">
              Purchases, commissions, gallery enquiries — write directly.
            </p>
            <div className="mt-8 space-y-3 text-sm">
              <a
                href="mailto:fy@designsuitesmiami.com"
                className="inline-flex items-center gap-3 text-white/80 hover:text-white"
              >
                <Mail className="h-4 w-4" /> fy@designsuitesmiami.com
              </a>
              <div className="inline-flex items-center gap-3 text-white/80">
                <MapPin className="h-4 w-4" /> Miami, FL · Florence, Italy
              </div>
            </div>
          </div>
          <form className="space-y-4 md:col-span-6 md:col-start-7">
            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                className="mt-2 w-full border-b border-white/30 bg-transparent py-2 text-base outline-none focus:border-white"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="mt-2 w-full border-b border-white/30 bg-transparent py-2 text-base outline-none focus:border-white"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                Message
              </label>
              <textarea
                name="message"
                rows={4}
                required
                className="mt-2 w-full resize-none border-b border-white/30 bg-transparent py-2 text-base outline-none focus:border-white"
              />
            </div>
            <button
              type="submit"
              className="mt-4 border border-white px-6 py-3 text-xs uppercase tracking-[0.25em] transition-colors hover:bg-white hover:text-black"
            >
              Send inquiry
            </button>
            <p className="text-[11px] text-white/40">
              Submissions will be wired to email in the next step.
            </p>
          </form>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 px-6 py-10 text-xs uppercase tracking-[0.25em] text-white/40 md:px-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} FLY Miami Art</span>
          <span>A FLY Future LLC studio</span>
        </div>
      </footer>
    </main>
  );
}
