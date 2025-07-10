import useLocalization from "@/src/i18n/useLocalization";

import React, {ReactNode, useEffect, useState} from "react";
import {Alert, Pressable, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {useProductStore} from "@/src/stores/productStore";
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import {
    Escandall,
    Factor,
    FactorScore,
    Ingredient,
    MaterialGeneticIndicator,
    ModelRamaderIndicator, Product
} from "@/src/types/product";
import {productService} from "@/src/api/services/productService";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {CommonStackParamList, ScannerStackNavigation} from "@/src/navigation/BottomTabNavigator";
import ProductHeader from "@/src/screens/products/partials/ProductHeader";
import EconomicFactorIcon from "@/components/svgs/economicFactorIcon";
import EnvironmentalFactorIcon from "@/components/svgs/environmentalFactorIcon";
import SocialFactorIcon from "@/components/svgs/socialFactorIcon";
import {Image, ImageLoadEventData} from "expo-image";
import AdnIcon from "@/components/svgs/adnIcon";
import CowIcon from "@/components/svgs/cowIcon";
import ChickenIcon from "@/components/svgs/chickenIcon";
import GoatIcon from "@/components/svgs/goatIcon";
import HorseIcon from "@/components/svgs/horseIcon";
import PigIcon from "@/components/svgs/pigIcon";
import RabbitIcon from "@/components/svgs/rabbitIcon";
import SheepIcon from "@/components/svgs/sheepIcon";
import ThemedModal from "@/components/forms/ThemedModal";
import TextInput from "@/components/forms/TextInput";
import PrimaryButton from "@/components/forms/PrimaryButton";
import {ApiResponseError} from "@/src/api/core/apiResponseError";
import PieChart from "react-native-pie-chart";
import ProductListCarousel from "@/components/products/_list-carousel";
import {useAuth} from "@/src/auth";
import i18n from "@/src/i18n";
import VeganIcon from "@/components/svgs/features/vegan";
import VegetarianIcon from "@/components/svgs/features/vegetarian";
import GlutenFreeIcon from "@/components/svgs/features/glutenFree";
import OrganicIcon from "@/components/svgs/features/organic";
import BiodynamicIcon from "@/components/svgs/features/biodynamic";
import FairTradeIcon from "@/components/svgs/features/fairTrade";
import {Hint} from "react-native-ui-lib";
import brandColors from "@/assets/colors";
import {useNavigation} from "@react-navigation/native";
import {StackNavigation} from "@/src/navigation";
import SearchIcon from "@/components/svgs/searchIcon";

type Props = NativeStackScreenProps<CommonStackParamList, 'Product'>;

const modelRamaderIconComponents: { [key: string]: React.FC<{ width: number; height: number; color: string }> } = {
    chicken: ChickenIcon,
    cow: CowIcon,
    goat: GoatIcon,
    horse: HorseIcon,
    pig: PigIcon,
    rabbit: RabbitIcon,
    sheep: SheepIcon,
};

export default function ProductScreen({route, navigation}: Props) {
    const {id} = route.params;

    const {i18n} = useLocalization();
    const [product, setProduct] = useState<Product>();
    const {isAuthenticated} = useAuth();

    const [reportModalVisible, setReportModalVisible] = useState<boolean>(false);
    const [reportMessage, setReportMessage] = useState<string|null>(null);

    const [showMapModal, setShowMapModal] = useState<boolean>(false);
    const [showStampModal, setShowStampModal] = useState<boolean>(false);
    const [showMaterialGenericModal, setShowMaterialGenericModal] = useState<boolean>(false);
    const [showModelRamaderModal, setShowModelRamaderModal] = useState<boolean>(false);
    const [showEscandallModal, setShowEscandallModal] = useState<boolean>(false);

    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [factorScore, setFactorScore] = useState<FactorScore[]>([]);
    const [escandall, setEscandall] = useState<Escandall[] | null>(null);
    const [modelRamaderIndicator, setModelRamaderIndicator] = useState<ModelRamaderIndicator | null>(null);
    const [mapImageUrl, setMapImageUrl] = useState<string | null>(null);
    const [materialGeneticIndicator, setMaterialGeneticIndicator] = useState<MaterialGeneticIndicator | null>(null);

    const [pieSeries, setPieSeries] = useState<number[]>([]);
    const [pieSliceColor, setPieSliceColor] = useState<string[]>([]);

    const fetchProduct = async () => {
        await productService.fetchProduct(id, isAuthenticated ?? false)
            .then((response) => {
                setProduct(response)
            });
    };

    const fetchIngredients = async () => {
        await productService.fetchIngredients(id)
            .then((response) => setIngredients(response));
    };
    const fetchDescriptiveIndicators = async () => {
        await productService.fetchDescriptiveIndicators(id)
            .then(function (response) {
                if (response.escandall !== null && response.escandall.length > 0) {
                    setPieSeries(response.escandall.map((escandall: Escandall) => escandall.percentage))
                    setPieSliceColor(response.escandall.map((escandall: Escandall) => escandall.color))
                    setEscandall(response.escandall);
                }
                if (response.map_image_url) {
                    setMapImageUrl(response.map_image_url);
                }
                if (response.material_genetic) {
                    setMaterialGeneticIndicator(response.material_genetic);
                }
                if (response.model_ramader) {
                    setModelRamaderIndicator(response.model_ramader);
                }
            });
    };

    const fetchScoreDetail = async () => {
        await productService.fetchDetailedScore(id)
            .then((response) => setFactorScore(response));
    };

    function getIcon(factorScore: FactorScore) {
        return <>
            {factorScore.factor === Factor.Economic && <EconomicFactorIcon width={16} height={16}/>}
            {factorScore.factor === Factor.Environmental && <EnvironmentalFactorIcon width={20} height={16}/>}
            {factorScore.factor === Factor.Social && <SocialFactorIcon width={20} height={18}/>}
        </>;
    }

    useEffect(() => {
        fetchProduct()
        fetchIngredients();
        fetchScoreDetail();
        fetchDescriptiveIndicators();
    }, []);

    const [aspectRatio, setAspectRatio] = useState(1);

    const handleReportSubmit = async () => {
        if (! product) {
            setReportMessage(null);
            setReportModalVisible(false);
            return;
        }

        try {
            await productService.reportProduct(
                product.id, reportMessage
            );
            Alert.alert(i18n.t('product.report.successful_messages.title'), i18n.t('product.report.successful_messages.message'));
            setReportMessage(null);
            setReportModalVisible(false);
        } catch (responseError) {
            if (responseError instanceof ApiResponseError) {
                console.log(responseError.statusCode);
                Alert.alert('Error', responseError.message);
                console.log(responseError.errors);
            } else {
                console.error("Unexpected error:", responseError);
                console.log(responseError);
            }
        }
    };

    const handleImageLoad = (event: ImageLoadEventData) => {
        setAspectRatio(event.source.width / event.source.height);
    };
    const hideMapModal = () => setShowMapModal(false);
    const hideStampModal = () => setShowStampModal(false);
    const hideMaterialGenericModal = () => setShowMaterialGenericModal(false);
    const hideModelRamaderModal = () => setShowModelRamaderModal(false);
    const hideEscandallModal = () => setShowEscandallModal(false);

    if (!product) {
        return <></>;
    }

    return (
        <ScrollView className={'flex-1 mt-4 px-4'}>
            <ProductHeader product={product} navigation={navigation}/>

            {product.features && Object.keys(product.features).length > 0 && (
                <View className={'py-2 flex-row gap-2'}>
                    {product.features.vegan && (
                        <IconHint
                            hintText={i18n.t('product.feature_hints.vegan')}
                            icon={<VeganIcon width={32} height={32}/>}
                        />
                    )}
                    {product.features.vegetarian && (
                        <IconHint
                            hintText={i18n.t('product.feature_hints.vegetarian')}
                            icon={<VegetarianIcon width={32} height={32}/>}
                        />
                    )}
                    {product.features.gluten_free && (
                        <IconHint
                            hintText={i18n.t('product.feature_hints.gluten_free')}
                            icon={<GlutenFreeIcon width={32} height={32}/>}
                        />
                    )}
                    {product.features.organic && (
                        <IconHint
                            hintText={i18n.t('product.feature_hints.organic')}
                            icon={<OrganicIcon width={32} height={32}/>}
                        />
                    )}
                    {product.features.biodynamic && (
                        <IconHint
                            hintText={i18n.t('product.feature_hints.biodynamic')}
                            icon={<BiodynamicIcon width={32} height={32}/>}
                        />
                    )}
                    {product.features.fair_trade && (
                        <IconHint
                            hintText={i18n.t('product.feature_hints.fair_trade')}
                            icon={<FairTradeIcon width={32} height={32}/>}
                        />
                    )}
                </View>
            )}

            <Text className="mt-2.5">{product.description}</Text>

            <View className={'mt-4'}>
                <View className={'flex-row gap-2 items-center'}>
                    <Text className={'font-bold text-xl'}>{i18n.t('product.stamp')}</Text>
                    <TouchableOpacity onPress={() => setShowStampModal(true)}>
                        <FontAwesome name="circle-info" size={20} />
                    </TouchableOpacity>
                    <StampModal visible={showStampModal} onRequestClose={hideStampModal} />
                </View>
                <View className={'items-center'}>
                <Image
                    placeholder={require("@/assets/images/image-placeholder.png")}
                    source={{uri: product.stamp}}
                    style={{
                        height: 120,
                        width: 120,
                        marginTop: 10,
                    }}
                />
                </View>
            </View>

            <View className={'mt-8'}>
                <View className="gap-2">
                    {factorScore.map((factorScore, index) => (
                        <Pressable
                            key={index}
                            className="bg-white rounded-lg flex flex-row items-center"
                            onPress={() => navigation.push('ProductScore', {id: factorScore.factor})}
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
            </View>

            <ThemedModal visible={reportModalVisible} onRequestClose={() => setReportModalVisible(false)}>
                <FontAwesome name="circle-info" size={20}/>
                <Text className="font-bold">{i18n.t('product.report.form.title')}</Text>
                <TextInput
                    onChangeText={text => setReportMessage(text)}
                    value={reportMessage ?? ''}
                    multiline={true}
                    placeholder={i18n.t('product.report.form.comment')}
                />
                <PrimaryButton text="Envia" handleSubmit={handleReportSubmit}/>
                <Pressable
                    className="px-4 py-2"
                    onPress={() => setReportModalVisible(false)}>
                    <Text className="text-brand-green font-bold">{i18n.t('product.report.form.close')}</Text>
                </Pressable>
            </ThemedModal>

            <View
                className={'mt-8 gap-8'}
            >
                {(mapImageUrl) && (
                    <View className={''}>
                        <View className={'flex-row gap-2 items-center'}>
                            <Text className={'font-bold text-xl'}>{i18n.t('product.map')}</Text>
                            <TouchableOpacity onPress={() => setShowMapModal(true)}>
                                <FontAwesome name="circle-info" size={20} />
                            </TouchableOpacity>
                            <MapModal visible={showMapModal} onRequestClose={hideMapModal} />
                        </View>
                        <Image
                            placeholder={require("@/assets/images/image-placeholder.png")}
                            source={{uri: mapImageUrl}}
                            style={{
                                width: '100%',
                                aspectRatio,
                            }}
                            onLoad={handleImageLoad}
                            contentFit="contain"
                        />
                    </View>
                )}

                {(materialGeneticIndicator) && (
                    <View>
                        <View className={'flex-row gap-2 items-centere'}>
                            <Text className="font-bold text-xl">{i18n.t('product.genetic_material')}</Text>
                            <TouchableOpacity onPress={() => setShowMaterialGenericModal(true)}>
                                <FontAwesome name="circle-info" size={20} />
                            </TouchableOpacity>
                            <MaterialGenericModal visible={showMaterialGenericModal} onRequestClose={hideMaterialGenericModal} />
                        </View>
                        <View className="mt-4 flex flex-row items-center bg-white rounded-xl">
                            <AdnIcon width={70} height={70} color={materialGeneticIndicator.color}></AdnIcon>
                            <View>
                                <Text className={'font-semibold'}>{i18n.t('product.genetic_material')}</Text>
                                <Text className={'text-sm'}>{i18n.t('product.genetic_material_info')} {materialGeneticIndicator.info}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {modelRamaderIndicator && (() => {
                    const IconComponent = modelRamaderIconComponents[modelRamaderIndicator.icon];
                    return IconComponent ? (
                        <View>
                            <View className={'flex-row items-center gap-2'}>
                                <Text className="font-bold text-xl">{i18n.t('product.model_ramader')}</Text>
                                <TouchableOpacity onPress={() => setShowModelRamaderModal(true)}>
                                    <FontAwesome name="circle-info" size={20} />
                                </TouchableOpacity>
                                <ModelRamaderModal visible={showModelRamaderModal} onRequestClose={hideModelRamaderModal} />
                            </View>
                            <View className="mt-2 flex flex-row items-center bg-white rounded-xl">
                                <IconComponent width={70} height={70} color={modelRamaderIndicator.color}/>
                                <View>
                                    <Text className={'font-semibold'}>{i18n.t('product.model_ramader')}</Text>
                                    <Text className={'text-sm'}>{modelRamaderIndicator.info}</Text>
                                </View>
                            </View>
                        </View>
                    ) : null;
                })()}

                {(escandall && pieSeries.length > 0 && pieSliceColor.length > 0) && (
                    <View className={''}>
                        <View className={'flex-row gap-2 items-center'}>
                            <Text className={'font-bold text-xl'}>{i18n.t('product.escandall')}</Text>
                            <TouchableOpacity onPress={() => setShowEscandallModal(true)}>
                                <FontAwesome name="circle-info" size={20} />
                            </TouchableOpacity>
                            <EscandallModal visible={showEscandallModal} onRequestClose={hideEscandallModal} />
                        </View>
                        <PieChart
                            widthAndHeight={250}
                            style={{marginHorizontal: 'auto', marginBottom: 20, marginTop: 10}}
                            series={pieSeries}
                            sliceColor={pieSliceColor}
                        />
                        {escandall.map((escandallItem: Escandall) => (
                            <View
                                key={escandallItem.label}
                                className={'flex flex-row items-center gap-1'}
                            >
                                <View className={'h-4 w-4 rounded-full'} style={{ backgroundColor: escandallItem.color}}></View>
                                <Text>{escandallItem.label}: {escandallItem.percentage}%</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>


            <Text className="mt-8 font-bold text-xl">{i18n.t('product.ingredients')}</Text>
            <View className="mt-4 bg-white rounded-xl">
                {ingredients.map((ingredient, index) => (
                    <Text className="px-4 py-4" key={index}>
                        {ingredient.name}
                    </Text>
                ))}
            </View>

            {isAuthenticated && (
                <PrimaryButton
                    text={i18n.t('product.report.btn')}
                    style={{marginTop:36}}
                    handleSubmit={() => setReportModalVisible(true)}
                />
            )}

            <View className={'mt-4'}>
                <Text className="mt-4 mb-4 font-bold text-xl">{i18n.t('product.other_similar_products')}</Text>
                <View className={'-mx-4'}>
                <ProductListCarousel fetchProducts={async () => {
                    return await productService.otherSimilarProducts(product.id)
                }}/>
                </View>
            </View>

            <View className={'mt-4'}>
                <Text className="mt-4 mb-4 font-bold text-xl">{i18n.t('product.more_sustainable_alternatives')}</Text>
                <View className={'-mx-4'}>
                    <ProductListCarousel fetchProducts={async () => {
                        return await productService.moreSustainableAlternatives(product.id)
                    }}/>
                </View>
            </View>

            <View className={'mt-4 mb-12'}>
                <Text className="mt-4 mb-4 font-bold text-xl">{i18n.t('product.other_brand_products')}</Text>
                <View className={'-mx-4'}>
                    <ProductListCarousel fetchProducts={async () => {
                        return await productService.otherBrandProducts(product.id)
                    }}/>
                </View>
            </View>

        </ScrollView>
    );
}

function IconHint({hintText, icon}: { hintText: string, icon: ReactNode }) {
    const [tooltipVisible, setTooltipVisible] = useState(false)

    return (
        <Hint
            color={'white'}
            borderRadius={8}
            enableShadow={true}
            useSideTip={false}
            removePaddings={true}
            style={{
                marginTop: -20,
            }}
            messageStyle={{
                color: brandColors.green,
                padding: 10
            }}
            visible={tooltipVisible} message={hintText} onBackgroundPress={() => setTooltipVisible(false)}>
            <TouchableOpacity
                onPress={() => setTooltipVisible(!tooltipVisible)}
            >
                {icon}
            </TouchableOpacity>
        </Hint>
    )
}

function MapModal({visible, onRequestClose}: {
    visible: boolean;
    onRequestClose: () => void;
}) {
    return (
        <ThemedModal visible={visible} onRequestClose={onRequestClose}>
            <View className={'w-full gap-6'}>
                <Text className={'font-bold'}>{i18n.t('product.modals.map.title')}</Text>
                <Text>{i18n.t('product.modals.map.p1')}</Text>
                <View className={'flex-row gap-2'}>
                    <Text>{'\u2022'}</Text>
                    <Text>{i18n.t('product.modals.map.p21')}</Text>
                </View>
                <View className={'flex-row gap-2'}>
                    <Text>{'\u2022'}</Text>
                    <Text>{i18n.t('product.modals.map.p22')}</Text>
                </View>
                <View className={'flex-row gap-2'}>
                    <Text>{'\u2022'}</Text>
                    <Text>{i18n.t('product.modals.map.p23')}</Text>
                </View>
            </View>

            <Pressable
                className="px-4 py-2"
                onPress={onRequestClose}>
                <Text className="text-brand-green font-bold">{i18n.t('pending_validation_product.go_back')}</Text>
            </Pressable>
        </ThemedModal>
    );
}

function StampModal({visible, onRequestClose}: {
    visible: boolean;
    onRequestClose: () => void;
}) {
    return (
        <ThemedModal visible={visible} onRequestClose={onRequestClose}>
            <View className={'w-full gap-6'}>
                <Text className={'font-bold'}>{i18n.t('product.modals.stamp.title')}</Text>
                <Text>{i18n.t('product.modals.stamp.p1')}</Text>
                <View className={'flex-row gap-2'}>
                    <Text>{'\u2022'}</Text>
                    <Text>{i18n.t('product.modals.stamp.li1')}</Text>
                </View>
                <View className={'flex-row gap-2'}>
                    <Text>{'\u2022'}</Text>
                    <Text>{i18n.t('product.modals.stamp.li2')}</Text>
                </View>
                <Text>{i18n.t('product.modals.stamp.p2')}</Text>
                <Text>{i18n.t('product.modals.stamp.p3')}</Text>
            </View>

            <Pressable
                className="px-4 py-2"
                onPress={onRequestClose}>
                <Text className="text-brand-green font-bold">{i18n.t('pending_validation_product.go_back')}</Text>
            </Pressable>
        </ThemedModal>
    );
}

function MaterialGenericModal({visible, onRequestClose}: {
    visible: boolean;
    onRequestClose: () => void;
}) {

    return (
        <ThemedModal visible={visible} onRequestClose={onRequestClose}>
            <View className={'w-full gap-6'}>
                <Text className={'font-bold'}>{i18n.t('product.modals.material_genetic.title')}</Text>
                <Text>{i18n.t('product.modals.material_genetic.p1')}</Text>
                <Text>{i18n.t('product.modals.material_genetic.p2')}</Text>
            </View>

            <Pressable
                className="px-4 py-2"
                onPress={onRequestClose}>
                <Text className="text-brand-green font-bold">{i18n.t('pending_validation_product.go_back')}</Text>
            </Pressable>
        </ThemedModal>
    );
}

function ModelRamaderModal({visible, onRequestClose}: {
    visible: boolean;
    onRequestClose: () => void;
}) {

    return (
        <ThemedModal visible={visible} onRequestClose={onRequestClose}>
            <View className={'w-full gap-6'}>
                <Text className={'font-bold'}>{i18n.t('product.modals.model_ramader.title')}</Text>
                <Text>{i18n.t('product.modals.model_ramader.p1')}</Text>
                <Text>{i18n.t('product.modals.model_ramader.p2')}</Text>
            </View>

            <Pressable
                className="px-4 py-2"
                onPress={onRequestClose}>
                <Text className="text-brand-green font-bold">{i18n.t('pending_validation_product.go_back')}</Text>
            </Pressable>
        </ThemedModal>
    );
}

function EscandallModal({visible, onRequestClose}: {
    visible: boolean;
    onRequestClose: () => void;
}) {

    return (
        <ThemedModal visible={visible} onRequestClose={onRequestClose}>
            <View className={'w-full gap-6'}>
                <Text className={'font-bold'}>{i18n.t('product.modals.escandall.title')}</Text>
                <Text>{i18n.t('product.modals.escandall.p1')}</Text>
                <Text>{i18n.t('product.modals.escandall.p2')}</Text>
            </View>

            <Pressable
                className="px-4 py-2"
                onPress={onRequestClose}>
                <Text className="text-brand-green font-bold">{i18n.t('pending_validation_product.go_back')}</Text>
            </Pressable>
        </ThemedModal>
    );
}
