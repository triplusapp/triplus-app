import {Product} from "@/src/types/product";
import {ActivityIndicator, Pressable, Text, View} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import React, {useCallback, useEffect, useState} from "react";
import {favoriteService} from "@/src/api/services/favoriteService";
import {useAuth} from "@/src/auth";
import {notify} from '@alexsandersarmento/react-native-event-emitter';
import {useFocusEffect} from "@react-navigation/core";

export default function Favorite({product}: { product: Product }) {
    const {isAuthenticated} = useAuth();
    const [favorited, setFavorited] = useState<boolean>(product.favorited ?? false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [numFavorites, setNumFavorites] = useState<number>(product.num_favorites ?? 0);

    const favoriteAction = async () => {
        setIsLoading(true)
        favoriteService.favorite(product.id);
        setFavorited(true);
        setIsLoading(false);
        setNumFavorites(numFavorites + 1);
        notify('favoriteProduct', product.id);
    };
    const unfavoriteAction = async () => {
        setIsLoading(true)
        await favoriteService.unfavorite(product.id);
        setIsLoading(false);
        setFavorited(false);
        setNumFavorites(numFavorites - 1);
        notify('unfavoriteProduct', product.id);
    };

    return <View key={'favorite'+product.id} className="flex flex-row items-center">
        {isAuthenticated ? (
            <Pressable
                className={'p-2'}
                onPress={favorited ? unfavoriteAction : favoriteAction}
            >
                {isLoading ? (
                    <ActivityIndicator size={20}/>
                ) : (
                    <FontAwesome name="star" color="#F5D429" solid={favorited} size={20}/>
                )}
            </Pressable>
        ) : (
            <FontAwesome name="star" color="#F5D429" solid={false} size={20}/>
        )}
        <Text className={'text-sm'}>{numFavorites}</Text>
    </View>
}
