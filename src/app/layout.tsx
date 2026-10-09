import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"], weight: ["400", "600", "700"] });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prem Thakkar · Full-Stack Developer",
  description:
    "Computer Engineering student building full-stack web apps and Python/AI projects. Open to internships and freelance work.",
  openGraph: {
    title: "Prem Thakkar · Full-Stack Developer",
    description: "Full-stack web apps and Python/AI projects. Open to internships and freelance work.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} ${mono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
