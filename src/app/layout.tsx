import type { Metadata } from "next";
import { JetBrains_Mono, Source_Serif_4, VT323 } from "next/font/google";
import "./globals.css";

const body = Source_Serif_4({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const display = VT323({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Engineer Roadmap Tracker",
  description:
    "Plan, track and complete the 24-week or accelerated 16-week journey to AI engineering.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${body.variable} ${mono.variable} ${display.variable}`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
