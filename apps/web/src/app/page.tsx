import MenuPage from "@/components/menu-page";
import { getMenu } from "@/lib/menu/get-menu";

export default async function Home() {
  const menu = await getMenu();
  return <MenuPage menu={menu} />;
}
