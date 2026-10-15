import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display" });
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Mind Cafe",
  description: "Anonymous, affordable psychiatric support by text, voice or video.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} bg-[#FAF8F3] font-[family-name:var(--font-body)] text-[#2F3837] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}