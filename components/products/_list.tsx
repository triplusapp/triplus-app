import React, {useEffect, useState} from "react";
import {ActivityIndicator, FlatList, ListRenderItem, Text, View} from "react-native";
import {PaginationMeta} from "@/src/types/pagination";
import {Product} from "@/src/types/product";
import ProductCard from "@/components/products/_product-card";
import Toast from "react-native-root-toast";
import i18n from "@/src/i18n";

export default function ProductList({ fetchProducts, header }: {
    fetchProducts: (page: number) => Promise<{ data: Product[], meta: PaginationMeta }>,
    header: any
}) {
    const [data, setData] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);
    const [isFirstPageReceived, setIsFirstPageReceived] = useState<boolean>(false);

    const fetchData = async (pageNumber: number) => {
        setIsLoading(true);
        try {
            const response  = await fetchProducts(pageNumber);
            setData([...data, ...response.data]);
            setPagination(response.meta);
            setIsLoading(false);
            !isFirstPageReceived && setIsFirstPageReceived(true);
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

    const fetchNextPage = () => {
        if (!pagination) {
            return null;
        }
        if (pagination.current_page === pagination.last_page) {
            return null;
        }
        fetchData(pagination.current_page + 1);
    };

    useEffect(() => {
        fetchData(1);
    }, []);

    const ListEndLoader = () => {
        if (!isFirstPageReceived && isLoading) {
            // Show loader at the end of list when fetching next page data.
            return <ActivityIndicator size={'large'}/>;
        }
    };

    if (!isFirstPageReceived && isLoading) {
        // Show loader when fetching first page data.
        return <ActivityIndicator size={'small'}/>;
    }

    const ResultEmpty = () => {
        return (
            <View className={'bg-white p-6 rounded-xl'}>
                <Text>{i18n.t('products.blank_state')}</Text>
            </View>
        )
    }

    const renderItem: ListRenderItem<Product> = ({item, index}) => {
        return <View key={index} className={'mb-4'}>
            <ProductCard product={item} registerStory={false} />
        </View>
    };

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            onEndReached={fetchNextPage}
            onEndReachedThreshold={0.8}
            ListFooterComponent={ListEndLoader} // Loader when loading next page.
            ListHeaderComponent={header}
            ListEmptyComponent={ResultEmpty}
        />
    );
}
