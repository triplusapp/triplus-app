import useLocalization from "@/src/i18n/useLocalization";
import React, {useState} from "react";
import {Alert, Pressable, Text, View} from "react-native";
import {useAuth} from "@/src/auth";
import * as Device from 'expo-device';
import {userService} from "@/src/api/services/userService";
import {ApiResponseError} from "@/src/api/core/apiResponseError";
import PrimaryButton from "@/components/forms/PrimaryButton";
import {useNavigation} from "@react-navigation/native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/navigation";
import TextInput from "@/components/forms/TextInput";
import PasswordInput from "@/components/forms/PasswordInput";
import LogoVertical from "@/components/svgs/logoVertical";
import {Checkbox, KeyboardAwareScrollView} from "react-native-ui-lib";
import brandColors from "@/assets/colors";
import ThemedModal from "@/components/forms/ThemedModal";
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import {NativeStackNavigationProp} from "@react-navigation/native-stack/src/types";
import * as WebBrowser from "expo-web-browser";

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
    const {i18n} = useLocalization();

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View className="justify-between grow py-8">
            <View className="items-center">
                <LogoVertical width={103} height={72} />
                <Text className={'text-gray-500 mt-5'}>{i18n.t('auth.register_page.title')}</Text>
                <View className={'mt-5 w-full'}>
                    <RegisterForm navigation={navigation}/>
                </View>
            </View>
            <Pressable className="items-center flex-row justify-center gap-1">
                <Text>{i18n.t('auth.register_page.already_registered.text')}</Text>
                <Pressable
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text className={'underline'}>{i18n.t('auth.register_page.already_registered.link')}</Text>
                </Pressable>
            </Pressable>
            </View>
        </KeyboardAwareScrollView>
    );
}

function RegisterForm({ navigation }: {navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>}) {
    const {i18n} = useLocalization();
    const {login, updateUser, setUserIsAuthenticated} = useAuth();
    const [terms, setTerms] = useState<boolean>(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const router = useNavigation<Props['navigation']>();

    const openWeb = async (href: string) => {
        WebBrowser.openBrowserAsync(href);
    };

    const handleRegister = async () => {
        if (! terms) {
            Alert.alert('Error', i18n.t('auth.register_page.errors.required_terms'))
            return;
        }
        try {
            await userService.register(name, i18n.locale, email, password);
        } catch (responseError) {
            if (responseError instanceof ApiResponseError) {
                Alert.alert('Error', responseError.message)
            } else {
                console.error("Unexpected error:", responseError);
            }
            return;
        }
        const tokenObtained = await login(email, password, Device.deviceName ?? 'Unnamed device');
        if (tokenObtained) {
            const user = await updateUser();
            if (user && user.id) {
                setUserIsAuthenticated(true);
                router.navigate('Home');
            }
        }
    };

    return (
        <View className="flex gap-4 px-6">
            <TextInput
                onChangeText={text => setName(text)}
                value={name}
                placeholder={i18n.t('auth.fields.name')}
            />
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
            <View className={'flex-row items-center gap-3'}>
                <Checkbox
                    value={terms}
                    color={brandColors.green}
                    onValueChange={(value) => setTerms(value)}
                />
                <View className={'flex-row items-center gap-1'}>
                    <Text className={''}>{i18n.t('auth.register_page.checkbox_terms_accept')}</Text>
                    <Pressable
                        onPress={() => openWeb('https://triplus.app/condicions-us-i-politica-privacitat-app-triplus')}
                    >
                        <Text className={'underline'}>{i18n.t('auth.register_page.checkbox_terms_link')}</Text>
                    </Pressable>
                </View>
            </View>
            <ThemedModal visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <FontAwesome name="circle-info" size={20}/>
                <Text className="font-bold">Contingut pendent</Text>
                <Pressable
                    className="px-4 py-2"
                    onPress={() => setModalVisible(false)}>
                    <Text className="text-brand-green font-bold">{i18n.t('product.report.form.close')}</Text>
                </Pressable>
            </ThemedModal>
            <PrimaryButton text={i18n.t('auth.register_page.submit')} handleSubmit={handleRegister}/>
        </View>
    );
}
