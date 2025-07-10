import useLocalization from "@/src/i18n/useLocalization";
import {Dimensions, Pressable, Text, View} from "react-native";
import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import {useAuth} from "@/src/auth";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/navigation";
import CameraIcon from "@/components/svgs/cameraIcon";
import brandColors from "@/assets/colors";
import BookmarkIcon from "@/components/svgs/bookmarkIcon";
import SearchIcon from "@/components/svgs/searchIcon";
import CommunityIcon from "@/components/svgs/communityIcon";
import {Image} from "expo-image";
import {useHeaderHeight} from '@react-navigation/elements';
import LogoVertical from "@/components/svgs/logoVertical";

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({navigation}: Props) {
    const {i18n} = useLocalization();
    const {isAuthenticated} = useAuth();
    const screen = Dimensions.get('screen');
    const headerHeight = useHeaderHeight()

    if (isAuthenticated === null) {
        return <></>;
    }

    const LauncherItem = ({isAuthenticated, href, children}: {
        isAuthenticated?: boolean;
        href: string;
        children: React.ReactNode;
    }) => {
        const screen = Dimensions.get('screen');
        const itemSize = (screen.width - 100) / 2;

        return (
            <Pressable
                style={{height: itemSize, width: itemSize, display: 'flex'}}
                onPress={() => {
                    if (isAuthenticated === false) {
                        navigation.navigate("Login")
                    } else {
                        navigation.replace('Tabs', {screen: href})
                    }
                }}
                className={`active:bg-brand-lighterGreen justify-center items-center rounded-lg rounded-br-3xl ${isAuthenticated === false ? 'bg-gray-200' : 'bg-white'}`}
            >
                {(isAuthenticated === false)
                    ? <FontAwesome name="lock" className="absolute right-3 top-3" size={12}/>
                    : null}
                {children}
            </Pressable>
        );
    };

    const LauncherButtonContent = ({text, Icon}: {
        text: string,
        Icon: any,
    }) => {
        return (
            <>
                <Icon width={40} height={40} fill={brandColors.green} />
                <Text className={'text-sm mt-2'}>{text}</Text>
            </>
        );
    };

    return (
        <View
            className={'flex justify-between items-center'}
            style={{
                height: screen.height-headerHeight-5
            }}
        >
            <View className={'w-full justify-between py-32 items-center grow'}>
                <LogoVertical width={103} height={72} />

                <View
                    className={'mt-8 w-full flex flex-row flex-wrap justify-center'}
                    style={{gap: 30, paddingHorizontal: 30}}
                >
                    <LauncherItem href="barcode-scanner">
                        <LauncherButtonContent
                            text={i18n.t('tabs.scan')}
                            Icon={CameraIcon}
                        />
                    </LauncherItem>
                    <LauncherItem href="search">
                        <LauncherButtonContent
                            text={i18n.t('tabs.search')}
                            Icon={SearchIcon}
                        />
                    </LauncherItem>
                    <LauncherItem isAuthenticated={isAuthenticated} href="favorites">
                        <LauncherButtonContent
                            text={i18n.t('tabs.favorites')}
                            Icon={BookmarkIcon}
                        />
                    </LauncherItem>
                    <LauncherItem isAuthenticated={isAuthenticated} href="community">
                        <LauncherButtonContent
                            text={i18n.t('tabs.community')}
                            Icon={CommunityIcon}
                        />
                    </LauncherItem>
                </View>
            </View>

            <View className={'w-full flex flex-row justify-center gap-4'}>
                <Text className={'text-sm'}>Amb el suport de:</Text>
                <Image
                    source={require("@/assets/images/empresa.png")}
                    style={{
                        height: 25,
                        width: 122,
                    }}
                />
            </View>

            <View className={'w-full'} style={{height:100}}>
                <Image
                    source={require('@/assets/images/home-bg.png')}
                    contentFit={'cover'}
                    contentPosition={'top left'}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                />
            </View>
        </View>
    );
}
