import useLocalization from "@/src/i18n/useLocalization";

import React from "react";
import {Alert, StyleSheet, Text, View} from "react-native";
import {Image} from "expo-image";
import PrimaryButton from "@/components/forms/PrimaryButton";
import {useSuggestedProductStore} from "@/src/stores/suggestedProductStore";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {CommonStackParamList} from "@/src/navigation/BottomTabNavigator";
import {SuggestedProduct} from "@/src/types/suggestedProduct";
import {productService} from "@/src/api/services/productService";
import {ApiResponseError} from "@/src/api/core/apiResponseError";

type Props = NativeStackScreenProps<CommonStackParamList, 'SuggestedProduct'>;

export default function SuggestedProductScreen({ route }: Props) {
    const {id} = route.params;
    const {i18n} = useLocalization();
    const {suggestedProduct}: {suggestedProduct: SuggestedProduct|null} = useSuggestedProductStore();

    const handleMessage = async () => {
        if (suggestedProduct) {
            try {
                await productService.attachProductSuggestion(suggestedProduct.barcode)
                Alert.alert(i18n.t('suggested_product.message_sent.title'), i18n.t('suggested_product.message_sent.message'))
            } catch (responseError) {
                if (responseError instanceof ApiResponseError) {
                    Alert.alert('Error', responseError.message)
                } else {
                    console.log(responseError);
                }
            }
        }
    };

    return (
        <View className="px-4">
            <View className="flex flex-row items-center">
                <Image
                    placeholder={require("@/assets/images/image-placeholder.png")}
                    source={{uri: suggestedProduct?.image}}
                    style={styles.image}/>
                <View className="ml-4 flex-1">
                    <Text className="font-bold text-2xl">{suggestedProduct?.name}</Text>
                    {suggestedProduct?.format && (
                        <Text>{suggestedProduct.format}</Text>
                    )}
                    {(suggestedProduct?.brand && suggestedProduct?.brand !== suggestedProduct?.company_name) && (
                        <Text>{suggestedProduct.brand}</Text>
                    )}
                    {suggestedProduct?.company_name && (
                        <Text>{suggestedProduct?.company_name}</Text>
                    )}
                </View>
            </View>
            <View className={'mt-4 gap-4'}>
                <View className={'p-4 rounded-2xl bg-amber-50'}>
                    <Text>{i18n.t('suggested_product.info')}</Text>
                </View>
                <PrimaryButton
                    text={i18n.t('suggested_product.send_btn')}
                    handleSubmit={handleMessage}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        height: 100,
        width: 100,
        borderRadius: 100 / 2,
        overflow: "hidden",
    }
})

