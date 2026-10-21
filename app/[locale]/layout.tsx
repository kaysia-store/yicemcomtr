import { notFound } from "next/navigation";
import { Suspense } from "react";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { LoadingState } from "@/components/loading-state";
import { SetLang } from "@/components/menu/set-lang";
import { messagesFor } from "@/lib/messages";
import { localePattern } from "@/lib/validators";

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <Suspense fallback={<LoadingState />}>
      <LocaleShell params={params}>{children}</LocaleShell>
    </Suspense>
  );
}

async function LocaleShell({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!localePattern.test(locale)) notFound();
  setRequestLocale(locale);
  const messages = messagesFor(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SetLang locale={locale} />
      {children}
    </NextIntlClientProvider>
  );
}
