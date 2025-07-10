import {ActivityIndicator, FlatList, ListRenderItem, Pressable, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useState} from "react";
import TextInput from "@/components/forms/TextInput";
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import brandColors from "@/assets/colors";
import {searchService} from "@/src/api/services/searchService";
import {
    ApiSearchResponseItem,
    SearchableType,
    SearchResponseList,
    SearchSortBy as SearchSortByType
} from "@/src/types/search";
import {Product} from "@/src/types/product";
import {NativeStackNavigationProp, type NativeStackScreenProps} from "@react-navigation/native-stack";
import {Company} from "@/src/types/company";
import {PaginationMeta} from "@/src/types/pagination";
import {SearchStackParamList} from "@/src/navigation/BottomTabNavigator";
import ProductCard from "@/components/products/_product-card";
import CompanyCard from "@/components/companies/_company-card";
import {Checkbox, RadioButton} from "react-native-ui-lib";
import Toast from 'react-native-root-toast';
import i18n from "@/src/i18n";
import {useAuth} from "@/src/auth";
import {useFocusEffect} from "@react-navigation/core";
import {useClickOutside} from "react-native-click-outside";
import ProductRequestCarouselCard from "@/components/products/_product-request-carousel-card";
import {SuggestedProduct} from "@/src/types/suggestedProduct";
import ProductRequestCard from "@/components/products/_product-request-card";

type Props = NativeStackScreenProps<SearchStackParamList, 'Search'>;

