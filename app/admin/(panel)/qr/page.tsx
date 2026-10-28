import { Suspense } from "react";
import QRCode from "qrcode";
import { CopyButton } from "@/components/admin/copy-button";
import { LoadError } from "@/components/load-error";
import { LoadingState } from "@/components/loading-state";
import { PageHeader } from "@/components/page-header";
import { getDashboard } from "@/lib/admin-data";
import { getSiteUrl } from "@/lib/supabase/env";

export const metadata = { title: "QR" };

export default function QrPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <QrContent />
    </Suspense>
  );
}

async function QrContent() {
  const result = await getDashboard();
  if (!result.ok) return <LoadError message={result.message} reason={result.reason} />;

  const configured = getSiteUrl();
  const site =
    configured && !/localhost|127\.0\.0\.1/i.test(configured)
      ? configured
      : "https://yicem.com.tr";

  const url = `${site}/${result.defaultLocale}`;
  const dataUrl = await QRCode.toDataURL(url, {
    width: 640,
    margin: 1,
    color: { dark: "#111111", light: "#ffffff" },
  });

  return (
    <div>
      <PageHeader description="Bu kodu masalara bırakın. Okutulunca dijital menü açılır." title="QR" />
      <div className="grid max-w-sm gap-4 rounded-3xl border border-line bg-card p-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={`${result.name} menü QR kodu`} className="w-full rounded-2xl" height={320} src={dataUrl} width={320} />
        <p className="break-all text-sm text-muted">{url}</p>
        <div className="flex flex-wrap gap-2">
          <a className="btn btn-primary" download="qr-menu.png" href={dataUrl}>
            PNG indir
          </a>
          <CopyButton value={url} />
        </div>
      </div>
    </div>
  );
}
