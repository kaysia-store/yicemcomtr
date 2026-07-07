"use client";

import type { LangCode } from "@/lib/menu/types";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { tUi } from "@/lib/i18n/ui";

type Props = {
  lang: LangCode;
};

export default function HeroInstallButton({ lang }: Props) {
  const { canInstall, install } = usePwaInstall();

  if (!canInstall) return null;

  return (
    <button
      className="hero-download-btn"
      type="button"
      onClick={() => {
        void install();
      }}
    >
      <i className="fas fa-download" aria-hidden="true" />
      <span>{tUi(lang, "download")}</span>
    </button>
  );
}
