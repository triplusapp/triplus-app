import * as Localization from 'expo-localization';
import { I18n } from "i18n-js";

import caTranslations from "./translations/ca.json";
import esTranslations from "./translations/es.json";


const defaultLocale = 'ca'; // @todo set to 'es'

const availableLocales = ['ca', 'es'];

let userDeviceLocaleWithFallback = Localization.getLocales()[0].languageCode ?? defaultLocale;
if (!availableLocales.includes(userDeviceLocaleWithFallback)) {
    userDeviceLocaleWithFallback = defaultLocale;
}

const i18n: I18n = new I18n({
    es: esTranslations,
    ca: caTranslations,
});

i18n.locale = userDeviceLocaleWithFallback;
i18n.defaultLocale = defaultLocale;
i18n.enableFallback = true;
i18n.availableLocales = availableLocales;

export default i18n;
