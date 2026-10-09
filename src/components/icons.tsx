type IconProps = { className?: string };

export function GitHubIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a10.9 10.9 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12.04 2a9.93 9.93 0 0 0-8.5 15.06L2 22l5.07-1.5A9.94 9.94 0 1 0 12.04 2Zm0 18.13a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3 .89.9-2.93-.2-.31a8.2 8.2 0 1 1 6.78 3.68Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.16.25-.63.8-.78.97-.14.16-.29.18-.53.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.71-1.33.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.73 2.73 0 0 0-.85 2.03 4.74 4.74 0 0 0 1 2.52 10.86 10.86 0 0 0 4.16 3.67c1.55.67 2.16.73 2.93.61.47-.07 1.46-.6 1.66-1.17.21-.58.21-1.07.15-1.17-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AiCoderMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={className} fill="none">
      <line x1="20" y1="6" x2="20" y2="9.5" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
      <circle className="ai-antenna" cx="20" cy="4.5" r="2.2" fill="#5eead4" />
      <rect x="6.6" y="14.5" width="2.6" height="6" rx="1.3" fill="#38bdf8" />
      <rect x="30.8" y="14.5" width="2.6" height="6" rx="1.3" fill="#38bdf8" />
      <rect x="9" y="9.5" width="22" height="16" rx="6" fill="#06233b" stroke="#38bdf8" strokeWidth="1.8" />
      <g className="ai-eyes">
        <rect x="14" y="14.6" width="3.4" height="4.8" rx="1.7" fill="#5eead4" />
        <rect x="22.6" y="14.6" width="3.4" height="4.8" rx="1.7" fill="#5eead4" />
      </g>
      <rect x="10.5" y="23.5" width="19" height="9.5" rx="1.8" fill="#0b4d6b" stroke="#38bdf8" strokeWidth="1.6" />
      <path
        d="M17.6 26.3l-2 1.9 2 1.9M22.4 26.3l2 1.9-2 1.9M20.9 25.8l-1.8 4.8"
        stroke="#5eead4"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="5.5" y="33" width="29" height="2.8" rx="1.4" fill="#38bdf8" />
      <circle className="ai-hand-left" cx="12.5" cy="32.6" r="2.1" fill="#5eead4" />
      <circle className="ai-hand-right" cx="27.5" cy="32.6" r="2.1" fill="#5eead4" />
    </svg>
  );
}
