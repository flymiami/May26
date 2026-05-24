import Link from "next/link";
import { Instagram, MapPin, Mail } from "lucide-react";

interface Work {
  title: string;
  medium: string;
  year: string;
  /** background tile style */
  art: React.ReactNode;
}

const WORKS: Work[] = [
  {
    title: "Untitled No. 1",
    medium: "Mixed media on canvas",
    year: "2024",
    art: (
      <svg viewBox="0 0 400 500" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c2d12" />
            <stop offset="55%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#fef3c7" />
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill="url(#g1)" />
        <path d="M 30 120 Q 200 60 380 180 T 360 380 Q 200 460 40 360 Z" fill="#000" opacity="0.35" />
        <circle cx="280" cy="140" r="70" fill="#fef3c7" opacity="0.8" />
        <path d="M 60 380 L 340 420 L 200 470 Z" fill="#1c1917" opacity="0.5" />
      </svg>
    ),
  },
  {
    title: "Florence Series I",
    medium: "Oil on linen",
    year: "2024",
    art: (
      <svg viewBox="0 0 400 500" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="g2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="40%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#7c2d12" />
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill="url(#g2)" />
        <rect x="50" y="320" width="80" height="180" fill="#1c1917" opacity="0.7" />
        <rect x="160" y="260" width="60" height="240" fill="#292524" opacity="0.6" />
        <rect x="240" y="290" width="100" height="210" fill="#1c1917" opacity="0.75" />
        <circle cx="320" cy="120" r="55" fill="#fef3c7" />
      </svg>
    ),
  },
  {
    title: "Miami Light",
    medium: "Acrylic on panel",
    year: "2024",
    art: (
      <svg viewBox="0 0 400 500" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="g3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="35%" stopColor="#f97316" />
            <stop offset="65%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0c4a6e" />
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill="url(#g3)" />
        <rect y="280" width="400" height="220" fill="#0c4a6e" opacity="0.6" />
        <rect y="280" width="400" height="3" fill="#fef3c7" opacity="0.6" />
      </svg>
    ),
  },
  {
    title: "Proud Love",
    medium: "Mixed media",
    year: "2024",
    art: (
      <svg viewBox="0 0 400 500" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="g4" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="40%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#581c87" />
          </radialGradient>
        </defs>
        <rect width="400" height="500" fill="url(#g4)" />
        <path d="M 200 150 C 150 100, 80 130, 100 200 S 200 320, 200 380 C 200 320, 300 250, 300 200 S 250 100, 200 150 Z" fill="#fb7185" opacity="0.9" />
        <path d="M 200 160 C 160 120, 110 140, 125 195 S 200 295, 200 350 C 200 295, 275 245, 275 195 S 240 120, 200 160 Z" fill="#fef3c7" opacity="0.6" />
      </svg>
    ),
  },
  {
    title: "Untitled No. 5",
    medium: "Oil on canvas",
    year: "2024",
    art: (
      <svg viewBox="0 0 400 500" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="500" fill="#0c0a09" />
        <path d="M 40 100 Q 200 200 360 80" stroke="#fef3c7" strokeWidth="20" fill="none" opacity="0.9" />
        <path d="M 30 200 Q 200 320 370 220" stroke="#dc2626" strokeWidth="18" fill="none" opacity="0.85" />
        <path d="M 60 320 Q 200 420 340 340" stroke="#fef3c7" strokeWidth="14" fill="none" opacity="0.7" />
        <circle cx="80" cy="430" r="40" fill="#dc2626" opacity="0.8" />
        <circle cx="320" cy="440" r="25" fill="#fef3c7" opacity="0.8" />
      </svg>
    ),
  },
  {
    title: "Studio Notes",
    medium: "Charcoal on paper",
    year: "2024",
    art: (
      <svg viewBox="0 0 400 500" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="500" fill="#f5f5f4" />
        <g stroke="#1c1917" strokeLinecap="round" fill="none">
          <path d="M 60 80 Q 200 40 340 90" strokeWidth="3" opacity="0.85" />
          <path d="M 80 140 Q 200 110 320 150" strokeWidth="2.5" opacity="0.7" />
          <path d="M 70 220 L 330 230" strokeWidth="2" opacity="0.6" />
          <path d="M 100 280 Q 200 320 300 285" strokeWidth="3" opacity="0.8" />
          <path d="M 50 360 Q 200 410 350 360" strokeWidth="4" opacity="0.9" />
          <circle cx="200" cy="180" r="50" strokeWidth="2.5" opacity="0.5" />
        </g>
      </svg>
    ),
  },
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
              <div className="aspect-[4/5] w-full overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]">
                {w.art}
              </div>
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
