import React, {useEffect, useState} from "react";
import {LayoutChangeEvent, Pressable, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {useProductStore} from "@/src/stores/productStore";
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import {CategoryScore, Factor, FactorScore, IndicatorScore} from "@/src/types/product";
import {productService} from "@/src/api/services/productService";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {CommonStackParamList} from "@/src/navigation/BottomTabNavigator";
import ProductHeader from "@/src/screens/products/partials/ProductHeader";
import EconomicFactorIcon from "@/components/svgs/economicFactorIcon";
import EnvironmentalFactorIcon from "@/components/svgs/environmentalFactorIcon";
import SocialFactorIcon from "@/components/svgs/socialFactorIcon";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";

type Props = NativeStackScreenProps<CommonStackParamList, 'ProductScoreDetails'>;

export default function ProductScoreDetailsScreen({route, navigation}: Props) {
    const {id, category} = route.params;
    const {product} = useProductStore();
    const [categoryScore, setCategoryScore] = useState<CategoryScore>();
    const [selectedIndicatorIndex, setSelectedIndicatorIndex] = useState<number | null>(null);
    const [factorScore, setFactorScore] = useState<FactorScore>();
    const [factors, setFactors] = useState<FactorScore[]>([]);

    if (!product) {
        return <></>;
    }

    const fetchScoreDetail = async () => {
        await productService.fetchDetailedScore(product.id)
            .then((response) => {
                let factors = response.filter(factor => factor.factor !== id)
                let factor = response.filter(factor => factor.factor === id)[0]
                let selectedCategory = factor.categories.filter(categoryLoop => categoryLoop.name === category)[0]

                if (factor) {
                    setFactors(factors)
                    setFactorScore(factor)
                    setCategoryScore(selectedCategory)
                }
            });
    };

    function getIcon(factorScore: FactorScore) {
        return <>
            {factorScore.factor === Factor.Economic && <EconomicFactorIcon width={16} height={16}/>}
            {factorScore.factor === Factor.Environmental && <EnvironmentalFactorIcon width={20} height={16}/>}
            {factorScore.factor === Factor.Social && <SocialFactorIcon width={20} height={18}/>}
        </>;
    }

    useEffect(() => {
        fetchScoreDetail();
    }, []);


    return (
        <ScrollView className={'px-4'}>
            {factorScore && (
                <Pressable
                    className="mt-4 bg-white rounded-xl flex flex-row items-center overflow-hidden"
                    onPress={() => navigation.replace('ProductScore', {id: factorScore.factor})}
                >
                    <View
                        className="flex-none items-center justify-center rounded-lg w-14 h-14"
                        style={{backgroundColor: factorScore.color}}
                    >
                        <FontAwesome name={'chevron-left'} color={'white'} size={18} />
                    </View>
                    <View className="grow shrink flex-row items-center justify-between px-4">
                        <Text className={'font-bold'}>{factorScore.name}</Text>
                    </View>
                </Pressable>
            )}

            {(categoryScore && categoryScore.indicators) && (
                <>
                    <Text className="mt-4 font-bold text-xl">{categoryScore.name}</Text>
                    <View className={'mt-4 gap-2'}>
                        {categoryScore.indicators.map((indicator, index) => {
                            return (
                                <ListItem key={index} indicator={indicator} />
                            );
                        })}
                    </View>
                </>
            )}

            <View className={'mb-4 border-t border-gray-200 mt-6 pt-6 gap-2'}>
                {factors.map((factorScore, index) => (
                    <Pressable
                        key={index}
                        className="bg-white rounded-lg flex flex-row items-center"
                        onPress={() => navigation.replace('ProductScore', {id: factorScore.factor})}
                    >
                        <View
                            className="flex items-center justify-center rounded-lg w-14 h-14"
                            style={{backgroundColor: factorScore.color}}
                        >
                            {getIcon(factorScore)}
                        </View>
                        <View className="flex flex-row items-center justify-between flex-grow px-4">
                            <Text className="font-bold">{factorScore.name}</Text>
                            <FontAwesome name="chevron-right" size={12}/>
                        </View>
                    </Pressable>
                ))}
            </View>
        </ScrollView>
    );
}

const ListItem = ({indicator}: {
    indicator: IndicatorScore,
}) => {
    const [expanded, setExpanded] = useState(false);

    const onItemPress = () => {
        if (! indicator.description) {
            return
        }
        setExpanded(!expanded);
    };

    const textColor = indicator.color === '#dddddd' ? 'black' : 'white';

    return (
        <View className={'bg-white rounded-xl '}>
            <TouchableOpacity
                onPress={onItemPress}
                disabled={!indicator.description}
                className="flex flex-row items-center overflow-hidden"
            >
                <View
                    className="flex-none items-center justify-center rounded-lg w-14 h-14"
                    style={{backgroundColor: indicator.color}}
                >
                    <Text
                        style={{color: textColor}}
                        className="text-white font-bold"
                    >{indicator.score.toLocaleString('es-ES')}</Text>
                </View>
                <View className="grow shrink flex-row items-center justify-between px-4">
                    <Text className={'grow'}>{indicator.name}</Text>
                    {indicator.description && (
                        <FontAwesome className={'shrink-0'} name={expanded ? 'chevron-up' : 'chevron-down'} size={14} />
                    )}
                </View>
            </TouchableOpacity>
            <CollapsableContainer expanded={expanded}>
                <View className={'p-4'}>
                    <Text>{indicator.description}</Text>
                </View>
            </CollapsableContainer>
        </View>
    );
};

const CollapsableContainer = ({children, expanded,}: {
    children: React.ReactNode;
    expanded: boolean;
}) => {
    const [height, setHeight] = useState(0);
    const animatedHeight = useSharedValue(0);

    const onLayout = (event: LayoutChangeEvent) => {
        const onLayoutHeight = event.nativeEvent.layout.height;

        if (onLayoutHeight > 0 && height !== onLayoutHeight) {
            setHeight(onLayoutHeight);
        }
    };

    const collapsableStyle = useAnimatedStyle(() => {
        animatedHeight.value = expanded ? withTiming(height) : withTiming(0);

        return {
            height: animatedHeight.value,
        };
    }, [expanded, height]);

    return (
        <Animated.View style={[collapsableStyle, {overflow: "hidden"}]}>
            <View style={{position: "absolute"}} onLayout={onLayout}>
                {children}
            </View>
        </Animated.View>
    );
};
