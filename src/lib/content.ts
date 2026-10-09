export const profile = {
  name: "Prem Thakkar",
  roles: ["Computer Engineering Student", "Full-Stack Development", "Python & AI"],
  tagline: "I build practical web and AI products, from the API to the interface.",
  email: "premthakkar950@gmail.com",
  github: "https://github.com/premthakkar8",
  // Add your LinkedIn URL to show the LinkedIn link.
  linkedin: "",
};

export const about = {
  paragraphs: [
    "I'm a BTech Computer Engineering student who enjoys turning ideas into software people can actually use.",
    "I work across the stack: React interfaces, REST APIs in Node.js, Express and FastAPI, MongoDB data models, and Python for data and machine learning. I learn best by shipping complete projects end to end.",
  ],
  facts: [
    { label: "Studying", value: "BTech, Computer Engineering" },
    { label: "Focus", value: "Full-stack apps, backend APIs, applied ML" },
    { label: "Open to", value: "Internships, freelance, collaborations" },
  ],
};

export const skills = [
  { title: "Languages", items: ["Python", "JavaScript", "TypeScript", "HTML", "CSS"] },
  { title: "Frontend", items: ["React", "Tailwind CSS", "Bootstrap"] },
  { title: "Backend", items: ["Node.js", "Express", "FastAPI", "REST APIs", "JWT"] },
  { title: "Data & ML", items: ["scikit-learn", "pandas", "NumPy", "NLTK"] },
  { title: "Databases & services", items: ["MongoDB", "Mongoose", "Cloudinary"] },
  { title: "Tools & deployment", items: ["Git", "GitHub Actions", "GitHub Pages", "Netlify"] },
];

export const alsoWorkedWith = ["Java", "PHP", "Flask", "WordPress"];
export const exploring = ["Next.js", "Supabase", "Three.js"];

export type Project = {
  title: string;
  summary: string;
  highlights: string[];
  stack: string[];
  links: { label: string; href: string }[];
  status?: string;
};

export const projects: Project[] = [
  {
    title: "AI Fake News Detector",
    summary: "A news reader that pulls live articles and flags likely misinformation with a machine-learning model.",
    highlights: [
      "TF-IDF features and a class-balanced logistic regression model",
      "FastAPI endpoint returns a label, confidence, and plain-language explanation",
      "Low-confidence predictions are marked uncertain instead of forced",
    ],
    stack: ["Python", "FastAPI", "scikit-learn", "React", "TypeScript", "Tailwind"],
    links: [{ label: "Code", href: "https://github.com/premthakkar8/Fake-News-Detector" }],
  },
  {
    title: "Gold Intraday Research Bot",
    summary: "A scheduled Python engine that drafts gold trade plans, grades its own results, and adapts which strategies it trusts.",
    highlights: [
      "Scores five strategies from price action, the US dollar, oil, and headlines",
      "Self-grading memory with a five-day half-life",
      "Runs on GitHub Actions and publishes a live dashboard, with unit tests",
    ],
    stack: ["Python", "pandas", "NumPy", "GitHub Actions", "GitHub Pages"],
    links: [
      { label: "Code", href: "https://github.com/premthakkar8/gold-intraday-bot" },
      { label: "Live", href: "https://premthakkar8.github.io/gold-intraday-bot/" },
    ],
  },
  {
    title: "EcomLite",
    summary: "A single-store MERN e-commerce platform with a product API, Cloudinary image management, and PayU checkout.",
    highlights: [
      "Paginated catalogue with search and review-based ratings",
      "JWT-protected, admin-only product and image management",
      "bcrypt-hashed passwords and centralised error handling",
    ],
    stack: ["React", "Node.js", "Express", "MongoDB", "Cloudinary"],
    links: [
      { label: "Frontend", href: "https://github.com/premthakkar8/EcomLite-frontend" },
      { label: "Backend", href: "https://github.com/premthakkar8/EcomLite-backend" },
    ],
    status: "In progress",
  },
];

export const moreProjects = [
  {
    title: "DevX Solution",
    summary: "Website for an early-access AI code-review workspace.",
    href: "https://devxsolution.online",
  },
  {
    title: "Daily Briefing Bot",
    summary: "Async Python bot that sends weather, news, and stocks by email, Discord, or Slack.",
    href: "https://github.com/premthakkar8/daily-briefing-bot",
  },
];
