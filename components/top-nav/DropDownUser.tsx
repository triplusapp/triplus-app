import React from "react";
import {useAuth} from "@/src/auth";
import useLocalization from "@/src/i18n/useLocalization";
import {Pressable, Text, View} from "react-native";
import MenuItem from "@/components/top-nav/MenuItem";
import Divider from "@/components/top-nav/Divider";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/navigation";
import {useNavigation} from "@react-navigation/native";
import {useClickOutside} from 'react-native-click-outside';
import {useMenu} from "@/src/menu/hooks/useMenu";

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function DropDownUser() {
    const {isAuthenticated, logout, setUserIsAuthenticated, updateUser} = useAuth();
    const {i18n} = useLocalization();
    const {showUserMenu, setShowUserMenu} = useMenu();
    const navigation = useNavigation<Props['navigation']>()
    const ref = useClickOutside<View>(() => setShowUserMenu(false));

    const handleLogout = async () => {
        const isLoggedOut = await logout();
        if (isLoggedOut) {
            setUserIsAuthenticated(false);
            await updateUser();
            navigation.reset({
                index: 0,
                routes: [{name: 'Home'}]
            });
        }
    };

    if (! showUserMenu) {
        return null;
    }

    return (
        <View
            ref={ref}
            className="absolute bg-white shadow shadow-gray-300 rounded-xl z-50"
            style={{right: 40, top: 85}}
        >
            {isAuthenticated ? (
                <>
                    <MenuItem text={i18n.t('user_dropdown.profile')} href="Profile"/>
                    <Divider/>
                    <MenuItem text={i18n.t('user_dropdown.experience')} href="Experience"/>
                    <Divider/>
                    {/*<MenuItem text={i18n.t('user_dropdown.account')} href="Account"/>*/}
                    {/*<Divider/>*/}
                    <MenuItem text={i18n.t('user_dropdown.settings')} href="Settings"/>
                    <Divider/>
                    <Pressable
                        onPress={handleLogout}
                        className="px-4 pr-10 py-2 rounded-b-xl active:bg-red-100"
                    >
                        <Text className="text-lg text-red-500">{i18n.t('user_dropdown.logout')}</Text>
                    </Pressable>
                </>
            ) : (
                <>
                    <MenuItem text={i18n.t('user_dropdown.login')} href="Login"/>
                    <Divider/>
                    <MenuItem text={i18n.t('user_dropdown.register')} href="Register"/>
                </>
            )}
        </View>
    );
};
