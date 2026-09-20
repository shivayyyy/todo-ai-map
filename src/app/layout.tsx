import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Source_Serif_4, VT323 } from "next/font/google";
import { PWARegister } from "@/components/pwa-register";
import { InstallPrompt } from "@/components/install-prompt";
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
    "Plan, track and complete the 16-24 week journey to AI engineering.",
  applicationName: "AI Roadmap",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AI Roadmap",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0d1a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${body.variable} ${mono.variable} ${display.variable}`}>
      <body className="flex min-h-full flex-col">
        {children}
        <PWARegister />
        <InstallPrompt />
      </body>
    </html>
  );
}
