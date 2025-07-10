import {ActivityIndicator, FlatList, ListRenderItem, Text, View} from 'react-native';
import React, {useEffect, useState} from "react";
import {notificationService} from "@/src/api/services/notificationService";
import Toast from "react-native-root-toast";
import {PaginationLinks, PaginationMeta} from "@/src/types/pagination";
import {Notification, NotificationList} from "@/src/types/notification";
import * as Notifications from 'expo-notifications';
import i18n from "@/src/i18n";
import {useAuth} from "@/src/auth";

export default function NotificationsScreen() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);
    const [isFirstPageReceived, setIsFirstPageReceived] = useState<boolean>(false);
    const {updateUser} = useAuth();

    const fetchSearchResults = async (page: number) => {
        setIsLoading(true);
        try {
            let results: NotificationList = await notificationService.fetch(page);
            if (page === 1) {
                setNotifications(results.data)
            } else {
                setNotifications([...notifications, ...results.data]);
            }
            setPagination(results.meta)
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

        try {
            notificationService.markAllAsRead();
            updateUser(); // Reloads the unread notifications count to update the bell icon
        } catch (error: any) {
            console.log(error);
        }
    };

    const fetchNextPage = () => {
        if (!pagination) {
            return null;
        }
        if (pagination.current_page === pagination.last_page) {
            return null;
        }
        fetchSearchResults(pagination.current_page + 1);
    };

    const renderItem: ListRenderItem<Notification> = ({item, index}) => {
        return <View
            key={index}
            className={'mb-4 p-4 bg-white rounded-xl'}
        >
            {!item.is_read && (
                <View className={'absolute top-4 right-4 h-2 w-2 bg-blue-500 rounded-full'}></View>
            )}
            <Text className={'text-gray-400'}>{item.date.format('DD/MM/YYYY HH:mm')}</Text>
            <Text>{item.message}</Text>
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
            <Text>{i18n.t('notifications.blank_state')}</Text>
        )
    }

    useEffect(() => {
        Notifications.dismissAllNotificationsAsync()
        fetchSearchResults(1)
    }, []);

    return (
        <View className={'p-4'}>
            <FlatList
                data={notifications}
                ListEmptyComponent={SearchResultEmpty}
                renderItem={renderItem}
                onEndReached={fetchNextPage}
                onEndReachedThreshold={0.8}
                ListFooterComponent={ListEndLoader} // Loader when loading next page.
            />
        </View>
    );
}

