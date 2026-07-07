import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { themeInitScript } from "@/lib/theme/init-theme";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Yi'Cem Antalya - Pizza & Ayvalık Tost | Lezzetli Yemekler",
  description:
    "Yi'Cem Restoran Antalya - Taze malzemelerle hazırlanan özel tarifler. Pizza, Ayvalık Tostu, Döner ve daha fazlası.",
  metadataBase: new URL("https://yicem.com.tr"),
  openGraph: {
    title: "Yi'Cem Antalya - Pizza & Ayvalık Tost",
    description: "Taze malzemelerle hazırlanan özel tarifler. Hemen sipariş ver!",
    url: "https://yicem.com.tr",
    siteName: "Yi'Cem Restoran",
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" data-lang="tr" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
