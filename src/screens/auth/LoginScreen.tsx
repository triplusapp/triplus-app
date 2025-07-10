import useLocalization from "@/src/i18n/useLocalization";

import React, {useState} from "react";
import {Alert, Pressable, Text, View} from "react-native";
import {useAuth} from "@/src/auth";
import * as Device from 'expo-device';
import PrimaryButton from "@/components/forms/PrimaryButton";
import TextInput from "@/components/forms/TextInput";
import PasswordInput from "@/components/forms/PasswordInput";
import {useNavigation} from "@react-navigation/native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/navigation";
import LogoVertical from "@/components/svgs/logoVertical";
import {KeyboardAwareScrollView} from "react-native-ui-lib";

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({navigation}: Props) {
    const {i18n} = useLocalization();

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View className="flex-1 justify-between py-8">
                <View className="items-center">
                    <LogoVertical width={103} height={72}/>
                    <Text className="mt-5 font-bold text-3xl">{i18n.t('auth.login_page.welcome')}</Text>
                    <Text className={'text-gray-500 mt-5'}>{i18n.t('auth.login_page.title')}</Text>
                    <View className={'mt-5 w-full'}>
                        <LoginForm/>
                    </View>
                    <Pressable
                        className={'mt-5'}
                        onPress={() => navigation.navigate('ForgotPassword')}
                    >
                        <Text className={'underline text-gray-500'}>{i18n.t('auth.login_page.forgot_password')}</Text>
                    </Pressable>
                </View>
                <Pressable className="items-center flex-row justify-center gap-1">
                    <Text>{i18n.t('auth.login_page.not_registered.text')}</Text>
                    <Pressable
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text className={'underline'}>{i18n.t('auth.login_page.not_registered.link')}</Text>
                    </Pressable>
                </Pressable>
            </View>
        </KeyboardAwareScrollView>
    );
}

function LoginForm() {
    const {login, updateUser, setUserIsAuthenticated, isAuthenticated} = useAuth();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState('');
    const {i18n} = useLocalization();
    const router = useNavigation<Props['navigation']>();

    const handleLogin = async () => {
        setIsLoading(true)
        try {
            const tokenObtained = await login(email, password, Device.deviceName ?? 'Unnamed device');

            if (tokenObtained) {
                const user = await updateUser();
                if (user && user.id) {
                    setUserIsAuthenticated(true);
                    router.navigate('Home');
                }
            }
            setIsLoading(false)
        } catch (error: any) {
            setIsLoading(false)
            Alert.alert('Error', error.message);
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
            <PasswordInput
                onChangeText={text => setPassword(text)}
                value={password}
                placeholder={i18n.t('auth.fields.password')}
            />

            <PrimaryButton
                disabled={isLoading}
                text={i18n.t('auth.login_page.submit')}
                handleSubmit={handleLogin}
            />
        </View>
    );
}
