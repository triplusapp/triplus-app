import {ActivityIndicator, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useState} from "react";
import ProductListCarousel from "@/components/products/_list-carousel";
import {communityService} from "@/src/api/services/communityService";
import UserListCarousel from "@/components/users/users-carousel-list";
import Title from "@/components/screens/Title";
import {TimeLineItem, TimeLineItemsList} from "@/src/types/timeLineItem";
import Toast from "react-native-root-toast";
import {Image} from "expo-image";
import i18n from "@/src/i18n";
import Unauthenticated from "@/components/screens/Unauthenticated";
import {useAuth} from "@/src/auth";
import ProductRequestListCarousel from "@/components/products/_list-requests-carousel";
import TimelineCard from "@/components/community/_timeline-card";
import {PaginationLinks, PaginationMeta} from "@/src/types/pagination";
import {useFocusEffect} from "@react-navigation/core";

export default function CommunityScreen() {
    const [timelineItems, setTimelineItems] = useState<TimeLineItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);
    const [links, setLinks] = useState<PaginationLinks | null>(null);
    const [isFirstPageReceived, setIsFirstPageReceived] = useState<boolean>(false);
    const {isAuthenticated} = useAuth();

    const top10ProductsFetcher = async () => {
        return await communityService.top10products();
    };
    const top10UsersFetcher = async () => {
        return await communityService.top10users();
    };
    const lastProductsFetcher = async () => {
        return await communityService.lastProducts();
    };
    const lastProductRequestsFetcher = async () => {
        return await communityService.lastProductRequests();
    };

    const fetchTimelineItems = async (page: number) => {
        setIsLoading(true)
        try {
            const response: TimeLineItemsList = await communityService.lastTimeLineItems(page);
            if (page === 1) {
                setTimelineItems(response.data);
            } else {
                setTimelineItems([...timelineItems, ...response.data]);
            }
            setPagination(response.meta)
            setLinks(response.links)
        } catch (error: any) {
            console.log(error.message);

            Toast.show('Error: ' + error.message, {
                shadow: false,
                textStyle: {
                    fontSize: 12
                }
            })
        } finally {
            setIsLoading(false)
        }
    };

    const fetchNextPage = () => {
        if (!pagination) {
            return null;
        }
        if (pagination.current_page === pagination.last_page) {
            return null;
        }
        fetchTimelineItems(pagination.current_page + 1);
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchTimelineItems(1);
        }
    }, [isAuthenticated]);

    useFocusEffect(
        useCallback(() => {
            if (isAuthenticated) {
                fetchTimelineItems(1);
            }
        }, [isAuthenticated])
    );

    if (!isAuthenticated) {
        return (
            <View className={'px-4 flex-1'}>
                <Unauthenticated/>
            </View>
        );
    }

    return (
        <ScrollView className={'flex-1'}>
            <View className={'gap-4'}>
                <View className={'px-4'}>
                    <Title text={i18n.t('community.top_10_products')}/>
                </View>
                <ProductListCarousel fetchProducts={top10ProductsFetcher}/>
            </View>

            <View className={'mt-8 gap-4'}>
                <View className={'px-4'}>
                    <Title text={i18n.t('community.top_10_users')}/>
                </View>
                <UserListCarousel fetchUsers={top10UsersFetcher}/>
            </View>

            {timelineItems.length > 0 && (
                <View className={'mt-8 px-4'}>
                    <Title text={i18n.t('community.last_actions')}/>
                    <View className={'gap-4 mt-4'}>
                        {timelineItems.map((timelineItem, index) => (
                            <TimelineCard key={'timeline-' + index} timelineItem={timelineItem}
                                          index={'tl-item-' + index}/>
                        ))}
                        {(pagination && pagination.current_page !== pagination.last_page) && (
                            <TouchableOpacity
                                className={'bg-white px-4 py-2 rounded w-16 mx-auto items-center disabled:opacity-50'}
                                onPress={fetchNextPage}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator />
                                ) : (
                                    <Text className={'text-lg'}>+</Text>
                                )}
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}

            <View className={'mt-8 gap-4'}>
                <View className={'px-4'}>
                    <Title text={i18n.t('community.last_products')}/>
                </View>
                <ProductListCarousel fetchProducts={lastProductsFetcher}/>
            </View>

            <View className={'mb-8 mt-8 gap-4'}>
                <View className={'px-4'}>
                    <Title text={i18n.t('community.last_product_requests')}/>
                </View>
                <ProductRequestListCarousel fetchProducts={lastProductRequestsFetcher}/>
            </View>
        </ScrollView>
    );
}

