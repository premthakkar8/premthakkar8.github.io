"use client";

import { useEffect, useRef } from "react";
import { profile } from "@/lib/content";
import { AiCoderMark, GitHubIcon } from "./icons";

const links = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => header.current?.classList.toggle("nav-scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header ref={header} className="fixed inset-x-0 top-0 z-30 px-4 pt-4 sm:px-6">
      <div aria-hidden className="nav-veil" />
      <div className="nav-bar relative mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-transparent px-4 py-3 transition-all duration-500 sm:px-5">
        <a href="#top" className="flex items-center gap-3 text-foam" aria-label="Back to top">
          <AiCoderMark className="size-9" />
          <span className="font-display text-lg font-semibold tracking-tight">Prem Thakkar</span>
        </a>
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hidden rounded-lg px-3.5 py-2 text-base font-medium text-foam/75 transition-colors hover:text-foam md:inline-block"
            >
              {l.label}
            </a>
          ))}
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
            className="ml-1 grid size-10 place-items-center rounded-lg text-foam/75 transition-colors hover:bg-white/5 hover:text-foam"
          >
            <GitHubIcon className="size-5" />
          </a>
          <a
            href="#contact"
            className="rounded-lg bg-glow/10 px-4 py-2 text-base font-medium text-glow ring-1 ring-glow/30 transition-colors hover:bg-glow/20 md:hidden"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
