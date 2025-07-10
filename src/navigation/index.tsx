// If you are not familiar with React Navigation, check out the "Fundamentals" guide:
// https://reactnavigation.org/docs/getting-started
import {DefaultTheme, NavigationContainer, NavigationProp, ThemeProvider, useLinkTo,} from "@react-navigation/native";

import NotFoundScreen from "../screens/NotFoundScreen";
import LinkingConfiguration from "./LinkingConfiguration";
import HomeScreen from "../screens/HomeScreen";
import {AuthProvider, useAuth} from "../auth";
import {LocalizationProvider} from "../i18n/LocalizationProvider";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {MenuProvider} from "../menu/contexts/MenuProvider";
import React, {useEffect, useRef, useState} from "react";
import useLocalization from "../i18n/useLocalization";
import {useMenu} from "../menu/hooks/useMenu";
import OnboardingScreens from "@/src/screens/OnboardingScreens"
import DropDownUser from "../../components/top-nav/DropDownUser";
import DropDownEllipsis from "../../components/top-nav/DropDownEllipsis";
import {Alert, Button, Platform, View} from "react-native";
import {useNavigation} from "@react-navigation/core";
import BottomTabNavigator from "./BottomTabNavigator";
import LoginScreen from "@/src/screens/auth/LoginScreen";
import TopNav from "@/components/top-nav/TopNav";
import brandColors from "@/assets/colors";
import RegisterScreen from "@/src/screens/auth/RegisterScreen";
import ForgotPasswordScreen from "@/src/screens/auth/ForgotPasswordScreen";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import ProfileScreen from "@/src/screens/user/ProfileScreen";
import ExperienceScreen from "@/src/screens/user/ExperienceScreen";
import SettingsScreen from "@/src/screens/user/SettingsScreen";
import FaqsScreen from "@/src/screens/faqs/FaqsScreen";
import NotificationsScreen from "@/src/screens/notifications/NotificationsScreen";
import StaticContentScreen from "@/src/screens/static/StaticContentScreen";
import ContactScreen from "@/src/screens/contact/ContactScreen";
import i18n from "@/src/i18n";
import {LightBoxProvider} from "@alantoa/lightbox";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import ResetPasswordScreen from "@/src/screens/auth/ResetPasswordScreen";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {userService} from "@/src/api/services/userService";
import NotificationPermissionInfoModal from "@/components/_push-notifications-info-modal";
import Constants from 'expo-constants';
import LegalContentScreen from "@/src/screens/static/LegalContentScreen";
import QueEsContentScreen from "@/src/screens/static/QueEsContentScreen";
import SegellContentScreen from "@/src/screens/static/SegellContentScreen";
import DonateContentScreen from "@/src/screens/static/DonateContentScreen";

export default function Navigation() {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    const config = {
        loginUrl: `${apiUrl}/login`,
        logoutUrl: `${apiUrl}/logout`,
        userUrl: `${apiUrl}/customer`,
    };

    return (
        <AuthProvider config={config}>
            <LocalizationProvider>
                <ThemeProvider value={DefaultTheme}>
                    <GestureHandlerRootView>
                        <LightBoxProvider>
                            <MenuProvider>
                                <NavigationContainer linking={LinkingConfiguration}>
                                    <RootNavigator/>
                                </NavigationContainer>
                            </MenuProvider>
                        </LightBoxProvider>
                    </GestureHandlerRootView>
                </ThemeProvider>
            </LocalizationProvider>
        </AuthProvider>
    );
}

export type RootStackParamList = {
    Home: undefined;
    Login: undefined;
    Profile: undefined;
    StaticContent: undefined;
    LegalContent: undefined;
    QueEsContent: undefined;
    DonateContent: undefined;
    SegellContent: undefined;
    Faqs: undefined;
    Contact: undefined;
    Notifications: undefined;
    Experience: undefined;
    Account: undefined;
    Settings: undefined;
    Tabs: { screen: string };
    NotFound: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    ResetPassword: { token: string };
};
export type StackNavigation = NavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();

function handleRegistrationError(errorMessage: string) {
    Alert.alert('Error', errorMessage);
    throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
    const {status: existingStatus} = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const {status} = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        // handleRegistrationError('Permission not granted to get push token for push notification!');
        return;
    }

    const projectId = Constants.expoConfig?.extra?.eas.projectId;
    if (!projectId) {
        handleRegistrationError('Project ID not found');
    }
    try {
        return (
            await Notifications.getExpoPushTokenAsync({projectId})
        ).data;
    } catch (e: unknown) {
        handleRegistrationError(`${e}`);
    }
}

