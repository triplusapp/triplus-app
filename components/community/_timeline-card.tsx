import React from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {Product} from "@/src/types/product";
import Favorite from "@/components/favorites/_favorite";
import {Image} from "expo-image";
import {useProductStore} from "@/src/stores/productStore";
import {useNavigation} from "@react-navigation/native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {CommonStackParamList} from "@/src/navigation/BottomTabNavigator";
import {TimeLineItem} from "@/src/types/timeLineItem";
import {useCompanyStore} from "@/src/stores/companyStore";
import {useSuggestedProductStore} from "@/src/stores/suggestedProductStore";

type Props = NativeStackScreenProps<CommonStackParamList, 'Product'>;

export default function TimelineCard({timelineItem, index}: { timelineItem: TimeLineItem, index: string }) {
    const navigation = useNavigation<Props['navigation']>();
    const {setProduct} = useProductStore();
    const {setSuggestedProduct} = useSuggestedProductStore();
    const {setCompany} = useCompanyStore();

    function DefaultContent(timelineItem: TimeLineItem) {
        return (
            <Pressable
                key={getKey(timelineItem)}
                className={'p-4 bg-white rounded-xl flex flex-row gap-4 justify-between'}
            >
                <View className={'flex-1'}>
                    <Text>{timelineItem.action_label}</Text>
                    <Text className={'mt-4 font-bold'}>{timelineItem.product?.name}</Text>
                    <Text>{timelineItem.product?.company.name}</Text>
                </View>
                {timelineItem.product?.image && (
                    <Image
                        placeholder={require("@/assets/images/image-placeholder.png")}
                        source={{uri: timelineItem.product.image}}
                        style={{
                            height: 60,
                            width: 60,
                            borderRadius: 60 / 2,
                            overflow: "hidden",
                        }}
                    />

                )}
            </Pressable>
        )
    }

    function ProductActionContent(timelineItem: TimeLineItem) {
        if (! timelineItem.product) {
            return null;
        }

        return (
            <Pressable
                key={getKey(timelineItem)}
                onPress={() => {
                    if (timelineItem.product) {
                        setProduct(timelineItem.product);
                        navigation.push('Product', {id: timelineItem.product.id});
                    }
                }}
                className={'p-4 bg-white rounded-xl flex flex-row gap-4 justify-between'}
            >
                {timelineItem.performed_by?.avatar?.thumb && (
                    <Image
                        placeholder={require("@/assets/images/image-placeholder.png")}
                        source={{uri: timelineItem.performed_by.avatar?.thumb}}
                        style={{
                            height: 60,
                            width: 60,
                            borderRadius: 60 / 2,
                            overflow: "hidden",
                        }}
                    />
                )}
                <View className={'flex-1'}>
                    <Text className={'text-gray-500 text-sm'}>{timelineItem.date.format('DD/MM/YYYY HH:mm')}</Text>
                    <Text>
                        <Text className={'font-bold'}>{timelineItem.performed_by?.name} </Text>
                        {timelineItem.action_label}
                    </Text>
                    <Text className={'mt-1 text-gray-500 font-bold'}>{timelineItem.product.name}</Text>
                    <Text className={'text-gray-500'}>{timelineItem.product.company.name}</Text>
                    <Favorite product={timelineItem.product} />
                </View>
            </Pressable>
        )
    }

    function ProductRequestContent(timelineItem: TimeLineItem) {
        if (! timelineItem.product_request) {
            return null;
        }

        return (
            <Pressable
                key={getKey(timelineItem)}
                onPress={() => {
                    if (timelineItem.product_request) {
                        setSuggestedProduct(timelineItem.product_request);
                        navigation.push('SuggestedProduct', {id: timelineItem.product_request.id});
                    }
                }}
                className={'p-4 bg-white rounded-xl flex flex-row gap-4 justify-between'}
            >
                {timelineItem.performed_by?.avatar?.thumb && (
                    <Image
                        placeholder={require("@/assets/images/image-placeholder.png")}
                        source={{uri: timelineItem.performed_by.avatar?.thumb}}
                        style={{
                            height: 60,
                            width: 60,
                            borderRadius: 60 / 2,
                            overflow: "hidden",
                        }}
                    />
                )}
                <View className={'flex-1'}>
                    <Text className={'text-gray-500 text-sm'}>{timelineItem.date.format('DD/MM/YYYY HH:mm')}</Text>
                    <Text>
                        <Text className={'font-bold'}>{timelineItem.performed_by?.name} </Text>
                        {timelineItem.action_label}
                    </Text>
                    <Text className={'mt-1 text-gray-500 font-bold'}>{timelineItem.product_request.name}</Text>
                    <Text className={'text-gray-500'}>{timelineItem.product_request.company_name}</Text>
                </View>
            </Pressable>
        )
    }

    function CompanyActionContent(timelineItem: TimeLineItem) {
        if (! timelineItem.company) {
            return <></>;
        }

        return (
            <Pressable
                key={getKey(timelineItem)}
                onPress={() => {
                    if (timelineItem.company) {
                        setCompany(timelineItem.company);
                        navigation.push('Company', {id: timelineItem.company.id});
                    }
                }}
                className={'p-4 bg-white rounded-xl flex flex-row gap-4 justify-between'}
            >
                {timelineItem.company.media[0] && (
                    <Image
                        placeholder={require("@/assets/images/image-placeholder.png")}
                        source={{uri: timelineItem.company.media[0]?.preview}}
                        style={{
                            height: 60,
                            width: 60,
                            borderRadius: 60 / 2,
                            overflow: "hidden",
                        }}
                    />
                )}
                <View className={'flex-1'}>
                    <Text className={'text-gray-500 text-sm'}>{timelineItem.date.format('DD/MM/YYYY HH:mm')}</Text>
                    <Text>
                        <Text className={'font-bold'}>{timelineItem.company.name} </Text>
                        {timelineItem.action_label}
                    </Text>
                </View>
            </Pressable>
        )
    }

    function NewProductActionContent(timelineItem: TimeLineItem) {
        if (!timelineItem.product) {
            return <></>;
        }

        const textColor = timelineItem.product.stamp_text_color;
        const altTextColor = timelineItem.product.stamp_text_color === 'white'
            ? 'text-white'
            : 'text-gray-500';
        return (
            <Pressable
                key={getKey(timelineItem)}
                onPress={() => {
                    if (timelineItem.product) {
                        setProduct(timelineItem.product);
                        navigation.push('Product', {id: timelineItem.product.id});
                    }
                }}
                style={{backgroundColor: timelineItem.product.stamp_background_color}}
                className={'p-4 bg-white rounded-xl flex flex-row gap-4 justify-between'}
            >
                <Image
                    placeholder={require("@/assets/images/image-placeholder.png")}
                    source={{uri: timelineItem.product.image}}
                    style={{
                        height: 60,
                        width: 60,
                        borderRadius: 60 / 2,
                        overflow: "hidden",
                    }}
                />
                <View className={'flex-1'}>
                    <Text
                        className={['text-sm', altTextColor].join(' ')}
                    >
                        {timelineItem.date.format('DD/MM/YYYY HH:mm')}
                    </Text>
                    <Text style={{color: textColor}}>
                        <Text className={'font-bold'}>{timelineItem.product.company.name} </Text>
                        {timelineItem.action_label}
                    </Text>
                    <Text className={'mt-1 font-bold ' + altTextColor}>{timelineItem.product.name}</Text>
                    <Text className={' ' + altTextColor}>{timelineItem.product.company.name}</Text>
                </View>
            </Pressable>
        )
    }

    if (timelineItem.action === 'favorite') {
        return ProductActionContent(timelineItem);
    } else if(timelineItem.action === 'product_search') {
        return ProductActionContent(timelineItem);
    } else if(timelineItem.action === 'product_request') {
        return ProductRequestContent(timelineItem);
    } else if(timelineItem.action === 'scan') {
        return ProductActionContent(timelineItem);
    } else if(timelineItem.action === 'new_product') {
        return NewProductActionContent(timelineItem);
    } else if(timelineItem.action === 'new_company') {
        return CompanyActionContent(timelineItem);
    }

    return DefaultContent(timelineItem);
}

function getKey(timelineItem: TimeLineItem): string {
    return 'timeline-item-' + timelineItem.date.format('YYYYMMDDHHmmss') + '-' + timelineItem.action_label + '-' + timelineItem.product?.id;
}
