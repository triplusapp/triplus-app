import React from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {Product} from "@/src/types/product";
import Favorite from "@/components/favorites/_favorite";
import {Image} from "expo-image";
import {useProductStore} from "@/src/stores/productStore";
import {useNavigation} from "@react-navigation/native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {CommonStackParamList} from "@/src/navigation/BottomTabNavigator";

type Props = NativeStackScreenProps<CommonStackParamList, 'Product'>;

export default function ProductCarouselCard({product}: { product: Product }) {
    const navigation = useNavigation<Props['navigation']>();
    const {setProduct} = useProductStore();

    return (
        <Pressable
            className="bg-white active:bg-gray-100 relative justify-between rounded-xl rounded-br-3xl p-3 w-[150]"
            onPress={() => {
                setProduct(product);
                navigation.push('Product', {
                    id: product.id
                });
            }}>
            <Image
                placeholder={require("../../assets/images/image-placeholder.png")}
                source={{uri: product.stamp}}
                className={'top-1 left-1'}
                style={{
                    height: 25,
                    width: 25,
                    position: 'absolute',
                    left: 5,
                    top: 5,
                    zIndex: 1,
                }}
            />

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
                <Text className={'text-sm'}>{product.brand_name}</Text>
                {product.brand_name !== product.company.name && (
                    <Text className={'text-sm'}>{product.company.name}</Text>
                )}
            </View>

            <Favorite product={product}/>
        </Pressable>
    );
}
