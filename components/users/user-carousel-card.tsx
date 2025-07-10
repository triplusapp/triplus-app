import React from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {PublicUser} from "@/src/types/publicUser";
import {usePublicUserStore} from "@/src/stores/publicUserStore";
import {useNavigation} from "@react-navigation/native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {Image} from "expo-image";
import {CommonStackParamList} from "@/src/navigation/BottomTabNavigator";
import i18n from "@/src/i18n";

type Props = NativeStackScreenProps<CommonStackParamList, 'User'>;

export default function UserCarouselCard({user, position}: { user: PublicUser, position: number }) {
    const navigation = useNavigation<Props['navigation']>();
    const {setPublicUser} = usePublicUserStore();

    return (
        <Pressable
            className="flex bg-white p-3 w-[150] rounded-xl rounded-br-3xl"
            onPress={() => {
                setPublicUser(user);
                navigation.navigate('User', {id: user.id});
            }}>
            <Text className="absolute top-2 left-2 z-10 font-bold text-xl">#{position}</Text>

            <View className={'items-center'}>
                <Image
                    placeholder={require("../../assets/images/image-placeholder.png")}
                    source={{uri: user.avatar?.thumb}}
                    style={{
                        height: 60,
                        width: 60,
                        borderRadius: 60 / 2,
                        overflow: "hidden",
                    }}
                />
            </View>

            <Text className="mt-4 font-bold">{user.name}</Text>
            <Text className={'text-sm'}>{user.points} {i18n.t('experience_history.points')}</Text>
        </Pressable>
    );
}

