import * as React from "react";
import LocalizationContext from "@/src/i18n/LocalizationContext";

export default function useLocalization() {
    return React.useContext(LocalizationContext);
}
