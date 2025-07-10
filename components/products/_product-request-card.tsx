import React from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {Image} from "expo-image";
import {useNavigation} from "@react-navigation/native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {CommonStackParamList} from "@/src/navigation/BottomTabNavigator";
import {SuggestedProduct} from "@/src/types/suggestedProduct";
import {useSuggestedProductStore} from "@/src/stores/suggestedProductStore";

type Props = NativeStackScreenProps<CommonStackParamList, 'Product'>;

export default function ProductRequestCard({product}: { product: SuggestedProduct }) {
    const navigation = useNavigation<Props['navigation']>();
    const {setSuggestedProduct} = useSuggestedProductStore();

    return (
        <Pressable
            key={product.id}
            onPress={() => {
            setSuggestedProduct(product);
            navigation.push('SuggestedProduct', {
                id: product.id
            });
        }}
            className={'w-full overflow-hidden flex flex-row p-4 items-center bg-white rounded-xl'}
        >
            <Image
                placeholder={require("../../assets/images/image-placeholder.png")}
                source={{uri: product.image}}
                style={styles.image}
            />
            <View
                className="ml-4"
                style={{
                    flexGrow: 1,
                    flexShrink: 1
                }}
            >
                <Text className={'text-lg leading-5'}>{product.name}</Text>
                <Text className={'text-lg leading-5'}>{product.brand}</Text>
                {product.brand !== product.company_name && (
                    <Text className={''}>{product.company_name}</Text>
                )}
                <Text className={'text-gray-500'}>{product.format}</Text>
            </View>
        </Pressable>
    );
}


const styles = StyleSheet.create({
    image: {
        height: 60,
        width: 60,
        borderRadius: 60 / 2,
        overflow: "hidden",
    },
})
