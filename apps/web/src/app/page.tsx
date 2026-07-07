import MenuPage from "@/components/menu-page";
import { getMenu } from "@/lib/menu/get-menu";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Home() {
  const menu = await getMenu();
  return <MenuPage menu={menu} />;
}
