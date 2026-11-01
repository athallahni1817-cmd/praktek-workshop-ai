import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--font-inter" });
const lora = Lora({ subsets: ["latin"], weight: "400", style: "italic", variable: "--font-lora" });

export const metadata: Metadata = {
  title: { default: "IPS One", template: "%s · IPS One" },
  description: "Platform operasional terintegrasi PT Indonesia Partner Solution",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${lora.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
