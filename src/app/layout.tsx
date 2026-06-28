import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pulkit Arora | Backend & Full-Stack Developer",
  description: "Portfolio of Pulkit Arora - Java Backend and Full-Stack Developer building production-grade systems with Spring Boot, WebSockets, and Redis.",
  keywords: ["Pulkit Arora", "Backend Developer", "Java Developer", "Spring Boot", "Software Engineer", "Full Stack Developer", "WebSockets", "Redis"],
  authors: [{ name: "Pulkit Arora" }],
  openGraph: {
    title: "Pulkit Arora | Backend & Full-Stack Developer",
    description: "Portfolio of Pulkit Arora - Java Backend and Full-Stack Developer building production-grade systems.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${plusJakartaSans.variable}`}>
      <body style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
