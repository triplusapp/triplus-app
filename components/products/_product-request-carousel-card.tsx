import React from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import Favorite from "@/components/favorites/_favorite";
import {Image} from "expo-image";
import {useProductStore} from "@/src/stores/productStore";
import {useNavigation} from "@react-navigation/native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {CommonStackParamList} from "@/src/navigation/BottomTabNavigator";
import {SuggestedProduct} from "@/src/types/suggestedProduct";
import {useSuggestedProductStore} from "@/src/stores/suggestedProductStore";

type Props = NativeStackScreenProps<CommonStackParamList, 'Product'>;

export default function ProductRequestCarouselCard({product}: { product: SuggestedProduct }) {
    const navigation = useNavigation<Props['navigation']>();
    const {setSuggestedProduct} = useSuggestedProductStore();

    return (
        <Pressable
            className="bg-white active:bg-gray-100 relative justify-between rounded-xl rounded-br-3xl p-3 w-[150]"
            onPress={() => {
                setSuggestedProduct(product);
                navigation.push('SuggestedProduct', {
                    id: product.id
                });
            }}
        >
            <View>
                <View className={'items-center'}>
                    <Image
                        placeholder={require("../../assets/images/image-placeholder.png")}
                        source={{uri: product.image}}
                        style={{
                            height: 60,
                            width: 60,
                            borderRadius: 60 / 2,
                            overflow: "hidden",
                        }}
                    />
                </View>
                <Text className={'mt-2'}>{product.name}</Text>
                {product.brand && (
                    <Text className={'text-sm'}>{product.brand}</Text>
                )}
                {product.brand !== product.company_name && (
                    <Text className={'text-sm'}>{product.company_name}</Text>
                )}
            </View>
        </Pressable>
    );
}
