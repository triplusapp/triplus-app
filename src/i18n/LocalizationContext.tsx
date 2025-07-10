import {createContext} from 'react';
import i18n from "@/src/i18n/index";

const LocalizationContext = createContext({
    i18n,
    setAppLanguage: (language: string) => {
    },
    appLanguage: i18n.locale,
    initializeAppLanguage: () => {
    },
});

export default LocalizationContext;

