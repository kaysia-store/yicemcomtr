import { redirect, unstable_rethrow } from "next/navigation";
import { Suspense } from "react";
import { LoadingState } from "@/components/loading-state";
import { readPreview } from "@/lib/preview";
import { createPublicClient } from "@/lib/supabase/public";

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <HomeRedirect />
    </Suspense>
  );
}

async function HomeRedirect() {
  const supabase = createPublicClient();
  if (!supabase) redirect(`/${readPreview().settings.defaultLocale}`);

  try {
    const { data } = await supabase.from("restaurant_settings").select("default_locale").eq("id", 1).maybeSingle();
    redirect(`/${data?.default_locale ?? "tr"}`);
  } catch (error) {
    unstable_rethrow(error);
    redirect("/tr");
  }
  return null;
}
