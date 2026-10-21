import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LoadingState } from "@/components/loading-state";
import { readPreview } from "@/lib/preview";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <HomeRedirect />
    </Suspense>
  );
}

async function HomeRedirect() {
  if (!getSupabaseEnv()) redirect(`/${readPreview().settings.defaultLocale}`);

  const supabase = await createClient();
  const { data } = await supabase.from("restaurant_settings").select("default_locale").eq("id", 1).maybeSingle();
  redirect(`/${data?.default_locale ?? "tr"}`);
  return null;
}
