import {Pressable, Text, View} from 'react-native';
import React from "react";
import * as Linking from "expo-linking";
import Toast from "react-native-root-toast";
import * as WebBrowser from "expo-web-browser";
import type {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/navigation";
import Title from "@/components/screens/Title";

type Props = NativeStackScreenProps<RootStackParamList, 'LegalContent'>;

export default function LegalContentScreen({navigation}: Props) {
    const openWeb = async (href: string) => {
        WebBrowser.openBrowserAsync(href);
    };

    return (
        <View className={'mt-6 px-4 pt-4 gap-6'}>
            <Title text={'Informació general'} />
            <Text>
                El titular d’aquesta aplicació és el COL·LECTIU EIXARCOLANT (G66832981), una entitat sense ànim de lucre, inscrita al Registre General d’Associacions de la Generalitat de Catalunya amb el número 58994, domicili social al c/ Dr. Pujades, 64, 4t 1a, Igualada, 08700, i correu de contacte info@eixarcolant.cat.
            </Text>
            <Title text={'Condicions d’ús, política de privacitat i de cookies'} />
            <Text className={'flex-row flex-wrap items-center gap-1'}>
                <Text>Tota aquesta informació la trobaràs al següent enllaç:</Text>
                <Pressable
                    onPress={() => openWeb('https://triplus.app/condicions-us-i-politica-privacitat-app-triplus')}
                >
                    <Text className={'underline'}>«Condicions generals per a l’ús de l’aplicació Triplus».</Text>
                </Pressable>
            </Text>
            <View className={'flex-row items-center gap-1'}>
                <Text>En cas de dubte,</Text>
                <Pressable
                    onPress={() => navigation.navigate('Contact')}
                >
                    <Text className={'underline'}>contacta'ns.</Text>
                </Pressable>
            </View>
        </View>
    );
}
