import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { themeInitScript } from "@/lib/theme/init-theme";
import PwaRegister from "@/components/pwa-register";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#e53935",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Yi'Cem Antalya - Pizza & Ayvalık Tost | Lezzetli Yemekler",
  description:
    "Yi'Cem Restoran Antalya - Taze malzemelerle hazırlanan özel tarifler. Pizza, Ayvalık Tostu, Döner ve daha fazlası.",
  metadataBase: new URL("https://yicem.com.tr"),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Yi'Cem",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
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
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={inter.variable}>
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
