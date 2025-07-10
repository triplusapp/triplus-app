import {Product} from "@/src/types/product";
import {Alert, Dimensions, Linking, Pressable, Share, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Image} from "expo-image";
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import Favorite from "@/components/favorites/_favorite";
import React, {ReactNode, useState} from "react";
import {useCompanyStore} from "@/src/stores/companyStore";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import ShareIcon from "@/components/svgs/shareIcon";
import GlutenFreeIcon from "@/components/svgs/features/glutenFree";
import BiodynamicIcon from "@/components/svgs/features/biodynamic";
import FairTradeIcon from "@/components/svgs/features/fairTrade";
import OrganicIcon from "@/components/svgs/features/organic";
import VeganIcon from "@/components/svgs/features/vegan";
import VegetarianIcon from "@/components/svgs/features/vegetarian";
import {Hint} from "react-native-ui-lib";
import brandColors from "@/assets/colors";
import i18n from "@/src/i18n";
import {LightBox} from "@alantoa/lightbox";
import {GestureDetector} from "react-native-gesture-handler";
import LightboxGallery from "@/components/gallery/LightboxGallery";

export default function ProductHeader({product, navigation}: {
    product: Product,
    navigation: NativeStackNavigationProp<any>
}) {
    const {setCompany} = useCompanyStore();
    const { width } = Dimensions.get('window');

    const goToCompanyScreen = () => {
        setCompany(product.company);
        navigation.push('Company', {id: product.company.id});
    };

    const shareProduct = async () => {
        const linkAddress = 'https://applinks.triplus.app/goto/comunitat/producte/' + product.id

        try {
            const result = await Share.share({
                message: `Mira aquest producte a Triplus: ${product.name} (${linkAddress})\n\nSi encara no tens l'app de Triplus, descarrega-te-la a Google Play / App Store o visita el web de Triplus (https://triplus.app)`,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <>
            <View className="flex flex-col items-start">
                <View className="flex flex-row items-end">
                    <View className={'flex-1'}></View>
                    {product.media.length > 0 && (
                        <View className={'flex-1 flex-shrink-0'} style={{ width: 120, height: 120}}>
                            <LightboxGallery images={product.media} singleThumb={true} />
                        </View>
                    )}
                    <View className={'flex-1'}>
                        <View className={'pl-4 flex-row items-center'}>
                        <Favorite product={product}/>
                        <Pressable
                            onPress={shareProduct}
                            className={'p-2'}
                        >
                            <ShareIcon width={18} height={18}/>
                        </Pressable>
                        </View>
                    </View>
                </View>
                <View className="mt-4">
                    <Text className="font-bold text-2xl">{product.name}</Text>
                    {product.format && (
                        <Text className={''}>{product.format}</Text>
                    )}
                    {(product.brand_name && product.brand_name !== product.company.name) && (
                        <Text className={''}>{product.brand_name}</Text>
                    )}
                    <Pressable className="flex flex-row flex-shrink items-center" onPress={goToCompanyScreen}>
                        <Text className={'underline text-xl flex-shrink'}>{product.company.name}</Text>
                    </Pressable>
                </View>
            </View>
        </>
    );
}
