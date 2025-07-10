import {LayoutChangeEvent, Pressable, Text, View} from 'react-native';
import React, {useEffect, useState} from "react";
import {faqsService} from "@/src/api/services/faqsService";
import {Faq, FaqCategory} from "@/src/types/faqs";
import {GestureHandlerRootView, NativeViewGestureHandler, TouchableWithoutFeedback} from "react-native-gesture-handler";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import i18n from "@/src/i18n";
import Title from "@/components/screens/Title";
import useLocalization from "@/src/i18n/useLocalization";
import * as Linking from "expo-linking";
import Toast from "react-native-root-toast";
import * as WebBrowser from "expo-web-browser";
import type {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/navigation";

type Props = NativeStackScreenProps<RootStackParamList, 'Faqs'>;

export default function FaqsScreen({navigation}: Props) {
    const { i18n } = useLocalization();

    // const [faqCategories, setFaqCategories] = useState<FaqCategory[]>([]);
    //
    // const fetchData = async () => {
    //     let faqs = await faqsService.fetchFaqs();
    //     setFaqCategories(faqs)
    // };
    //
    // useEffect(() => {
    //     fetchData();
    // }, []);
    const openWeb = async (href: string) => {
        WebBrowser.openBrowserAsync(href);
    };

    return (
        <GestureHandlerRootView>
            <NativeViewGestureHandler>
                <View className={'mt-8 gap-8'}>
                    <View className={'gap-4 px-4'}>
                        <View className={'gap-6'}>
                            <Title text={i18n.t('faqs.title')}/>
                            <Text>{ i18n.t('faqs.p1') }</Text>
                            <Text>{ i18n.t('faqs.p2') }</Text>
                            <View className={'flex-row flex-wrap gap-x-1'}>
                                <Text>{ i18n.t('faqs.p31') }</Text>
                                <Pressable
                                    onPress={() => openWeb('https://triplus.app/preguntes-frequents/')}
                                >
                                    <Text className={'underline'}>{ i18n.t('faqs.p32') }</Text>
                                </Pressable>
                                <Text>{ i18n.t('faqs.p33') }</Text>
                                <Pressable
                                    onPress={() => navigation.navigate('Contact')}
                                >
                                    <Text className={'underline'}>{ i18n.t('faqs.p34') }</Text>
                                </Pressable>
                                <Text>{ i18n.t('faqs.p35') }</Text>
                            </View>
                        </View>
                        {/*{faqCategories.length > 0 ? (*/}
                        {/*    <View className={'gap-4'}>*/}
                        {/*        {faqCategories.map((faqCategory: FaqCategory, index: number) => (*/}
                        {/*            <View className={'bg-white rounded-xl'} key={index}>*/}
                        {/*                <Text className={'p-4 text-xl font-bold'}>{faqCategory.name}</Text>*/}
                        {/*                <View className={''}>*/}
                        {/*                    {faqCategory.faqs.map((faq: Faq, index: number) => (*/}
                        {/*                        <View className={'border-t border-t-brand-bg px-4 py-3'}>*/}
                        {/*                            <ListItem item={faq}/>*/}
                        {/*                        </View>*/}
                        {/*                    ))}*/}
                        {/*                </View>*/}

                        {/*            </View>*/}
                        {/*        ))}*/}
                        {/*    </View>*/}
                        {/*) : (*/}
                        {/*    <View>*/}
                        {/*        <Text>{i18n.t('faqs.blank_state')}</Text>*/}
                        {/*    </View>*/}
                        {/*)}*/}
                    </View>
                </View>
            </NativeViewGestureHandler>
        </GestureHandlerRootView>
    );
}

// export const ListItem = ({item}: { item: Faq }) => {
//     const [expanded, setExpanded] = useState(false);
//
//     const onItemPress = () => {
//         setExpanded(!expanded);
//     };
//
//     return (
//         <View>
//             <TouchableWithoutFeedback onPress={onItemPress}>
//                 <Text className={''}>{item.question}</Text>
//             </TouchableWithoutFeedback>
//             <CollapsableContainer expanded={expanded}>
//                 <Text className={'mt-2'}>{item.answer}</Text>
//             </CollapsableContainer>
//         </View>
//     );
// };
//
// export const CollapsableContainer = ({children, expanded,}: {
//     children: React.ReactNode;
//     expanded: boolean;
// }) => {
//     const [height, setHeight] = useState(0);
//     const animatedHeight = useSharedValue(0);
//
//     const onLayout = (event: LayoutChangeEvent) => {
//         const onLayoutHeight = event.nativeEvent.layout.height;
//
//         if (onLayoutHeight > 0 && height !== onLayoutHeight) {
//             setHeight(onLayoutHeight);
//         }
//     };
//
//     const collapsableStyle = useAnimatedStyle(() => {
//         animatedHeight.value = expanded ? withTiming(height) : withTiming(0);
//
//         return {
//             height: animatedHeight.value,
//         };
//     }, [expanded, height]);
//
//     return (
//         <Animated.View style={[collapsableStyle, {overflow: "hidden"}]}>
//             <View style={{position: "absolute"}} onLayout={onLayout}>
//                 {children}
//             </View>
//         </Animated.View>
//     );
// };
