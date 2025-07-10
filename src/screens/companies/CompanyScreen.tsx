import useLocalization from "@/src/i18n/useLocalization";

import React, {useEffect, useState} from "react";
import {Dimensions, LayoutChangeEvent, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Image} from "expo-image";
import ProductList from "@/components/products/_list";
import {companyService} from "@/src/api/services/companyService";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {CommonStackParamList} from "@/src/navigation/BottomTabNavigator";
import {Company} from "@/src/types/company";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {GestureHandlerRootView, NativeViewGestureHandler} from "react-native-gesture-handler";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {LightBox} from "@alantoa/lightbox";
import LightboxGallery from "@/components/gallery/LightboxGallery";
import {useAuth} from "@/src/auth";

type Props = NativeStackScreenProps<CommonStackParamList, 'Company'>;

export default function CompanyScreen({ route, navigation }: Props) {
    const {id} = route.params;
    const [company, setCompany] = useState<Company>()
    const {i18n} = useLocalization();
    const insets = useSafeAreaInsets();
    const {isAuthenticated} = useAuth();

    useEffect(() => {
        fetchCompany()
        console.log(insets.bottom);
    }, []);

    if (!company) {
        return <></>;
    }

    async function fetchCompany() {
        setCompany(await companyService.fetch(id))
    }

    const companyProductsFetcher = async (page: number) => {
        return await companyService.fetchProducts(isAuthenticated ?? false, company.id, page);
    };

    const getHeader = () => {
        const { width } = Dimensions.get('window');

        return (
            <View>
                <View>
                    <Text className="font-bold text-xl">{company.name}</Text>
                    <View className={'mt-4 bg-white p-4 rounded-2xl'}>
                        {company.description && (
                            <View>
                                <CollapsableContainer text={company.description} />
                            </View>
                        )}
                        {company.address && (
                            <Text className={'mt-4 text-sm text-gray-500'}>{company.address}</Text>
                        )}
                        <View className={'-mx-4 mt-4'}>
                            <LightboxGallery images={company.media} singleThumb={false} />
                        </View>
                    </View>
                </View>

                <Text className="mt-4 mb-4 font-bold text-xl">{i18n.t('company_profile.products')}</Text>
            </View>
        );
    };

    return (
        <GestureHandlerRootView>
            <NativeViewGestureHandler>
                <View
                    className={'flex-1 mx-4'}
                >
                    <ProductList
                        fetchProducts={companyProductsFetcher}
                        header={getHeader}
                    />
                </View>
            </NativeViewGestureHandler>
        </GestureHandlerRootView>
    );
}

export const CollapsableContainer = ({text,}: {
    text: string;
}) => {
    const defaultHeight = 120;
    const [expanded, setExpanded] = useState(false);
    const [minHeight, setMinHeight] = useState(0);
    const [height, setHeight] = useState(minHeight);
    const animatedHeight = useSharedValue(minHeight);

    const onLayout = (event: LayoutChangeEvent) => {
        const onLayoutHeight = event.nativeEvent.layout.height;

        if (onLayoutHeight > 0 && height !== onLayoutHeight) {
            setHeight(onLayoutHeight);

            if (height < defaultHeight) {
                setMinHeight(onLayoutHeight)
            }
        }
    };

    const collapsableStyle = useAnimatedStyle(() => {
        animatedHeight.value = expanded ? withTiming(height) : withTiming(minHeight);

        return {
            height: animatedHeight.value,
        };
    }, [expanded, height]);

    return (
        <>
            <Animated.View style={[collapsableStyle, {overflow: "hidden"}]}>
                <View style={{position: "absolute"}} onLayout={onLayout}>
                    <Text>{text}</Text>
                </View>
            </Animated.View>
            {height > minHeight && (
                <View>
                    {!expanded && (
                        <TouchableOpacity className={'flex-row gap-1'} onPress={() => setExpanded(true)}>
                            <FontAwesome name={'chevron-down'} size={18} />
                            <Text className={'font-bold'}>Veure més</Text>
                        </TouchableOpacity>
                    )}
                    {expanded && (
                        <TouchableOpacity className={'flex-row gap-1'} onPress={() => setExpanded(false)}>
                            <FontAwesome name={'chevron-up'} size={18} />
                            <Text className={'font-bold'}>Veure menys</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    image: {
        height: 100,
        width: 120,
        borderRadius: 10,
        marginRight: 16,
    }
});

