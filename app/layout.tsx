import type { Metadata, Viewport } from "next";
import { Fraunces, Noto_Sans, Noto_Sans_Arabic, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-outfit",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  display: "swap",
});

const noto = Noto_Sans({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-noto",
  display: "swap",
});

const arabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#e53935",
};

export const metadata: Metadata = {
  title: {
    default: "QR Menü",
    template: "%s · QR Menü",
  },
  description: "Restoranlar için mobil QR menü",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${outfit.variable} ${fraunces.variable} ${noto.variable} ${arabic.variable} h-full antialiased`} lang="tr">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
