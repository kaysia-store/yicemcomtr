import { revalidatePath } from "next/cache";

export function revalidateMenu() {
  revalidatePath("/", "layout");
}
