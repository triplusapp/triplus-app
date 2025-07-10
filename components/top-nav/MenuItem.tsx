import React from 'react';
import {useNavigation} from "@react-navigation/native";
import {Pressable, Text} from "react-native";
import {RootStackParamList, StackNavigation} from "@/src/navigation";

interface MenuItemProps {
    text: string;
    href: any;
}

export default function MenuItem({text, href}: MenuItemProps) {
    const navigation = useNavigation<StackNavigation>();

    return (
        <Pressable
            onPress={() => navigation.navigate(href)}
            className="px-4 pr-10 py-2 active:bg-gray-100"
        >
            <Text className={'text-lg'}>{text}</Text>
        </Pressable>
    );
};
