import ar from "../messages/ar.json";
import de from "../messages/de.json";
import en from "../messages/en.json";
import fr from "../messages/fr.json";
import ru from "../messages/ru.json";
import tr from "../messages/tr.json";

const catalogs = { ar, de, en, fr, ru, tr };

export function messagesFor(locale: string) {
  return catalogs[locale as keyof typeof catalogs] ?? tr;
}
