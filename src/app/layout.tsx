import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-sans-devanagari",
  subsets: ["devanagari"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "VedicGPT — Vedic Knowledge, Philosophy & Life Guidance",
    template: "%s | VedicGPT",
  },
  description:
    "The world's most trustworthy AI for Vedic knowledge. Search the Bhagavad Gita with Sanskrit text, translations, and commentaries from multiple philosophical schools.",
  keywords: [
    "Bhagavad Gita",
    "Vedic Knowledge",
    "Sanskrit",
    "Hindu Philosophy",
    "Advaita",
    "Dvaita",
    "Karma Yoga",
    "Dharma",
    "Spiritual Guidance",
  ],
  authors: [{ name: "VedicGPT" }],
  openGraph: {
    title: "VedicGPT — Vedic Knowledge, Philosophy & Life Guidance",
    description:
      "Search the Bhagavad Gita with Sanskrit text, translations, and commentaries. Explore thousands of years of Vedic wisdom.",
    type: "website",
    locale: "en_US",
    siteName: "VedicGPT",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${notoDevanagari.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
