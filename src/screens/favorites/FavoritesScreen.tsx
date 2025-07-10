import {ActivityIndicator, FlatList, ListRenderItem, RefreshControl, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from "react";
import {favoriteService} from "@/src/api/services/favoriteService";
import ProductListCarousel from "@/components/products/_list-carousel";
import {communityService} from "@/src/api/services/communityService";
import TextInput from "@/components/forms/TextInput";
import type {NativeStackScreenProps} from "@react-navigation/native-stack";
import {FavoritesStackParamList} from "@/src/navigation/BottomTabNavigator";
import i18n from "@/src/i18n";
import {ApiSearchResponseItem, SearchableType} from "@/src/types/search";
import {PaginationMeta} from "@/src/types/pagination";
import {searchService} from "@/src/api/services/searchService";
import Toast from "react-native-root-toast";
import {Product, ProductList} from "@/src/types/product";
import CompanyCard from "@/components/companies/_company-card";
import {Company} from "@/src/types/company";
import ProductCard from "@/components/products/_product-card";
import {useAuth} from "@/src/auth";
import { addListener } from '@alexsandersarmento/react-native-event-emitter';
import Unauthenticated from "@/components/screens/Unauthenticated";
import {useFocusEffect} from "@react-navigation/core";
import Title from "@/components/screens/Title";

type Props = NativeStackScreenProps<FavoritesStackParamList, 'Favorites'>;

export default function FavoritesScreen({navigation}: Props) {
    const {isAuthenticated} = useAuth();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);
    const [isFirstPageReceived, setIsFirstPageReceived] = useState<boolean>(false);

    const handleSearchChange = (text: string) => {
        setSearchTerm(text);
        fetchSearchResults(text, 1)
    };

    const favoriteUpdatedEvent = (productId: string) => {
        fetchSearchResults('', 1)
    };

    addListener('unfavoriteProduct', favoriteUpdatedEvent);
    addListener('favoriteProduct', favoriteUpdatedEvent);

    const fetchSearchResults = async (term: string, page: number) => {
        setIsLoading(true);
        try {
            let results: ProductList = await favoriteService.fetchProducts(page, term);
            setSearchResults(results.data)
        } catch (error: any) {
            console.log(error.message);

            Toast.show(i18n.t('search.fetch_error') + error.message, {
                shadow: false,
                textStyle: {
                    fontSize: 12
                }
            })
        } finally {
            setIsLoading(false);
        }

    };

    const fetchNextPage = () => {
        if (!pagination) {
            return null;
        }
        if (pagination.current_page === pagination.last_page) {
            return null;
        }
        fetchSearchResults(searchTerm, pagination.current_page + 1);
    };

    const renderItem: ListRenderItem<Product> = ({item, index}) => {
        return <View
            key={index}
            className={'mb-4 px-4'}
        >
            <ProductCard product={item} registerStory={false} />
        </View>
    };

    const ListEndLoader = () => {
        if (!isFirstPageReceived && isLoading) {
            // Show loader at the end of list when fetching next page data.
            return <ActivityIndicator size={'large'}/>;
        }
    };

    const SearchResultEmpty = () => {
        return (
            <View className={'mx-4 px-4 py-8 bg-white rounded-xl'}>
                <Text className={'text-gray-500'}>{i18n.t('search.no_results')}</Text>
            </View>
        )
    }

    useFocusEffect(
        useCallback(() => {
            if (isAuthenticated) {
                handleSearchChange('')
            }
        }, [])
    );

    useEffect(() => {
        if (isAuthenticated) {
            handleSearchChange('')
        }
    }, []);

    if (!isAuthenticated) {
        return (
            <View className={'px-4 flex-1'}>
                <Unauthenticated />
            </View>
        );
    }

    return (
        <View className={''}>
            <FlatList
                data={searchResults}
                ListHeaderComponent={SearchHeader(searchTerm, handleSearchChange)}
                ListEmptyComponent={SearchResultEmpty}
                renderItem={renderItem}
                onEndReached={fetchNextPage}
                onEndReachedThreshold={0.8}
                ListFooterComponent={ListEndLoader} // Loader when loading next page.
            />
        </View>
    );
}

function SearchHeader(
    term: string,
    handleSearchChange: ((text: string) => void),
) {
    const {isAuthenticated} = useAuth();

    // useFocusEffect(
    //     useCallback(() => {
    //         if (isAuthenticated) {
    //             handleSearchChange('')
    //         }
    //     }, [])
    // );

    const lastFavoritesProductsFetcher = async () => {
        return await communityService.lastFavorites();
    };

    return (
        <View className={'px-4 bg-brand-bg'}>
            <Title style={{marginBottom: 8}} text={i18n.t('favorites.last_community_favs')} />

            <View className={'-mx-4'}>
                <ProductListCarousel fetchProducts={lastFavoritesProductsFetcher}/>
            </View>

            <View className={'mt-8 flex flex-col gap-4 mb-4'}>
                <Title text={i18n.t('favorites.my_favorites')} />
                <TextInput
                    onChangeText={handleSearchChange}
                    value={term}
                    placeholder={i18n.t('favorites.search')}
                />
            </View>
        </View>
    );
}
