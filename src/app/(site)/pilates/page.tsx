import type { Metadata } from "next";
import Link from "next/link";
import { Instagram, MapPin, Mail, Phone, Clock, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "FLY Pilates Miami — Reformer Pilates Studio",
  description:
    "Be the good energy you want to attract. Reformer Pilates in Miami. Classes for all levels.",
};

export default function PilatesMiamiPage() {
  return (
    <main className="bg-white text-stone-900">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[80vh] flex-col justify-between bg-gradient-to-br from-teal-50 via-white to-emerald-50 px-6 py-10 md:px-16 md:py-16">
        <nav className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-stone-400">
          <span className="font-medium text-stone-900">FLY Pilates Miami</span>
          <div className="hidden gap-8 sm:flex">
            <a href="#classes" className="hover:text-stone-900">Classes</a>
            <a href="#about" className="hover:text-stone-900">About</a>
            <a href="#contact" className="hover:text-stone-900">Contact</a>
          </div>
        </nav>

        <div className="mx-auto max-w-3xl text-center">
          <div className="text-xs uppercase tracking-[0.25em] text-teal-600">Reformer Pilates · Miami</div>
          <h1 className="serif mt-4 text-5xl leading-tight sm:text-6xl md:text-7xl lg:text-8xl">
            Be the good energy
            <br />
            <span className="italic text-teal-600">you want to attract.</span>
          </h1>
          <p className="mt-6 text-lg text-stone-500 md:text-xl">
            Small group reformer classes for every level. Come fly with us.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#contact"
              className="border border-stone-900 bg-stone-900 px-8 py-3 text-xs uppercase tracking-[0.25em] text-white transition-colors hover:bg-stone-700"
            >
              Book a class
            </a>
            <a
              href="https://instagram.com/flypilatesmiami"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 border border-stone-300 px-6 py-3 text-xs uppercase tracking-[0.25em] text-stone-600 transition-colors hover:border-stone-900 hover:text-stone-900"
            >
              <Instagram className="h-4 w-4" /> @flypilatesmiami
            </a>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-stone-400">
            <span className="inline-flex items-center gap-1.5"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 4,800+ followers</span>
            <span>·</span>
            <span>1,900+ Google impressions / month</span>
          </div>
        </div>

        <div className="hidden" />
      </section>

      {/* ── Classes ───────────────────────────────────────────────────── */}
      <section id="classes" className="border-t border-stone-200 px-6 py-20 md:px-16 md:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.25em] text-teal-600">What we offer</div>
            <h2 className="serif mt-2 text-4xl md:text-5xl">Classes</h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ClassCard title="Intro Reformer" level="Beginner" duration="50 min" desc="Learn the basics. Posture, breath, and the first twelve movements." />
            <ClassCard title="Flow Reformer" level="Intermediate" duration="50 min" desc="Full-body sculpt with transitions. Springs, straps and core work." />
            <ClassCard title="Power Reformer" level="Advanced" duration="55 min" desc="High intensity. Jump board, cardio intervals, and deep stretch." />
            <ClassCard title="Private Session" level="All levels" duration="55 min" desc="One-on-one with an instructor. Tailored to your goals and body." />
            <ClassCard title="Duet Session" level="All levels" duration="55 min" desc="Bring a friend. Semi-private attention at a better price point." />
            <ClassCard title="Prenatal Reformer" level="All levels" duration="45 min" desc="Safe, supportive movement for every trimester. Doctor approval needed." />
          </div>
        </div>
      </section>

      {/* ── About ─────────────────────────────────────────────────────── */}
      <section id="about" className="border-t border-stone-200 bg-stone-50 px-6 py-20 md:px-16 md:py-28">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-teal-600">The studio</div>
            <h2 className="serif mt-2 text-4xl md:text-5xl">About</h2>
            <p className="mt-6 text-base leading-relaxed text-stone-600">
              FLY Pilates Miami is a reformer-only studio in the heart of Miami.
              Small classes (max 8 reformers) so every student gets real
              attention. Whether you've never touched a reformer or you're a
              daily practitioner, we meet you where you are.
            </p>
            <p className="mt-4 text-base leading-relaxed text-stone-600">
              Our instructors are certified and passionate. The space is clean,
              bright and welcoming. Come fly with us.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="grid h-72 w-full place-items-center rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 text-center text-sm text-teal-700">
              Studio photo
              <br />
              <span className="text-xs text-teal-500">Upload via portal</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ───────────────────────────────────────────────────── */}
      <section id="contact" className="border-t border-stone-200 px-6 py-20 md:px-16 md:py-28">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-teal-600">Get in touch</div>
            <h2 className="serif mt-2 text-4xl md:text-5xl">Contact</h2>
            <div className="mt-8 space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-teal-600" />
                <span>Miami, FL</span>
              </div>
              <a href="mailto:fy@designsuitesmiami.com" className="flex items-center gap-3 hover:text-teal-700">
                <Mail className="h-4 w-4 text-teal-600" />
                <span>fy@designsuitesmiami.com</span>
              </a>
              <a href="https://instagram.com/flypilatesmiami" target="_blank" rel="noreferrer noopener" className="flex items-center gap-3 hover:text-teal-700">
                <Instagram className="h-4 w-4 text-teal-600" />
                <span>@flypilatesmiami</span>
              </a>
            </div>
          </div>
          <form className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-stone-400">Name</label>
              <input type="text" name="name" required className="mt-2 w-full border-b border-stone-300 bg-transparent py-2 text-base outline-none focus:border-teal-600" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-stone-400">Email</label>
              <input type="email" name="email" required className="mt-2 w-full border-b border-stone-300 bg-transparent py-2 text-base outline-none focus:border-teal-600" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.25em] text-stone-400">Message</label>
              <textarea name="message" rows={3} required className="mt-2 w-full resize-none border-b border-stone-300 bg-transparent py-2 text-base outline-none focus:border-teal-600" />
            </div>
            <button type="submit" className="mt-4 border border-stone-900 bg-stone-900 px-6 py-3 text-xs uppercase tracking-[0.25em] text-white transition-colors hover:bg-stone-700">
              Send message
            </button>
          </form>
        </div>
      </section>

      <footer className="border-t border-stone-200 bg-stone-50 px-6 py-8 text-center text-xs text-stone-400">
        © {new Date().getFullYear()} FLY Pilates Miami · Pilates Miami LLC
      </footer>
    </main>
  );
}

function ClassCard({ title, level, duration, desc }: { title: string; level: string; duration: string; desc: string }) {
  return (
    <div className="rounded-xl border border-stone-200 p-6 transition-colors hover:border-teal-300 hover:bg-teal-50/30">
      <h3 className="serif text-xl">{title}</h3>
      <div className="mt-1 flex items-center gap-2 text-xs text-stone-400">
        <span>{level}</span>
        <span>·</span>
        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{duration}</span>
      </div>
      <p className="mt-3 text-sm text-stone-600">{desc}</p>
    </div>
  );
}
