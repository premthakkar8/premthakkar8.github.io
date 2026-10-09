export const profile = {
  name: "Prem Thakkar",
  roles: ["AI Consultant", "Web Developer"],
  tagline: "I build fast, modern websites and practical AI solutions that help businesses grow.",
  email: "premthakkar950@gmail.com",
  github: "https://github.com/premthakkar8",
  phone: "+91 63533 13101",
  whatsapp: `https://wa.me/916353313101?text=${encodeURIComponent(
    "Hi Prem, I'd like to book an appointment to discuss a project.",
  )}`,
  // Add your LinkedIn URL to show the LinkedIn link.
  linkedin: "",
};

export const about = {
  paragraphs: [
    "I'm Prem Thakkar, an AI consultant and web developer. I help businesses get online with websites that look sharp, load fast, and turn visitors into enquiries.",
    "On the AI side, I find where automation and machine learning can save time or open new value, then build it: from data pipelines and models to tools a team actually uses.",
  ],
  facts: [
    { label: "What I do", value: "Business websites, web apps, AI solutions" },
    { label: "How I work", value: "Clear scope, fast delivery, direct communication" },
    { label: "Background", value: "BTech, Computer Engineering" },
  ],
};

export const services = [
  {
    title: "Web development",
    summary: "Responsive business websites and web apps, built to be fast, easy to update, and found on search.",
    points: ["Business and portfolio websites", "Landing pages and e-commerce", "Custom web applications"],
  },
  {
    title: "AI consulting",
    summary: "Practical AI for real workflows: I help you pick the right use case, then design and build it.",
    points: ["AI strategy and use-case discovery", "Automation and AI-powered tools", "Machine-learning models and data pipelines"],
  },
];

export const toolkit = [
  "Python",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "FastAPI",
  "MongoDB",
  "scikit-learn",
  "pandas",
  "Tailwind CSS",
  "Three.js",
  "GitHub Actions",
];

export type Project = {
  title: string;
  label: string;
  summary: string;
  highlights: string[];
  stack: string[];
  links: { label: string; href: string }[];
  status?: string;
};

export const clientWork: Project[] = [
  {
    title: "Eventor Events",
    label: "Client website",
    summary: "Website for Eventor, a wedding and event planner in Ahmedabad, built to showcase their work and bring in enquiries.",
    highlights: [
      "Services, gallery, and client testimonial sections",
      "Clear calls to action that lead visitors to get in touch",
      "Responsive layout, live on the client's own domain",
    ],
    stack: ["HTML", "CSS", "JavaScript", "SEO"],
    links: [{ label: "Visit site", href: "https://eventorevents.co.in" }],
  },
  {
    title: "DevX Solution",
    label: "Product website",
    summary: "Website for DevX, an early-access AI code-review workspace, explaining the product and collecting early-access requests.",
    highlights: [
      "Product story, sample review brief, and early-access flow",
      "Static build on Netlify with a custom domain",
    ],
    stack: ["HTML", "CSS", "JavaScript", "Netlify"],
    links: [{ label: "Visit site", href: "https://devxsolution.online" }],
  },
];

export const projects: Project[] = [
  {
    title: "AI Fake News Detector",
    label: "AI · Machine learning",
    summary: "A news reader that pulls live articles and flags likely misinformation with a machine-learning model.",
    highlights: [
      "TF-IDF features and a class-balanced logistic regression model",
      "FastAPI endpoint returns a label, confidence, and plain-language explanation",
    ],
    stack: ["Python", "FastAPI", "scikit-learn", "React", "TypeScript"],
    links: [{ label: "Code", href: "https://github.com/premthakkar8/Fake-News-Detector" }],
  },
  {
    title: "Gold Intraday Research Bot",
    label: "AI · Automation",
    summary: "A scheduled Python engine that drafts gold trade plans, grades its own results, and adapts which strategies it trusts.",
    highlights: [
      "Scores five strategies from price action, the US dollar, oil, and headlines",
      "Runs on GitHub Actions and publishes a live dashboard",
    ],
    stack: ["Python", "pandas", "GitHub Actions"],
    links: [
      { label: "Code", href: "https://github.com/premthakkar8/gold-intraday-bot" },
      { label: "Live", href: "https://premthakkar8.github.io/gold-intraday-bot/" },
    ],
  },
  {
    title: "EcomLite",
    label: "Web app · E-commerce",
    summary: "A single-store MERN e-commerce platform with a product API, admin tools, Cloudinary images, and PayU checkout.",
    highlights: [
      "JWT-protected admin product and image management",
      "Paginated catalogue with search and review-based ratings",
    ],
    stack: ["React", "Node.js", "Express", "MongoDB"],
    links: [
      { label: "Frontend", href: "https://github.com/premthakkar8/EcomLite-frontend" },
      { label: "Backend", href: "https://github.com/premthakkar8/EcomLite-backend" },
    ],
    status: "In progress",
  },
];
