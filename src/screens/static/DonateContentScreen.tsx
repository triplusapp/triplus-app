import {Pressable, ScrollView, Text, View} from 'react-native';
import React from "react";
import i18n from "@/src/i18n";
import type {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/navigation";
import Title from "@/components/screens/Title";
import useLocalization from "@/src/i18n/useLocalization";
import PrimaryButton from "@/components/forms/PrimaryButton";
import * as WebBrowser from "expo-web-browser";

type Props = NativeStackScreenProps<RootStackParamList, 'DonateContent'>;

export default function DonateContentScreen({navigation}: Props) {
    const {i18n} = useLocalization();

    const openWeb = async (href: string) => {
        WebBrowser.openBrowserAsync(href);
    };

    return (
        <ScrollView>
            <View className={'mt-6 px-4 pt-4 gap-6'}>
                <Text className={'font-bold text-lg leading-6'}>{i18n.t('donate_page.t1')}</Text>
                <Text>{i18n.t('donate_page.p1')}</Text>
                <Text>{i18n.t('donate_page.p2')}</Text>
                <Text>{i18n.t('donate_page.p3')}</Text>
                <Text>{i18n.t('donate_page.p4')}</Text>
                <PrimaryButton
                    text={i18n.t('donate_page.button')}
                    handleSubmit={() => openWeb('https://triplus.app/donatiu/')}
                />
                <Text className={'italic'}>{i18n.t('donate_page.p5')}</Text>
            </View>
        </ScrollView>
    );
}
