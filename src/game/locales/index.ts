import { Locales } from "../enums";
import StateService from "../state";
import { KeyValuePair } from "../types";

import de from "./de.json";
import en from "./en.json";
import es from "./es.json";
import fr from "./fr.json";
import nl from "./nl.json";

const locales: KeyValuePair<KeyValuePair<string>> = {
  [Locales.En]: en,
  [Locales.De]: de,
  [Locales.Fr]: fr,
  [Locales.Nl]: nl,
  [Locales.Es]: es,
};

export default class LocaleService {
  static getText(key: string) {
    const locale = StateService.get().locale;
    return locales[locale]?.[key];
  }
}
