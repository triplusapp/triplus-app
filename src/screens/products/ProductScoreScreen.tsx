import React, {useEffect, useState} from "react";
import {Pressable, ScrollView, Text, View} from "react-native";
import {useProductStore} from "@/src/stores/productStore";
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import {Factor, FactorScore} from "@/src/types/product";
import {productService} from "@/src/api/services/productService";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {CommonStackParamList} from "@/src/navigation/BottomTabNavigator";
import ProductHeader from "@/src/screens/products/partials/ProductHeader";
import EconomicFactorIcon from "@/components/svgs/economicFactorIcon";
import EnvironmentalFactorIcon from "@/components/svgs/environmentalFactorIcon";
import SocialFactorIcon from "@/components/svgs/socialFactorIcon";

type Props = NativeStackScreenProps<CommonStackParamList, 'ProductScore'>;

export default function ProductScoreScreen({route, navigation}: Props) {
    const {id} = route.params;
    const {product} = useProductStore();
    const [factorScore, setFactorScore] = useState<FactorScore>();
    const [factors, setFactors] = useState<FactorScore[]>([]);

    if (!product) {
        return <></>;
    }

    const fetchScoreDetail = async () => {
        await productService.fetchDetailedScore(product.id)
            .then((response) => {
                let factors = response.filter(factor => factor.factor !== id)
                let factor = response.filter(factor => factor.factor === id)

                setFactors(factors)

                if (factor) {
                    setFactorScore(factor[0])
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
            {(factorScore && factorScore.categories) && (
            <View className={'mt-5'}>
                <Text className="font-bold text-xl">{factorScore.name}</Text>
                <View className={'mt-4 gap-2'}>
                {factorScore.categories.map((category, index) => (
                    <View key={index}>
                        <Pressable
                            className="bg-white rounded flex flex-row items-center"
                            onPress={() => navigation.replace('ProductScoreDetails', {id: factorScore.factor, category: category.name})}
                        >
                            <View className="flex items-center justify-center rounded-lg w-14 h-14"
                                  style={{backgroundColor: category.color}}>
                                <Text className="text-white font-bold">{category.score.toLocaleString('es-ES') }</Text>
                            </View>
                            <View className="flex flex-row items-center justify-between flex-grow px-4">
                                <Text>{category.name}</Text>
                                <FontAwesome name="chevron-right" size={12}/>
                            </View>
                        </Pressable>
                    </View>
                ))}
                </View>
            </View>
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

