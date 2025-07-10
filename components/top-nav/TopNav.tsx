import {Pressable, Text, View} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import {useMenu} from "@/src/menu/hooks/useMenu";
import UserIcon from "@/components/svgs/userIcon";
import BellIcon from "@/components/svgs/bellIcon";
import brandColors from "@/assets/colors";
import {useAuth} from "@/src/auth";
import {useNavigation} from "@react-navigation/native";
import {StackNavigation} from "@/src/navigation";
import Level1Icon from "@/components/svgs/levels/level1Icon";
import Level2Icon from "@/components/svgs/levels/level2Icon";
import Level3Icon from "@/components/svgs/levels/level3Icon";
import Level4Icon from "@/components/svgs/levels/level4Icon";
import Level5Icon from "@/components/svgs/levels/level5Icon";
import React from "react";

export default function TopNav() {
    const {toggleUserMenu, toggleEllipsisMenu} = useMenu();
    const {currentUser} = useAuth()
    const navigation = useNavigation<StackNavigation>();
    const levelIcons = [
        (<Level1Icon width={20} height={20} />),
        (<Level2Icon width={20} height={20} />),
        (<Level3Icon width={20} height={20} />),
        (<Level4Icon width={20} height={20} />),
        (<Level5Icon width={20} height={20} />),
    ];

    return (
        <View className="flex flex-row">
            <Pressable onPress={toggleUserMenu} className="w-12 items-center py-3.5">
                {currentUser ? (
                    levelIcons[currentUser.level-1]
                ) : (
                    <UserIcon width={20} height={20} />
                )}
            </Pressable>
            {currentUser && (
                <Pressable onPress={() => {
                    navigation.navigate('Notifications')
                }} className="w-12 items-center py-3.5">
                    <BellIcon width={24} height={24}
                              color={(currentUser.unread_notifications_count > 0) ? '#00d163' : '#8E8E8F'}
                              hasUnread={(currentUser.unread_notifications_count > 0)}/>
                </Pressable>
            )}
            <Pressable onPress={toggleEllipsisMenu} className="items-center py-3.5 pl-5 pr-1">
                <FontAwesome color={brandColors.green} name="ellipsis-vertical" size={20}/>
            </Pressable>
        </View>
    );
};
