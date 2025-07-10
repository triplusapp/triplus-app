import FontAwesome from "@expo/vector-icons/FontAwesome6";
import {BottomTabNavigationOptions, createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createStackNavigator} from "@react-navigation/stack";
import {useColorScheme} from "react-native";
import useLocalization from "@/src/i18n/useLocalization";
import React from "react";
import BarcodeScannerScreen from "@/src/screens/scanner/BarcodeScannerScreen";
import SearchScreen from "@/src/screens/search/SearchScreen";
import CommunityScreen from "@/src/screens/community/CommunityScreen";
import ProductScreen from "@/src/screens/products/ProductScreen";
import FavoritesScreen from "@/src/screens/favorites/FavoritesScreen";
import {
    createNativeStackNavigator,
    NativeStackNavigationOptions,
    NativeStackScreenProps
} from "@react-navigation/native-stack";
import {NavigationProp} from "@react-navigation/native";
import CompanyScreen from "@/src/screens/companies/CompanyScreen";
import TopNav from "@/components/top-nav/TopNav";
import UploadProductScreen from "@/src/screens/products/UploadProductScreen";
import brandColors from "@/assets/colors";
import CameraIcon from "@/components/svgs/cameraIcon";
import BookmarkIcon from "@/components/svgs/bookmarkIcon";
import SearchIcon from "@/components/svgs/searchIcon";
import CommunityIcon from "@/components/svgs/communityIcon";
import ProductScoreScreen from "@/src/screens/products/ProductScoreScreen";
import ProductScoreDetailsScreen from "@/src/screens/products/ProductScoreDetailsScreen";
import UserScreen from "@/src/screens/user/UserScreen";
import SearchHistoryScreen from "@/src/screens/search/SearchHistoryScreen";
import SuggestedProductScreen from "@/src/screens/products/SuggestedProductScreen";
import {useAuth} from "@/src/auth";
import i18n from "@/src/i18n";

function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={28} style={{marginBottom: -3}} {...props} />;
}

const commonStackOptions: NativeStackNavigationOptions = {
    headerRight: () => <TopNav />,
    headerStyle: {
        backgroundColor: brandColors.bg,
    },
    headerTintColor: brandColors.green,
    headerTitleStyle: {
        color: 'black',
    },
    headerShadowVisible: false,
    contentStyle: {
        backgroundColor: brandColors.bg,
    }
};

const commonTabOptions: BottomTabNavigationOptions = {
    headerShown: false,
    tabBarActiveTintColor: brandColors.green,
    tabBarLabelStyle: {
        fontSize: 11
    }
};

function commonScreens(Stack: any) {
    return (
        <>
            <Stack.Screen
                name="User"
                component={UserScreen}
                options={{headerTitle: i18n.t('user.header_title')}}
            />
            <Stack.Screen
                name="Product"
                component={ProductScreen}
                options={{headerTitle: i18n.t('product.header_title')}}
            />
            <Stack.Screen
                name="SuggestedProduct"
                component={SuggestedProductScreen}
                options={{headerTitle: i18n.t('product.header_title')}}
            />
            <Stack.Screen
                name="ProductScore"
                component={ProductScoreScreen}
                options={{headerTitle: i18n.t('product.header_title')}}
            />
            <Stack.Screen
                name="ProductScoreDetails"
                component={ProductScoreDetailsScreen}
                options={{headerTitle: i18n.t('product.header_title')}}
            />
            <Stack.Screen
                name="UploadProduct"
                component={UploadProductScreen}
                options={{headerTitle: i18n.t('add_product.header_title')}}
            />
            <Stack.Screen
                name="Company"
                component={CompanyScreen}
                options={{headerTitle: "Empresa"}}
            />
        </>
    )
}

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    const {i18n} = useLocalization();
    const {isAuthenticated} = useAuth();

    return (
        <BottomTab.Navigator
            initialRouteName="search"
            screenOptions={{
                headerShown: false,
                // unmountOnBlur: true,
            }}
        >
            <BottomTab.Screen
                name="barcode-scanner"
                component={ScannerNavigator}
                options={{
                    ...commonTabOptions,
                    title: i18n.t('tabs.scan'),
                    tabBarIcon: ({color}) => <CameraIcon width={28} height={28} fill={color}/>,
                }}
            />
            <BottomTab.Screen
                name="search"
                component={SearchNavigator}
                options={{
                    ...commonTabOptions,
                    title: i18n.t('tabs.search'),
                    tabBarIcon: ({color}) => <SearchIcon width={28} height={28} fill={color}/>,
                }}
            />
            <BottomTab.Screen
                name="favorites"
                component={FavoritesNavigator}
                options={{
                    ...commonTabOptions,
                    title: i18n.t('tabs.favorites'),
                    tabBarIcon: ({focused, color}) => <BookmarkIcon width={28} height={28} fill={focused ? color : (isAuthenticated ? color : '#e3e3e3')}/>,
                }}
            />
            <BottomTab.Screen
                name="community"
                component={CommunityNavigator}
                options={{
                    ...commonTabOptions,
                    title: i18n.t('tabs.community'),
                    tabBarIcon: ({focused, color}) => <CommunityIcon width={32} height={32} fill={focused ? color : (isAuthenticated ? color : '#e3e3e3')}/>,
                }}
            />
        </BottomTab.Navigator>
    );
}