function RootNavigator() {
    const {hasBeenOnboarded, notificationPermissionRequested, isAuthenticated, setUserNotificationPermissionRequested, updateUser} = useAuth();
    const {initializeAppLanguage} = useLocalization();
    const {showUserMenu, showEllipsisMenu, toggleUserMenu, toggleEllipsisMenu} = useMenu();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const linkTo = useLinkTo();

    const [isModalPushNotificationsPermissionVisible, setIsModalPushNotificationsPermissionVisible] = useState(false);
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(
        undefined
    );
    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();

    initializeAppLanguage();

    const handlePushNotificacionsModalDeny = () => {
        setUserNotificationPermissionRequested(true);
        setIsModalPushNotificationsPermissionVisible(false);
    };

    const handlePushNotificacionsModalAccept = async () => {
        setIsModalPushNotificationsPermissionVisible(false);
        setUserNotificationPermissionRequested(true);
        registerForPushNotificationsAsync().then(token => {
            userService.addPushNotificationToken(token ?? '')
                .then(() => updateUser())
        });
    };

    useEffect(() => {
        return navigation.addListener('state', () => {
            // Close all opened menus on change screen
            if (showUserMenu) {
                toggleUserMenu();
            }
            if (showEllipsisMenu) {
                toggleEllipsisMenu();
            }
        });
    }, [navigation, showUserMenu, showEllipsisMenu, toggleUserMenu, toggleEllipsisMenu]);

    useEffect(() => {
        if (hasBeenOnboarded && isAuthenticated && !notificationPermissionRequested) {
            setIsModalPushNotificationsPermissionVisible(true);
        }
    }, [hasBeenOnboarded, isAuthenticated, notificationPermissionRequested]);

    /**
     * Notifications
     */
    useEffect(() => {
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
            }),
        });

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            const data = notification.request.content.data;
            setNotification(notification);
            updateUser();
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            if (response.notification.request.content?.data?.url) {
                linkTo(response.notification.request.content?.data?.url);
            }
        });

        // if (notificationListener.current) {
        //     Notifications.removeNotificationSubscription(notificationListener.current);
        // }
        // if (responseListener.current) {
        //     Notifications.removeNotificationSubscription(responseListener.current);
        // }
    }, []);

    if (hasBeenOnboarded === null) {
        return <></>
    }

    if (!hasBeenOnboarded) {
        return (<OnboardingScreens/>);
    }

    let dropdownMenuTop = insets.top + 40;

    return (
        <View style={{flex: 1}}>
            <Stack.Navigator screenOptions={{
                headerTintColor: brandColors.green,
                headerTitleStyle: {
                    color: 'black',
                },
                contentStyle: {
                    backgroundColor: brandColors.bg,
                },
                headerStyle: {
                    backgroundColor: brandColors.bg,
                },
            }}>
                <Stack.Screen name="Home" component={HomeScreen} options={{
                    headerRight: () => <TopNav/>,
                    title: '',
                }}/>
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{
                        title: i18n.t('user_dropdown.login')
                    }}
                />
                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{
                        title: i18n.t('user_dropdown.register')
                    }}
                />
                <Stack.Screen
                    name="ForgotPassword"
                    component={ForgotPasswordScreen}
                    options={{
                        title: i18n.t('auth.forgot_password_page.title')
                    }}
                />
                <Stack.Screen
                    name="ResetPassword"
                    component={ResetPasswordScreen}
                    options={{
                        title: i18n.t('auth.reset_password_page.title')
                    }}
                />
                <Stack.Group screenOptions={{
                    presentation: 'modal',
                    headerBackVisible: true,
                    // headerShadowVisible: false,
                    headerLeft: () => {
                        return Platform.OS === 'ios'
                            ? <Button title={'Tancar'} color={brandColors.green} onPress={() => navigation.goBack()}/>
                            : null;
                    },
                }}>
                    <Stack.Screen
                        name="Profile"
                        component={ProfileScreen}
                        options={{
                            title: i18n.t('user_dropdown.profile')
                        }}
                    />
                    <Stack.Screen
                        name="StaticContent"
                        component={StaticContentScreen}
                        options={{
                            title: 'Contingut',
                        }}
                    />
                    <Stack.Screen
                        name="LegalContent"
                        component={LegalContentScreen}
                        options={{
                            title: 'Avís legal',
                        }}
                    />
                    <Stack.Screen
                        name="QueEsContent"
                        component={QueEsContentScreen}
                        options={{
                            title: i18n.t('que_es_triplus_page.title'),
                        }}
                    />
                    <Stack.Screen
                        name="DonateContent"
                        component={DonateContentScreen}
                        options={{
                            title: i18n.t('donate_page.title'),
                        }}
                    />
                    <Stack.Screen
                        name="SegellContent"
                        component={SegellContentScreen}
                        options={{
                            title: i18n.t('segell_triplus_page.title'),
                        }}
                    />
                    <Stack.Screen
                        name="Faqs"
                        component={FaqsScreen}
                        options={{
                            title: i18n.t('settings_dropdown.faq')
                        }}
                    />
                    <Stack.Screen
                        name="Contact"
                        component={ContactScreen}
                        options={{
                            title: i18n.t('contact.title'),
                        }}
                    />
                    <Stack.Screen
                        name="Notifications"
                        component={NotificationsScreen}
                        options={{
                            title: i18n.t('settings.form.notifications')
                        }}
                    />
                    <Stack.Screen
                        name="Experience"
                        component={ExperienceScreen}
                        options={{
                            title: i18n.t('user_dropdown.experience')
                        }}
                    />
                    {/*<Stack.Screen name="Account" component={AccountScreen}/>*/}
                    <Stack.Screen
                        name="Settings"
                        component={SettingsScreen}
                        options={{
                            title: i18n.t('user_dropdown.settings')
                        }}
                    />
                </Stack.Group>
                <Stack.Screen
                    name="Tabs"
                    component={BottomTabNavigator}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="NotFound"
                    component={NotFoundScreen}
                    options={{title: "Oops!"}}
                />
            </Stack.Navigator>
            <DropDownUser/>
            <DropDownEllipsis/>
            <NotificationPermissionInfoModal
                visible={isModalPushNotificationsPermissionVisible}
                onDeny={handlePushNotificacionsModalDeny}
                onAccept={handlePushNotificacionsModalAccept}
            />
        </View>
    );
}
