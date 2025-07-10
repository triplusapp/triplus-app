import useLocalization from "@/src/i18n/useLocalization";

import React, {useState} from "react";
import {Alert, Text, View} from "react-native";
import {userService} from "@/src/api/services/userService";
import {ApiResponseError} from "@/src/api/core/apiResponseError";
import LogoVertical from "@/components/svgs/logoVertical";
import TextInput from "@/components/forms/TextInput";
import PrimaryButton from "@/components/forms/PrimaryButton";


export default function ForgotPasswordScreen() {
    const { i18n } = useLocalization();

    return (
        <View className="justify-between grow py-20 px-4">
            <View className="items-center">
                <LogoVertical width={103} height={72} />
                <Text className="mt-5 font-bold text-3xl text-center">{i18n.t('auth.forgot_password_page.title')}</Text>
                <Text className={'text-gray-500 mt-5 text-center'}>{i18n.t('auth.forgot_password_page.subtitle')}</Text>
                <View className={'mt-5 w-full'}>
                    <ForgotPasswordForm />
                </View>
            </View>
        </View>
    );
}

function ForgotPasswordForm() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { i18n } = useLocalization();
    const handleForgotPassword = async () => {
        setIsLoading(true);
        try {
            const response = await userService.forgotPassword(email);
            Alert.alert(i18n.t('auth.forgot_password_page.message_sent.title'), i18n.t('auth.forgot_password_page.message_sent.message'))
            setEmail('')
        } catch (responseError) {
            if (responseError instanceof ApiResponseError) {
                console.log(responseError.statusCode);
                console.error(responseError.message);
                console.log(responseError.errors);
            } else {
                console.error("Unexpected error:", responseError);
            }
            return;
        } finally {
            setIsLoading(false);
        }

    };

    return (
        <View className="flex gap-4 px-6">
            <TextInput
                onChangeText={text => setEmail(text)}
                autoCapitalize="none"
                value={email}
                placeholder={i18n.t('auth.fields.email')}
            />
            <PrimaryButton
                handleSubmit={handleForgotPassword}
                disabled={isLoading}
                text={i18n.t('auth.forgot_password_page.submit')}
            />
        </View>
    );
}
