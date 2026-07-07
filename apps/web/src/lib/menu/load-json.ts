import "server-only";
import { parseAllJson } from "./parse-all-json";
import type { MenuData } from "./types";
import menuJson from "@/data/menu.json";

export async function loadMenuFromJson(): Promise<MenuData> {
  return parseAllJson(menuJson as Parameters<typeof parseAllJson>[0]);
}
