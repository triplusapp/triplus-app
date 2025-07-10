import useLocalization from "@/src/i18n/useLocalization";

import React, {useEffect, useState} from "react";
import {DimensionValue, Text, View} from "react-native";
import {usePublicUserStore} from "@/src/stores/publicUserStore";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {CommonStackParamList} from "@/src/navigation/BottomTabNavigator";
import {PublicUser} from "@/src/types/publicUser";
import Level5Icon from "@/components/svgs/levels/level5Icon";
import Level4Icon from "@/components/svgs/levels/level4Icon";
import Level3Icon from "@/components/svgs/levels/level3Icon";
import Level2Icon from "@/components/svgs/levels/level2Icon";
import Level1Icon from "@/components/svgs/levels/level1Icon";
import ProductList from "@/components/products/_list";
import {favoriteService} from "@/src/api/services/favoriteService";
import {Image} from "expo-image";

type Props = NativeStackScreenProps<CommonStackParamList, 'User'>;

export default function UserScreen({route}: Props) {
    const {id} = route.params;
    const {i18n} = useLocalization();
    const {publicUser}: { publicUser: PublicUser | null } = usePublicUserStore();
    const [refreshKey, setRefreshKey] = useState<number>(0); // Nova clau per refrescar ProductList

    if (!publicUser) {
        return <></>;
    }

    const favoriteProductsFetcher = async (page: number) => {
        return await favoriteService.fetchUserFavoriteProducts(publicUser.id, page);
    };

    const levelIcons = [
        (<Level1Icon width={40} height={40}/>),
        (<Level2Icon width={40} height={40}/>),
        (<Level3Icon width={40} height={40}/>),
        (<Level4Icon width={40} height={40}/>),
        (<Level5Icon width={40} height={40}/>),
    ];

    const getHeader = () => {
        return (
            <View>
                <View>
                    <Text className={'font-bold text-2xl'}>{publicUser.name}</Text>
                    {publicUser.location && (
                        <Text>{publicUser.location}</Text>
                    )}
                </View>
                <View className="mt-4 flex-row gap-4">
                    {publicUser.avatar && (
                        <View className={'h-36 bg-white rounded-2xl p-4'}>
                            <Image
                                placeholder={require("../../../assets/images/image-placeholder.png")}
                                source={{uri: publicUser.avatar.thumb}}
                                style={{
                                    height: 100,
                                    width: 100,
                                    borderRadius: 100 / 2,
                                    overflow: "hidden",
                                }}
                            />
                        </View>
                    )}
                    <View
                        className="h-36 p-4 flex-1 bg-white rounded-2xl shrink-0 items-center justify-center"
                    >
                        {levelIcons[publicUser.level - 1]}
                        <Text className="mt-2 font-bold text-xl">{i18n.t(`experience_history.levels.${publicUser.level}`)}</Text>
                        <Text className="">{publicUser.points} {i18n.t('user.points')} ({i18n.t('user.level')} {publicUser.level})</Text>
                    </View>
                </View>
                <Text className="mt-4 mb-4 font-bold text-2xl">{i18n.t('user.favorite_products')}</Text>
            </View>
        );

    }
    return (
        <View className={'px-4 flex-1'}>

            <ProductList
                key={refreshKey}
                fetchProducts={favoriteProductsFetcher}
                header={getHeader()}
            />

        </View>
    );
}
