import {ActivityIndicator, FlatList, ListRenderItem, Text, View} from 'react-native';
import React, {useEffect, useState} from "react";
import {searchService} from "@/src/api/services/searchService";
import {ApiSearchHistoryResponseItem, SearchableType, SearchHistoryList} from "@/src/types/search";
import {Product} from "@/src/types/product";
import {type NativeStackScreenProps} from "@react-navigation/native-stack";
import {Company} from "@/src/types/company";
import {PaginationMeta} from "@/src/types/pagination";
import {SearchStackParamList} from "@/src/navigation/BottomTabNavigator";
import ProductCard from "@/components/products/_product-card";
import CompanyCard from "@/components/companies/_company-card";
import i18n from "@/src/i18n";

type Props = NativeStackScreenProps<SearchStackParamList, 'SearchHistory'>;

export default function SearchHistoryScreen({navigation}: Props) {
    const [searchResults, setSearchResults] = useState<SearchHistoryList>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);
    const [isFirstPageReceived, setIsFirstPageReceived] = useState<boolean>(false);

    const fetchSearchHistory = async (page: number) => {
        setIsLoading(true);
        let results: SearchHistoryList = await searchService.fetchSearchHistory(page);
        setIsLoading(false);
        setSearchResults(results)
    };

    const fetchNextPage = () => {
        if (!pagination) {
            return null;
        }
        if (pagination.current_page === pagination.last_page) {
            return null;
        }
        fetchSearchHistory(pagination.current_page + 1);
    };

    useEffect(() => {
        fetchSearchHistory(1)
    }, []);

    const renderItem: ListRenderItem<ApiSearchHistoryResponseItem> = ({item, index}) => {
        return <View
            key={index}
            className={'mb-4'}
        >
            {(item.searchable_type === SearchableType.Company) && (
                <CompanyCard company={item.searchable as Company} registerStory={false} />
            )}
            {(item.searchable_type === SearchableType.Product) && (
                <ProductCard product={item.searchable as Product} registerStory={false}/>
            )}
        </View>
    };

    const ListEndLoader = () => {
        if (!isFirstPageReceived && isLoading) {
            // Show loader at the end of list when fetching next page data.
            return <ActivityIndicator size={'large'}/>;
        }
    };

    return (
        <View className={'px-4 mt-4'}>
            <View className={'flex-row items-center justify-between mb-2'}>
                <Text className={'font-bold text-xl'}>{i18n.t('search.history.title')}</Text>
            </View>
            <View className={'mt-2'}>
                {(searchResults && searchResults.data.length > 0) ? (
                    <FlatList
                        data={searchResults.data}
                        renderItem={renderItem}
                        onEndReached={fetchNextPage}
                        onEndReachedThreshold={0.8}
                        ListFooterComponent={ListEndLoader} // Loader when loading next page.
                    />
                ) : (
                    <Text>{i18n.t('search.history.blank_state')}</Text>
                )}
            </View>
        </View>
    );
}
