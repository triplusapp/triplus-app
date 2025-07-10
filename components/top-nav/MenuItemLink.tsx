import React from 'react';
import {Pressable, Text} from "react-native";
import * as WebBrowser from "expo-web-browser";

interface MenuItemProps {
    text: string;
    href: any;
}

export default function MenuItemLink({text, href}: MenuItemProps) {
    const _handleButtonAsync = async () => {
        WebBrowser.openBrowserAsync(href);
    };

    return (
        <Pressable
            onPress={_handleButtonAsync}
            className="px-4 pr-10 py-2 active:bg-gray-100"
        >
            <Text className={'text-lg'}>{text}</Text>
        </Pressable>
    );
};
