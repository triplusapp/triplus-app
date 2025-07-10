import useLocalization from "@/src/i18n/useLocalization";
import {Alert, AnimatableNumericValue, Linking, Platform, Pressable, Text, TouchableOpacity, View} from "react-native";
import {useAuth} from "@/src/auth";
import React, {useEffect, useState} from "react";
import {userService} from "@/src/api/services/userService";
import {ApiResponseError} from "@/src/api/core/apiResponseError";
import PrimaryButton from "@/components/forms/PrimaryButton";
import {RadioButton, RadioGroup} from "react-native-ui-lib";
import {GestureHandlerRootView, NativeViewGestureHandler} from "react-native-gesture-handler";
import brandColors from "@/assets/colors";
import type {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/navigation";
import {reloadAppAsync} from "expo";
import {useNavigation} from "@react-navigation/native";
import * as Notifications from 'expo-notifications';
import Constants from "expo-constants";
import NotificationPermissionSystemSettingsModal from "@/components/_push-notifications-system-settings-modal";
import ExpoApplication from "expo-application/src/ExpoApplication";

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({navigation}: Props) {
    const {updateUser, currentUser} = useAuth();
    const {i18n, setAppLanguage} = useLocalization();
    const [showVersion, setShowVersion] = useState<boolean>(false);
    const [locale, setLocale] = useState<string>(i18n.locale);
    const [originalLocale] = useState<string>(i18n.locale);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<boolean>(currentUser?.notifications_allowed ?? true);
    const [isModalPushNotificationsPermissionVisible, setIsModalPushNotificationsPermissionVisible] = useState<boolean>(false);


    function handleRegistrationError(errorMessage: string) {
        Alert.alert('Error', errorMessage);
        throw new Error(errorMessage);
    }

    async function registerForPushNotificationsAsync() {
        console.log('registerForPushNotificationsAsync');
        const projectId = Constants.expoConfig?.extra?.eas.projectId;
        if (!projectId) {
            throw new Error('Project ID not found');
        }
        return (
            await Notifications.getExpoPushTokenAsync({projectId})
        ).data;
    }

    const handlePushNotificacionsModalDeny = () => {
        setIsModalPushNotificationsPermissionVisible(false);
    };

    const fetchAndStorePushNotificationToken = () => {
        console.log('fetchAndStorePushNotificationToken');
        registerForPushNotificationsAsync()
            .then(token => {
                userService.addPushNotificationToken(token ?? '');
                setNotifications(true);
            })
            .catch((e: unknown) => {
                setNotifications(false);
                handleRegistrationError(`${e}`);
            });
    };

    const handlePushNotificacionsModalAccept = async () => {
        setIsModalPushNotificationsPermissionVisible(false);
        Linking.openSettings();
    };

    const handleSubmit = async () => {
        try {
            // setAppLanguage(locale);
            setIsLoading(true)
            // await userService.updateSettings(locale, notifications);
            await userService.updateSettings('ca', notifications);
            await updateUser();

            // if (locale !== originalLocale) {
            //     reloadAppAsync()
            // } else {
                navigation.goBack()
            // }
        } catch (responseError) {
            if (responseError instanceof ApiResponseError) {
                console.log(responseError.statusCode);
                console.error(responseError.message);
                console.log(responseError.errors);
            } else {
                // Si no és del tipus esperat, pots fer alguna cosa com manejar l'error o llençar-ne un altre
                Alert.alert('Error', "Error inesperat: " + responseError);
            }
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        if (notifications) {
            Notifications.getPermissionsAsync()
                .then(({status: existingStatus}) => {
                    if (existingStatus === 'granted') {
                        fetchAndStorePushNotificationToken();
                    } else {
                        Notifications.requestPermissionsAsync().then(({status: status}) => {
                            if (status === 'granted') {
                                fetchAndStorePushNotificationToken();
                            } else {
                                setNotifications(false);
                                setIsModalPushNotificationsPermissionVisible(true);
                                return;
                            }
                        })

                    }
                });
        }
    }, [notifications]);

    return (
        <GestureHandlerRootView>
            <NativeViewGestureHandler>
                <View>
                <View className={'mt-4 py-8 px-4 bg-white gap-4'}>
                    {/*<View className="flex-row items-center justify-between border-b border-gray-200 pb-5">*/}
                    {/*    <Text>{i18n.t('settings.form.language')}</Text>*/}
                    {/*    <RadioGroup*/}
                    {/*        initialValue={locale}*/}
                    {/*        className={'gap-2 w-1/2'}*/}
                    {/*        onValueChange={(itemValue: any) => setLocale(String(itemValue))}*/}
                    {/*    >*/}
                    {/*        {i18n.availableLocales.map((localeAux: string, i: number) => (*/}
                    {/*            <RadioButton*/}
                    {/*                label={i18n.t(`locale.${localeAux}`)}*/}
                    {/*                value={localeAux}*/}
                    {/*                key={i}*/}
                    {/*                color={brandColors.green}*/}
                    {/*            />*/}
                    {/*        ))}*/}
                    {/*    </RadioGroup>*/}
                    {/*</View>*/}

                    <View className="flex-row items-center justify-between">
                        <Text>{i18n.t('settings.form.notifications')}</Text>
                        {/*<Switch*/}
                        {/*    trackColor={{false: '#767577', true: brandColors.green}}*/}
                        {/*    thumbColor="#fff"*/}
                        {/*    ios_backgroundColor="#3e3e3e"*/}
                        {/*    onValueChange={() => setNotifications(!notifications)}*/}
                        {/*    value={notifications}*/}
                        {/*/>*/}
                        <RadioGroup
                            initialValue={notifications}
                            className={'gap-2 w-1/2'}
                            onValueChange={(itemValue: any) => setNotifications(itemValue)}
                        >
                            <RadioButton
                                label={i18n.t('settings.form.enabled')}
                                value={true}
                                key={1}
                                color={brandColors.green}
                            />
                            <RadioButton
                                label={i18n.t('settings.form.disabled')}
                                value={false}
                                key={2}
                                color={brandColors.green}
                            />
                        </RadioGroup>
                    </View>

                    <View className="flex-row">
                        <PrimaryButton
                            disabled={isLoading}
                            text={isLoading ? i18n.t('settings.form.save_btn_loading') : i18n.t('settings.form.save_btn')}
                            style={{
                                opacity: (isLoading ? .5 : 1) as AnimatableNumericValue
                            }}
                            handleSubmit={handleSubmit}
                        />
                    </View>
                    <NotificationPermissionSystemSettingsModal
                        visible={isModalPushNotificationsPermissionVisible}
                        onDeny={handlePushNotificacionsModalDeny}
                        onAccept={handlePushNotificacionsModalAccept}
                    />
                </View>
                <Pressable
                    className={'items-center py-10 '}
                    onPress={() => setShowVersion(! showVersion)}
                >
                    <Text
                        className={'text-xs'}
                        style={{
                            color: showVersion ? 'black' : brandColors.bg
                        }}
                    >v{ExpoApplication.nativeApplicationVersion} ({ExpoApplication.nativeBuildVersion})</Text>
                </Pressable>
                </View>
            </NativeViewGestureHandler>
        </GestureHandlerRootView>
    );
}
