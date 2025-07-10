import useLocalization from "@/src/i18n/useLocalization";

import React, {useState} from "react";
import {Alert, Text, View} from "react-native";
import {userService} from "@/src/api/services/userService";
import {ApiResponseError} from "@/src/api/core/apiResponseError";
import LogoVertical from "@/components/svgs/logoVertical";
import TextInput from "@/components/forms/TextInput";
import PrimaryButton from "@/components/forms/PrimaryButton";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {CommonStackParamList} from "@/src/navigation/BottomTabNavigator";
import {RootStackParamList} from "@/src/navigation";
import PasswordInput from "@/components/forms/PasswordInput";

type Props = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;

export default function ResetPasswordScreen({route, navigation}: Props) {
    const {i18n} = useLocalization();
    const {token} = route.params;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleResetPassword = async () => {
        setIsLoading(true);
        try {
            const response = await userService.resetPassword(email, password, token);
            Alert.alert(i18n.t('auth.reset_password_page.password_reset.title'))
            setEmail('');
            setPassword('');
            navigation.navigate('Login');
        } catch (responseError) {
            if (responseError instanceof ApiResponseError) {
                Alert.alert('Error', responseError.message)
                console.log(responseError.statusCode);
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
        <View className="justify-between grow py-20 px-4">
            <View className="items-center">
                <LogoVertical width={103} height={72}/>
                <Text className="mt-5 font-bold text-3xl text-center">{i18n.t('auth.reset_password_page.title')}</Text>
                <Text className={'text-gray-500 mt-5 text-center'}>{i18n.t('auth.reset_password_page.subtitle')}</Text>
                <View className={'mt-5 w-full'}>
                    <View className="flex gap-4 px-6">
                        <TextInput
                            onChangeText={text => setEmail(text)}
                            autoCapitalize="none"
                            value={email}
                            placeholder={i18n.t('auth.fields.email')}
                        />
                        <PasswordInput
                            onChangeText={text => setPassword(text)}
                            autoCapitalize="none"
                            value={password}
                            placeholder={i18n.t('auth.fields.password')}
                        />
                        <PrimaryButton
                            handleSubmit={handleResetPassword}
                            disabled={isLoading}
                            text={i18n.t('auth.reset_password_page.submit')}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}
