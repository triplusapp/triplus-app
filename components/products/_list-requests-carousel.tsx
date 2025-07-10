import React, {useCallback, useEffect, useState} from "react";
import {ActivityIndicator, ScrollView, Text, View} from "react-native";
import {Product} from "@/src/types/product";
import ProductCarouselCard from "@/components/products/_product-carousel-card";
import Toast from "react-native-root-toast";
import i18n from "@/src/i18n";
import {useFocusEffect} from "@react-navigation/core";
import ProductRequestCarouselCard from "@/components/products/_product-request-carousel-card";
import {SuggestedProduct} from "@/src/types/suggestedProduct";

export default function ProductRequestListCarousel({fetchProducts}: {
    fetchProducts: () => Promise<SuggestedProduct[]>
}) {
    const [products, setProducts] = useState<SuggestedProduct[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchData = async () => {
        if (products.length === 0) {
            setIsLoading(true);
        }

        try {
            const response = await fetchProducts()
            setProducts(response);
        } catch (error: any) {
            console.log(error.message);

            Toast.show(i18n.t('fetch_error')+ error.message, {
                shadow: false,
                textStyle: {
                    fontSize: 12
                }
            })
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData()
        }, [])
    );

    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) {
        return <ActivityIndicator size={'small'}/>;
    }

    if (products.length === 0) {
        return (
            <View className={'bg-white py-10 rounded-xl rounded-br-3xl px-4 mx-4'}>
                <Text className={'text-sm text-gray-500'}>{i18n.t('products.not_found')}</Text>
            </View>
        )
    }

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{columnGap: 7, paddingHorizontal: 16}}
            // contentInset={{left: 16, right: 16}}
            // scrollIndicatorInsets={{left: 16, right: 16}}
        >
            {products.map((product) => (
                <ProductRequestCarouselCard key={product.id} product={product}/>
            ))}
        </ScrollView>
    );
}
