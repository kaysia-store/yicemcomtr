import { getRequestConfig } from "next-intl/server";
import { messagesFor } from "@/lib/messages";
import { localePattern } from "@/lib/validators";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = requested && localePattern.test(requested) ? requested : "tr";

  return {
    locale,
    messages: messagesFor(locale),
  };
});
