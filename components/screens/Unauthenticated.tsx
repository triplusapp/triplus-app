import React from "react";
import {Button, Text, TouchableOpacity, View} from "react-native";
import PrimaryButton from "@/components/forms/PrimaryButton";
import {useNavigation} from "@react-navigation/native";
import {StackNavigation} from "@/src/navigation";
import i18n from "@/src/i18n";

export default function Unauthenticated() {
    const navigation = useNavigation<StackNavigation>();

    return (
        <View className={'px-6 flex-1 gap-6 items-center justify-center'}>
            <Text className={'text-center'}>{i18n.t('unauthenticated.user_required')}</Text>
            <PrimaryButton text={i18n.t('unauthenticated.register_button')} handleSubmit={() => navigation.navigate('Register')} />
            <Text className={'text-center'}>{i18n.t('unauthenticated.login_text')}</Text>
            <TouchableOpacity
                className="bg-white items-center rounded-full px-4 py-2.5 disabled:opacity-50"
                onPress={() => navigation.navigate('Login')}
            >
                <Text>{i18n.t('unauthenticated.login_button')}</Text>
            </TouchableOpacity>
        </View>
    );
};

