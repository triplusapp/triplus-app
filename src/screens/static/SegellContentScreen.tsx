import {Pressable, ScrollView, Text, View} from 'react-native';
import React from "react";
import i18n from "@/src/i18n";
import type {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/navigation";
import Title from "@/components/screens/Title";
import useLocalization from "@/src/i18n/useLocalization";

type Props = NativeStackScreenProps<RootStackParamList, 'SegellContent'>;

export default function SegellContentScreen({navigation}: Props) {
    const {i18n} = useLocalization();

    return (
        <ScrollView>
            <View className={'pb-10 mt-6 px-4 pt-4 gap-6'}>
                <Text className={'font-bold text-lg leading-6'}>{i18n.t('segell_triplus_page.t1')}</Text>
                <Text>{i18n.t('segell_triplus_page.p1')}</Text>

                <Text className={'font-bold text-lg leading-6'}>{i18n.t('segell_triplus_page.t2')}</Text>
                <Text>{i18n.t('segell_triplus_page.p2')}</Text>

                <Text className={'font-bold text-lg leading-6'}>{i18n.t('segell_triplus_page.t3')}</Text>
                <Text>{i18n.t('segell_triplus_page.p3')}</Text>

                <Text className={'font-bold text-lg leading-6'}>{i18n.t('segell_triplus_page.t4')}</Text>
                <Text>{i18n.t('segell_triplus_page.p4')}</Text>

                <View className={'gap-2'}>
                    <View className={'flex-row gap-2'}>
                        <Text>{'\u2022'}</Text>
                        <Text>
                            <Text className={'font-bold'}>{i18n.t('segell_triplus_page.p4l1t')}</Text>
                            <Text>{i18n.t('segell_triplus_page.p4l1p')}</Text>
                        </Text>
                    </View>
                    <View className={'flex-row gap-2'}>
                        <Text>{'\u2022'}</Text>
                        <Text>
                            <Text className={'font-bold'}>{i18n.t('segell_triplus_page.p4l2t')}</Text>
                            <Text>{i18n.t('segell_triplus_page.p4l2p')}</Text>
                        </Text>
                    </View>
                    <View className={'flex-row gap-2'}>
                        <Text>{'\u2022'}</Text>
                        <Text>
                            <Text className={'font-bold'}>{i18n.t('segell_triplus_page.p4l3t')}</Text>
                            <Text>{i18n.t('segell_triplus_page.p4l3p')}</Text>
                        </Text>
                    </View>
                </View>

                <Text className={'font-bold text-lg leading-6'}>{i18n.t('segell_triplus_page.t5')}</Text>
                <Text>{i18n.t('segell_triplus_page.p5')}</Text>

                <Text className={'font-bold text-lg leading-6'}>{i18n.t('segell_triplus_page.t6')}</Text>
                <Text>{i18n.t('segell_triplus_page.p6')}</Text>
            </View>
        </ScrollView>
    );
}
