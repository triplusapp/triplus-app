import React from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {Product} from "@/src/types/product";
import Favorite from "@/components/favorites/_favorite";
import {Image} from "expo-image";
import {useProductStore} from "@/src/stores/productStore";
import {useNavigation} from "@react-navigation/native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {CommonStackParamList} from "@/src/navigation/BottomTabNavigator";
import {searchService} from "@/src/api/services/searchService";
import {SearchableType} from "@/src/types/search";
import {useAuth} from "@/src/auth";

type Props = NativeStackScreenProps<CommonStackParamList, 'Product'>;

export default function ProductCard({product, registerStory = false}: { product: Product, registerStory: boolean }) {
    const navigation = useNavigation<Props['navigation']>();
    const {setProduct} = useProductStore();
    const {isAuthenticated} = useAuth();

    return (
        <Pressable
            key={product.id}
            onPress={() => {
            setProduct(product);
            navigation.push('Product', {id: product.id});
            if (isAuthenticated && registerStory) {
                searchService.addSearchHistory(product.id, SearchableType.Product)
            }
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
                <Text className={'text-lg leading-5'}>{product.brand_name}</Text>
                {product.brand_name !== product.company.name && (
                    <Text className={''}>{product.company.name}</Text>
                )}
                <Text className={'text-gray-500'}>{product.format}</Text>
                <Favorite product={product}/>
            </View>
            <Image
                className={'ml-4'}
                placeholder={require("../../assets/images/image-placeholder.png")}
                source={{uri: product.stamp}}
                style={styles.stamp}/>
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
    stamp: {
        height: 50,
        width: 50,
    }
})
