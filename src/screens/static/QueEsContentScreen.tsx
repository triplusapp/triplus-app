import {Pressable, ScrollView, Text, View} from 'react-native';
import React from "react";
import i18n from "@/src/i18n";
import type {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/navigation";
import Title from "@/components/screens/Title";
import useLocalization from "@/src/i18n/useLocalization";

type Props = NativeStackScreenProps<RootStackParamList, 'QueEsContent'>;

export default function QueEsContentScreen({navigation}: Props) {
    const {i18n} = useLocalization();

    return (
        <ScrollView>
            <View className={'mt-6 px-4 pt-4 gap-6'}>
                <Text>
                    <Text className={'font-bold text-lg leading-6'}>{i18n.t('que_es_triplus_page.t1')}</Text>
                    <Text>{i18n.t('que_es_triplus_page.p1')}</Text>
                </Text>
                <Text>
                    <Text className={'font-bold text-lg leading-6'}>{i18n.t('que_es_triplus_page.t2')}</Text>
                    <Text>{i18n.t('que_es_triplus_page.p2')}</Text>
                </Text>
                <Text>
                    <Text className={'font-bold text-lg leading-6'}>{i18n.t('que_es_triplus_page.t3')}</Text>
                    <Text>{i18n.t('que_es_triplus_page.p3')}</Text>
                </Text>
                <Text>
                    <Text className={'font-bold text-lg leading-6'}>{i18n.t('que_es_triplus_page.t4')}</Text>
                    <Text>{i18n.t('que_es_triplus_page.p4')}</Text>
                </Text>
                <Text>
                    <Text className={'font-bold text-lg leading-6'}>{i18n.t('que_es_triplus_page.t5')}</Text>
                    <Text>{i18n.t('que_es_triplus_page.p5')}</Text>
                </Text>
            </View>
        </ScrollView>
    );
}
