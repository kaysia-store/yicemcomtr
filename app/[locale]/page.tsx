import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { LoadingState } from "@/components/loading-state";
import { LoadError } from "@/components/load-error";
import { MenuBoard } from "@/components/menu/menu-board";
import { getPublicMenu } from "@/lib/menu";
import { place, placeDescription, placeJsonLd } from "@/lib/place";
import { localePattern } from "@/lib/validators";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!localePattern.test(locale)) return {};
  const result = await getPublicMenu(locale);
  const name = result.ok ? result.menu.restaurantName : "Yicem";
  return {
    title: { absolute: `${name} | ${place.district}, ${place.city}` },
    description: placeDescription(name, locale),
  };
}

export default function MenuPage({ params }: { params: Promise<{ locale: string }> }) {
  return (
    <Suspense fallback={<LoadingState label="Menü yükleniyor…" />}>
      <MenuContent params={params} />
    </Suspense>
  );
}

async function MenuContent({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!localePattern.test(locale)) notFound();
  setRequestLocale(locale);

  const result = await getPublicMenu(locale);
  if (!result.ok) {
    if (result.reason === "inactive") notFound();
    return <LoadError message={result.message} reason={result.reason} />;
  }

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeJsonLd(result.menu.restaurantName)).replaceAll("<", "\\u003c") }}
        type="application/ld+json"
      />
      <MenuBoard menu={result.menu} />
    </>
  );
}
