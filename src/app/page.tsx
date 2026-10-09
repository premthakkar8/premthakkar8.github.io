import Nav from "@/components/Nav";
import OceanExperience from "@/components/OceanExperience";
import Reveal from "@/components/Reveal";
import { ArrowUpRight, GitHubIcon, LinkedInIcon, MailIcon } from "@/components/icons";
import { about, alsoWorkedWith, exploring, moreProjects, profile, projects, skills } from "@/lib/content";

function SectionHeading({ zone, depth, title }: { zone: string; depth: string; title: string }) {
  return (
    <div data-reveal className="mb-12 sm:mb-16">
      <p className="font-mono text-[11px] tracking-[0.28em] text-glow uppercase">
        {zone} <span className="text-mist/60">· {depth}</span>
      </p>
      <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-foam sm:text-5xl">{title}</h2>
    </div>
  );
}

function Chip({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-[13px] ring-1 ${
        muted ? "text-mist ring-white/10" : "bg-glow/[0.06] text-foam/90 ring-glow/20"
      }`}
    >
      {children}
    </span>
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
            <p className="hero-in glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[11px] tracking-[0.2em] text-glow uppercase">
              <span className="pulse-dot size-1.5 rounded-full bg-aqua" />
              Open to internships &amp; freelance
            </p>
            <h1
              className="hero-in mt-7 font-display text-[clamp(3.2rem,9vw,7.5rem)] leading-[0.95] font-semibold tracking-[-0.035em] text-foam"
              style={{ animationDelay: "120ms" }}
            >
              Prem
              <br />
              <span className="text-gradient">Thakkar</span>
            </h1>
            <p
              className="hero-in mt-7 flex flex-wrap gap-x-3 gap-y-1 text-base text-mist sm:text-lg"
              style={{ animationDelay: "240ms" }}
            >
              {profile.roles.map((r, i) => (
                <span key={r} className="flex items-center gap-3">
                  {i > 0 && <span className="text-glow/60">/</span>}
                  {r}
                </span>
              ))}
            </p>
            <p className="hero-in mt-4 max-w-xl text-lg text-foam/80 sm:text-xl" style={{ animationDelay: "320ms" }}>
              {profile.tagline}
            </p>
            <div className="hero-in mt-10 flex flex-wrap gap-3" style={{ animationDelay: "420ms" }}>
              <a
                href="#work"
                className="rounded-xl bg-glow px-5 py-3 text-sm font-semibold text-abyss shadow-[0_0_40px_-8px_rgba(56,189,248,0.8)] transition hover:bg-aqua"
              >
                Explore my work
              </a>
              <a
                href="#contact"
                className="glass rounded-xl px-5 py-3 text-sm font-medium text-foam transition hover:border-glow/40"
              >
                Get in touch
              </a>
            </div>
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

        <section id="skills" data-depth="700" className="px-6 py-32 sm:py-40">
          <div className="mx-auto max-w-6xl">
            <SectionHeading zone="Twilight zone" depth="700 m" title="Toolkit" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((group) => (
                <div key={group.title} data-reveal className="glass card rounded-2xl p-6">
                  <h3 className="font-mono text-[11px] tracking-[0.2em] text-glow/80 uppercase">{group.title}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <Chip key={item}>{item}</Chip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div data-reveal className="mt-8 flex flex-col gap-4 text-sm sm:flex-row sm:gap-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-mist">Also worked with</span>
                {alsoWorkedWith.map((s) => (
                  <Chip key={s} muted>
                    {s}
                  </Chip>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-mist">Exploring</span>
                {exploring.map((s) => (
                  <Chip key={s} muted>
                    {s}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="work" data-depth="2000" className="px-6 py-32 sm:py-40">
          <div className="mx-auto max-w-6xl">
            <SectionHeading zone="Midnight zone" depth="2,000 m" title="Selected work" />
            <div className="space-y-5">
              {projects.map((p, i) => (
                <article
                  key={p.title}
                  data-reveal
                  className="glass card group grid gap-6 rounded-3xl p-7 sm:p-9 lg:grid-cols-[auto_1fr_auto] lg:gap-10"
                >
                  <span className="font-mono text-sm text-glow/70">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-2xl font-semibold tracking-tight text-foam sm:text-3xl">
                        {p.title}
                      </h3>
                      {p.status && (
                        <span className="rounded-full bg-aqua/10 px-2.5 py-0.5 font-mono text-[10px] tracking-[0.15em] text-aqua uppercase ring-1 ring-aqua/30">
                          {p.status}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 max-w-2xl text-foam/75">{p.summary}</p>
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
                  <div className="flex gap-2 lg:flex-col">
                    {p.links.map((l) => (
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
                </article>
              ))}
            </div>
            <div data-reveal className="mt-10 grid gap-4 sm:grid-cols-2">
              {moreProjects.map((p) => (
                <a
                  key={p.title}
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  className="glass card group flex items-start justify-between gap-4 rounded-2xl p-6"
                >
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foam">{p.title}</h3>
                    <p className="mt-1 text-sm text-mist">{p.summary}</p>
                  </div>
                  <ArrowUpRight className="mt-1 size-4 shrink-0 text-mist transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-glow" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" data-depth="4500" className="flex min-h-svh items-center px-6 py-32">
          <div className="mx-auto w-full max-w-6xl text-center">
            <div data-reveal>
              <p className="font-mono text-[11px] tracking-[0.28em] text-glow uppercase">
                The abyss <span className="text-mist/60">· 4,500 m</span>
              </p>
              <h2 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2.4rem,6vw,4.75rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-foam">
                Let&apos;s build something <span className="text-gradient">useful.</span>
              </h2>
              <p className="mx-auto mt-6 max-w-lg text-lg text-mist">
                Open to internships, freelance projects, and collaborations. The fastest way to reach me is email.
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
          <p>© {new Date().getFullYear()} Prem Thakkar</p>
          <a href="#top" className="font-mono text-xs tracking-[0.2em] uppercase transition hover:text-glow">
            Back to surface ↑
          </a>
        </div>
      </footer>
    </>
  );
}