export type CommonStackParamList = {
    User: { id: number };
    UploadProduct: { barcode: string };
    SuggestedProduct: { id: number };
    Product: { id: string };
    ProductScore: { id: string };
    ProductScoreDetails: { id: string, category: string };
    Company: { id: string };
};
export type ScannerStackParamList = CommonStackParamList & {
    Scanner: undefined;
};
export type FavoritesStackParamList = CommonStackParamList & {
    Favorites: undefined;
};
export type SearchStackParamList = CommonStackParamList & {
    Search: undefined;
    SearchHistory: undefined;
};
export type CommunityStackParamList = CommonStackParamList & {
    Community: undefined;
};
export type CommunityStackNavigation = NavigationProp<CommunityStackParamList>;
export type ScannerStackNavigation = NavigationProp<ScannerStackParamList>;

const ScannerStack = createNativeStackNavigator<ScannerStackParamList>();
const FavoritesStack = createNativeStackNavigator<FavoritesStackParamList>();
const SearchStack = createNativeStackNavigator<SearchStackParamList>();
const CommunityStack = createNativeStackNavigator<CommunityStackParamList>();

function ScannerNavigator() {
    const {i18n} = useLocalization();
    const common = commonScreens(ScannerStack);

    return (
        <ScannerStack.Navigator
            screenOptions={{
                ...commonStackOptions
            }}
        >
            <ScannerStack.Screen
                name="Scanner"
                component={BarcodeScannerScreen}
                options={{headerTitle: i18n.t('tabs.scan')}}
            />
            {common}
        </ScannerStack.Navigator>
    );
}

function FavoritesNavigator() {
    const {i18n} = useLocalization();
    const common = commonScreens(FavoritesStack);

    return (
        <FavoritesStack.Navigator
            screenOptions={{
                ...commonStackOptions
            }}
        >
            <FavoritesStack.Screen
                name="Favorites"
                component={FavoritesScreen}
                options={{headerTitle: i18n.t('tabs.favorites')}}
            />
            {common}
        </FavoritesStack.Navigator>
    );
}

function SearchNavigator() {
    const {i18n} = useLocalization();
    const common = commonScreens(SearchStack);

    return (
        <SearchStack.Navigator
            screenOptions={{
                ...commonStackOptions
            }}
        >
            <SearchStack.Screen
                name="Search"
                component={SearchScreen}
                options={{headerTitle: i18n.t('tabs.search')}}
            />
            <SearchStack.Screen
                name="SearchHistory"
                component={SearchHistoryScreen}
                options={{headerTitle: i18n.t('tabs.search')}}
            />
            {common}
        </SearchStack.Navigator>
    );
}

function CommunityNavigator() {
    const {i18n} = useLocalization();
    const common = commonScreens(CommunityStack);

    return (
        <CommunityStack.Navigator
            screenOptions={{
                ...commonStackOptions
            }}
        >
            <CommunityStack.Screen
                name="Community"
                component={CommunityScreen}
                options={{headerTitle: i18n.t('tabs.community')}}
            />
            {common}
        </CommunityStack.Navigator>
    );
}
