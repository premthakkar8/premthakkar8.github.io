import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"], weight: ["400", "600", "700"] });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prem Thakkar · AI Consultant & Web Developer",
  description:
    "Prem Thakkar builds fast, modern websites and practical AI solutions for businesses. See client work like Eventor Events.",
  openGraph: {
    title: "Prem Thakkar · AI Consultant & Web Developer",
    description: "Fast, modern websites and practical AI solutions for businesses.",
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