export default function SearchScreen({navigation}: Props) {
    const {isAuthenticated} = useAuth()
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [previousSearchTerm, setPreviousSearchTerm] = useState<string>('');
    const [searchFilters, setSearchFilters] = useState<string[]>([]);
    const [searchSortBy, setSearchSortBy] = useState<SearchSortByType|null>(null);
    const [searchResults, setSearchResults] = useState<ApiSearchResponseItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);
    const [isFirstPageReceived, setIsFirstPageReceived] = useState<boolean>(false);

    useFocusEffect(
        useCallback(() => {
            setSearchFilters([])
            setSearchSortBy(null);
            setSearchResults([])
            setPagination(null)
            handleSearchChange('', true)
        }, [])
    );

    const handleSearchChange = (text: string, force: boolean) => {
        if (! force) {
            force = false;
        }

        setSearchTerm(text);

        if (force || text !== searchTerm) {
            fetchSearchResults(text, 1, searchFilters, searchSortBy)
        }
    };

    const handleSearchFilterChange = (filter: string, checked: boolean) => {
        setSearchFilters(prevFilters => {
            const updatedFilters = checked
                ? [...prevFilters, filter] // Add filter
                : prevFilters.filter(f => f !== filter); // Remove filter

            fetchSearchResults(searchTerm, 1, updatedFilters, searchSortBy);

            return updatedFilters;
        });
    };

    const handleSearchOrderByChange = (orderBySelected: SearchSortByType) => {
        setSearchSortBy((prevValue: SearchSortByType|null) => {
            if (prevValue === orderBySelected) {
                fetchSearchResults(searchTerm, 1, searchFilters, null);
                return null;
            }

            fetchSearchResults(searchTerm, 1, searchFilters, orderBySelected);
            return orderBySelected;
        });
    };

    const isFilterSelected = (filter: string): boolean => {
        return searchFilters.some(f => f === filter);
    };

    const isOrderBySelected = (orderByOption: SearchSortByType): boolean => {
        return orderByOption === searchSortBy;
    };

    const fetchSearchResults = async (term: string, page: number, filters: string[], sortBy: SearchSortByType|null) => {
        setIsLoading(true);
        term = term.trim()
        try {
            let response: SearchResponseList = await searchService.search(page, term, filters, sortBy, isAuthenticated ?? false);

            if (response.meta.current_page === 1) {
                setSearchResults(response.data);
            } else {
                setSearchResults([...searchResults, ...response.data]);
            }
            setPagination(response.meta)
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

    useEffect(() => {
        fetchSearchResults(searchTerm, 1, searchFilters, searchSortBy)
    }, []);

    const fetchNextPage = () => {
        if (!pagination) {
            return null;
        }
        if (pagination.current_page === pagination.last_page) {
            return null;
        }
        fetchSearchResults(searchTerm, pagination.current_page + 1, searchFilters, searchSortBy);
    };

    const renderItem: ListRenderItem<ApiSearchResponseItem> = ({item, index}) => {
        return <View
            key={item.type+index}
            className={'mb-4 px-4'}
        >
            {(item.type === SearchableType.Company) && (
                <CompanyCard company={item.model as Company} registerStory={true}/>
            )}
            {(item.type === SearchableType.Product) && (
                // <ResultProductItem product={item.model as Product}/>
                <ProductCard product={item.model as Product} registerStory={true} />
            )}
            {(item.type === SearchableType.ProductRequest) && (
                <ProductRequestCard product={item.model as SuggestedProduct}/>
            )}
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
                {searchTerm.trim().length > 0 ? (
                    <View className={'gap-6'}>
                        <Text className={'text-gray-500'}>{i18n.t('search.no_results')}</Text>
                        <TouchableOpacity
                            onPress={() => navigation.push("UploadProduct", {barcode: ''})}
                        >
                            <Text>
                                <Text className={'text-gray-500'}>{i18n.t('search.no_results_manual1')}</Text>
                                <Text className={'underline text-gray-500'}>{i18n.t('search.no_results_manual2')}</Text>
                                <Text className={'text-gray-500'}>{i18n.t('search.no_results_manual3')}</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <></>
                )}
            </View>
        )
    }

    return (
        <View className={'pt-4 flex-1'}>
            <FlatList
                data={searchResults}
                ListHeaderComponent={SearchHeader(navigation, searchTerm, handleSearchChange, isFilterSelected, isOrderBySelected, handleSearchFilterChange, handleSearchOrderByChange)}
                stickyHeaderIndices={[0]}
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
    navigation: NativeStackNavigationProp<SearchStackParamList, "Search", undefined> | string[],
    searchTerm: string,
    handleSearchChange: ((text: string, force: boolean) => void),
    isFilterSelected: ((filter: string) => boolean),
    isOrderBySelected: ((orderByOption: SearchSortByType) => boolean),
    handleSearchFilterChange: (filter: string, value: boolean) => void,
    handleSearchOrderByChange: (orderByOption: SearchSortByType) => void,
) {
    const {isAuthenticated} = useAuth();
    const [filtersExpanded, setFiltersExpanded] = useState<boolean>(false);
    const [orderByExpanded, setOrderByExpanded] = useState<boolean>(false);
    const refFilters = useClickOutside<View>(() => setFiltersExpanded(false));
    const refOrder = useClickOutside<View>(() => setOrderByExpanded(false));

    const filters: string[] = [
        "vegan",
        "vegetarian",
        "gluten_free",
        "organic",
        "biodynamic",
        "fair_trade",
    ];

    let orderByOptions: string[] = [
        SearchSortByType.Score,
        SearchSortByType.Name,
    ];

    if (isAuthenticated) {
        orderByOptions.push(SearchSortByType.Favorites);
    }

    return (
        <View style={{
            backgroundColor: brandColors.bg,
            paddingHorizontal: 16,
        }}>
            <View className={'flex-row items-center justify-between mb-2'}>
                <Text className={'font-bold text-xl'}>{i18n.t('search.search_btn')}</Text>
                {isAuthenticated && (
                    <Pressable
                        className={'flex-row items-center gap-1'}
                        onPress={() => navigation.push('SearchHistory')}
                    >
                        <FontAwesome name="bars" className={'shrink-0'}/>
                        <Text className={'text-sm'}>{i18n.t('search.view_history_btn')}</Text>
                    </Pressable>
                )}
            </View>
            <TextInput
                onChangeText={(text) => handleSearchChange(text, false)}
                value={searchTerm}
                icon={<FontAwesome name="magnifying-glass" size={20} color={brandColors.green} style={{marginTop: 10}}/>}
                placeholder={i18n.t('search.search_placeholder')}
            />

            <View className={'mt-4 flex-row items-center justify-between mb-2'}>
                <Text className={'font-bold text-xl'}>{i18n.t('search.results')}</Text>
                <View
                    className={'flex-row items-center gap-4'}
                >
                    {filtersExpanded && (
                        <View
                            ref={refFilters}
                            className={'shadow-2xl border border-gray-200 absolute right-20 top-10 bg-white p-2 rounded-xl gap-1'}
                        >
                            {filters.map((filter, index) => (
                                <Checkbox
                                    key={index}
                                    value={isFilterSelected(filter)}
                                    color={brandColors.green}
                                    label={i18n.t(`search.filters.${filter}`)}
                                    labelStyle={{
                                        fontSize: 16
                                    }}
                                    containerStyle={{
                                        padding: 4
                                    }}
                                    onValueChange={(value) => handleSearchFilterChange(filter, value)}
                                />
                            ))}
                        </View>
                    )}
                    {orderByExpanded && (
                        <View
                            ref={refOrder}
                            className={'shadow-2xl border border-gray-200 absolute right-0 top-10 bg-white p-2 rounded-xl gap-1'}
                        >
                            {orderByOptions.map((orderByOption, index) => (
                                <RadioButton
                                    key={index}
                                    selected={isOrderBySelected(orderByOption as SearchSortByType)}
                                    color={brandColors.green}
                                    labelStyle={{
                                        fontSize: 16
                                    }}
                                    containerStyle={{
                                        padding: 4
                                    }}
                                    label={i18n.t(`search.orderByOptions.${orderByOption}`)}
                                    onPress={() => handleSearchOrderByChange(orderByOption as SearchSortByType)}
                                />
                            ))}
                        </View>
                    )}
                    <Pressable
                        onPress={() => {
                            setFiltersExpanded(! filtersExpanded)
                        }}
                        className={'flex-row items-center gap-1 py-3'}
                    >
                        <FontAwesome size={13} name="filter" className={'shrink-0'}/>
                        <Text className={''}>{i18n.t('search.filter_btn')}</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            setOrderByExpanded(! orderByExpanded)
                        }}
                        className={'flex-row items-center gap-1 py-3 pl-1'}
                    >
                        <FontAwesome size={14} name="arrow-down-wide-short" className={'shrink-0'}/>
                        <Text className={''}>Ordenar</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}
