import Nav from "@/components/Nav";
import OceanExperience from "@/components/OceanExperience";
import Reveal from "@/components/Reveal";
import { ArrowUpRight, GitHubIcon, LinkedInIcon, MailIcon } from "@/components/icons";
import { about, clientWork, profile, projects, services, toolkit, type Project } from "@/lib/content";

function SectionHeading({ zone, depth, title }: { zone: string; depth: string; title: string }) {
  return (
    <div data-reveal className="mb-12 sm:mb-16">
      <p className="font-mono text-xs tracking-[0.28em] text-glow uppercase">
        {zone} <span className="text-mist/60">· {depth}</span>
      </p>
      <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-foam sm:text-5xl">{title}</h2>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-glow/[0.06] px-3 py-1 text-[13px] text-foam/90 ring-1 ring-glow/20">{children}</span>;
}

function ProjectLinks({ links }: { links: Project["links"] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-foam ring-1 ring-white/10 transition hover:bg-glow/10 hover:text-glow hover:ring-glow/40"
        >
          {l.label}
          <ArrowUpRight className="size-3.5" />
        </a>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <OceanExperience />
      <Nav />
      <Reveal />

      <main id="top" className="relative z-10">
        <section data-depth="0" className="flex min-h-svh items-center px-6 pt-24 pb-16">
          <div className="mx-auto w-full max-w-6xl">
            <p className="hero-in font-mono text-xs tracking-[0.3em] text-glow uppercase sm:text-sm">
              {profile.roles.join("  ·  ")}
            </p>
            <h1
              className="hero-in mt-6 font-display text-[clamp(3.2rem,9vw,7.5rem)] leading-[0.95] font-semibold tracking-[-0.035em] text-foam"
              style={{ animationDelay: "120ms" }}
            >
              Prem
              <br />
              <span className="text-gradient">Thakkar</span>
            </h1>
            <p className="hero-in mt-7 max-w-xl text-lg text-foam/80 sm:text-xl" style={{ animationDelay: "260ms" }}>
              {profile.tagline}
            </p>
            <div className="hero-in mt-10 flex flex-wrap gap-3" style={{ animationDelay: "380ms" }}>
              <a
                href="#work"
                className="rounded-xl bg-glow px-5 py-3 text-sm font-semibold text-abyss shadow-[0_0_40px_-8px_rgba(56,189,248,0.8)] transition hover:bg-aqua"
              >
                View my work
              </a>
              <a
                href="#contact"
                className="glass rounded-xl px-5 py-3 text-sm font-medium text-foam transition hover:border-glow/40"
              >
                Start a project
              </a>
            </div>
            <a
              href={clientWork[0].links[0].href}
              target="_blank"
              rel="noreferrer"
              className="hero-in group mt-8 inline-flex items-center gap-2 text-sm text-mist transition hover:text-foam"
              style={{ animationDelay: "480ms" }}
            >
              <span className="font-mono text-[11px] tracking-[0.2em] text-glow/80 uppercase">Latest launch</span>
              {clientWork[0].title}
              <ArrowUpRight className="size-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
          <a
            href="#about"
            className="scroll-cue absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 font-mono text-[10px] tracking-[0.3em] text-mist uppercase"
          >
            Dive in
            <span className="relative block h-10 w-px overflow-hidden bg-white/10">
              <span className="scroll-cue-line absolute inset-x-0 top-0 h-4 bg-glow" />
            </span>
          </a>
        </section>

        <section id="about" data-depth="150" className="px-6 py-32 sm:py-40">
          <div className="mx-auto max-w-6xl">
            <SectionHeading zone="Sunlight zone" depth="150 m" title="About" />
            <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
              <div data-reveal className="space-y-5 text-lg leading-relaxed text-foam/80 sm:text-xl">
                {about.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <dl data-reveal className="glass divide-y divide-white/5 rounded-2xl p-2">
                {about.facts.map((f) => (
                  <div key={f.label} className="px-5 py-4">
                    <dt className="font-mono text-[11px] tracking-[0.2em] text-glow/80 uppercase">{f.label}</dt>
                    <dd className="mt-1.5 text-foam">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section id="services" data-depth="700" className="px-6 py-32 sm:py-40">
          <div className="mx-auto max-w-6xl">
            <SectionHeading zone="Twilight zone" depth="700 m" title="Services" />
            <div className="grid gap-5 md:grid-cols-2">
              {services.map((s, i) => (
                <article key={s.title} data-reveal className="glass card rounded-3xl p-8 sm:p-10">
                  <span className="font-mono text-sm text-glow/70">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-foam sm:text-3xl">{s.title}</h3>
                  <p className="mt-3 text-foam/75">{s.summary}</p>
                  <ul className="mt-6 space-y-2.5 text-[15px] text-mist">
                    {s.points.map((p) => (
                      <li key={p} className="flex gap-3">
                        <span className="mt-[9px] size-1 shrink-0 rounded-full bg-glow" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <div data-reveal className="mt-10">
              <p className="font-mono text-[11px] tracking-[0.2em] text-glow/80 uppercase">Toolkit</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {toolkit.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="work" data-depth="2000" className="px-6 py-32 sm:py-40">
          <div className="mx-auto max-w-6xl">
            <SectionHeading zone="Midnight zone" depth="2,000 m" title="Selected work" />
            <div className="space-y-5">
              {clientWork.map((p) => (
                <article
                  key={p.title}
                  data-reveal
                  className="glass card grid gap-6 rounded-3xl p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:gap-10"
                >
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.2em] text-aqua uppercase">{p.label}</p>
                    <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foam sm:text-4xl">
                      {p.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-lg text-foam/75">{p.summary}</p>
                    <ul className="mt-5 space-y-2 text-[15px] text-mist">
                      {p.highlights.map((h) => (
                        <li key={h} className="flex gap-3">
                          <span className="mt-[9px] size-1 shrink-0 rounded-full bg-glow" />
                          {h}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {p.stack.map((s) => (
                        <Chip key={s}>{s}</Chip>
                      ))}
                    </div>
                  </div>
                  <div className="lg:pt-1">
                    <ProjectLinks links={p.links} />
                  </div>
                </article>
              ))}
            </div>

            <h3 data-reveal className="mt-20 font-mono text-xs tracking-[0.28em] text-glow uppercase">
              Projects &amp; experiments
            </h3>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {projects.map((p) => (
                <article key={p.title} data-reveal className="glass card flex flex-col rounded-2xl p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-mono text-[10px] tracking-[0.18em] text-glow/80 uppercase">{p.label}</p>
                    {p.status && (
                      <span className="rounded-full bg-aqua/10 px-2 py-0.5 font-mono text-[9px] tracking-[0.15em] text-aqua uppercase ring-1 ring-aqua/30">
                        {p.status}
                      </span>
                    )}
                  </div>
                  <h4 className="mt-3 font-display text-xl font-semibold text-foam">{p.title}</h4>
                  <p className="mt-2 text-sm text-mist">{p.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.stack.map((s) => (
                      <span key={s} className="text-xs text-foam/60">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto pt-5">
                    <ProjectLinks links={p.links} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" data-depth="4500" className="flex min-h-svh items-center px-6 py-32">
          <div className="mx-auto w-full max-w-6xl text-center">
            <div data-reveal>
              <p className="font-mono text-xs tracking-[0.28em] text-glow uppercase">
                The abyss <span className="text-mist/60">· 4,500 m</span>
              </p>
              <h2 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2.4rem,6vw,4.75rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-foam">
                Have a project in <span className="text-gradient">mind?</span>
              </h2>
              <p className="mx-auto mt-6 max-w-lg text-lg text-mist">
                A new website, an AI tool, or advice on where to start. Send a few lines about your business and what you
                need.
              </p>
              <a
                href={`mailto:${profile.email}`}
                className="mt-10 inline-block font-display text-xl text-foam underline decoration-glow/40 underline-offset-8 transition hover:text-glow hover:decoration-glow sm:text-3xl"
              >
                {profile.email}
              </a>
              <div className="mt-10 flex justify-center gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  aria-label="Email"
                  className="glass grid size-12 place-items-center rounded-xl text-foam transition hover:text-glow"
                >
                  <MailIcon className="size-5" />
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="glass grid size-12 place-items-center rounded-xl text-foam transition hover:text-glow"
                >
                  <GitHubIcon className="size-5" />
                </a>
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="glass grid size-12 place-items-center rounded-xl text-foam transition hover:text-glow"
                  >
                    <LinkedInIcon className="size-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 px-6 pb-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-sm text-mist sm:flex-row">
          <p>© {new Date().getFullYear()} Prem Thakkar · AI Consultant &amp; Web Developer</p>
          <a href="#top" className="font-mono text-xs tracking-[0.2em] uppercase transition hover:text-glow">
            Back to surface ↑
          </a>
        </div>
      </footer>
    </>
  );
}
