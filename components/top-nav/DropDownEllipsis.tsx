import React from "react";
import {Pressable, Text, View} from "react-native";
import MenuItem from "@/components/top-nav/MenuItem";
import MenuItemLink from "@/components/top-nav/MenuItemLink";
import Divider from "@/components/top-nav/Divider";
import Toast from "react-native-root-toast";
import i18n from "@/src/i18n";
import {useClickOutside} from "react-native-click-outside";
import {useMenu} from "@/src/menu/hooks/useMenu";

export default function DropDownEllipsis() {
    const {showEllipsisMenu, setShowEllipsisMenu} = useMenu();
    const ref = useClickOutside<View>(() => setShowEllipsisMenu(false));

    if (!showEllipsisMenu) {
        return null;
    }

    return (
        <View
            ref={ref}
            className="absolute mr-5 w-auto bg-white shadow shadow-gray-300 rounded-xl z-50"
            style={{top: 85, right: 0}}
        >
            <MenuItem text={i18n.t('settings_dropdown.what_is_triplus')} href="QueEsContent"/>
            <Divider/>
            <MenuItem text={i18n.t('settings_dropdown.triplus_stamp')} href="SegellContent"/>
            <Divider/>
            <MenuItem text={'FAQ'} href="Faqs"/>
            <Divider/>
            <MenuItem text={i18n.t('settings_dropdown.donate')} href="DonateContent"/>
            <Divider/>
            <MenuItem text={i18n.t('settings_dropdown.contact')} href="Contact"/>
            <Divider/>
            <MenuItem text={i18n.t('settings_dropdown.legal')} href="LegalContent"/>
        </View>
    );
};
