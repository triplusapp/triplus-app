import React, {ReactNode, useState} from 'react';
import i18n from "@/src/i18n/index";
import {getStorageItem, setStorageItem} from "@/src/asyncStorage";
import * as Localization from "expo-localization";
import LocalizationContext from "@/src/i18n/LocalizationContext";
import moment from "moment";
import 'moment/locale/ca';
import 'moment/locale/es';

export const APP_LANGUAGE = 'appLanguage';

// let DEFAULT_LANGUAGE = Localization.getLocales()[0].languageCode ?? 'ca';
// if (!i18n.availableLocales.includes(DEFAULT_LANGUAGE)) {
//     DEFAULT_LANGUAGE = 'ca';
// }
let DEFAULT_LANGUAGE = 'ca';

type LocalizationProviderProps = {
    children: ReactNode;
}

export const LocalizationProvider = ({children}: LocalizationProviderProps) => {
    const [appLanguage, setAppLanguage] = useState(DEFAULT_LANGUAGE);

    const setLanguage = (locale: string) => {
        moment.locale(locale);
        i18n.locale = locale;
        setStorageItem(APP_LANGUAGE, locale);
    };

    const initializeAppLanguage = async () => {
        setLanguage(DEFAULT_LANGUAGE);
        // const currentLanguage = await getStorageItem(APP_LANGUAGE);
        // if (currentLanguage) {
        //     setLanguage(currentLanguage);
        // } else {
        //     setLanguage(DEFAULT_LANGUAGE);
        // }
    };
    return (
        <LocalizationContext.Provider
            value={{
                i18n,
                setAppLanguage: setLanguage,
                appLanguage,
                initializeAppLanguage,
            }}>
            {children}
        </LocalizationContext.Provider>
    );
};
