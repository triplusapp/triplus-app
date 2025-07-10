import React, {useCallback, useEffect, useState} from "react";
import {ActivityIndicator, ScrollView, Text, View} from "react-native";
import {Product} from "@/src/types/product";
import ProductCarouselCard from "@/components/products/_product-carousel-card";
import Toast from "react-native-root-toast";
import i18n from "@/src/i18n";
import {useFocusEffect} from "@react-navigation/core";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
    interpolateColor
} from 'react-native-reanimated';
import brandColors from "@/assets/colors";

export default function ProductListCarousel({fetchProducts}: {
    fetchProducts: () => Promise<Product[]>
}) {
    const [products, setProducts] = useState<Product[]>([]);
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
        return (
            <View
                className={'rounded-xl rounded-br-3xl'}
                style={{
                    marginHorizontal: 16,
                    width: 150,
                    height: 110,
                }}>
                <LoadingView/>
            </View>
        );
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
                <ProductCarouselCard key={product.id+'_'+product.favorited} product={product}/>
            ))}
        </ScrollView>
    );
}

const LoadingView = () => {
    const progress = useSharedValue(0);
    progress.value = withRepeat(
        withTiming(1, {
            duration: 1000,
            easing: Easing.inOut(Easing.ease)
        }),
        -1,
        true
    );

    const animatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                progress.value,
                [0, 1],
                ['#f6f6f6', '#FFFFFF']
            ),
            flex: 1,
        };
    });

    return (
        <Animated.View
            className={'rounded-xl rounded-br-3xl'}
            style={[{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            }, animatedStyle]}>
            <ActivityIndicator size={'small'}/>
        </Animated.View>
    );
};
