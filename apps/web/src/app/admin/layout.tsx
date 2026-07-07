import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AdminShell from "@/components/admin/admin-shell";
import "./admin.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-admin-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Admin — Yi'Cem",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.variable} admin-root`}>
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
