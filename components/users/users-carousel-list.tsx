import React, {useCallback, useEffect, useState} from "react";
import {ActivityIndicator, ScrollView, View} from "react-native";
import {PublicUser} from "@/src/types/publicUser";
import UserCarouselCard from "@/components/users/user-carousel-card";
import Toast from "react-native-root-toast";
import i18n from "@/src/i18n";
import {useFocusEffect} from "@react-navigation/core";
import Animated, {
    Easing,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from "react-native-reanimated";

export default function UserListCarousel({fetchUsers}: {
    fetchUsers: () => Promise<PublicUser[]>
}) {
    const [users, setUsers] = useState<PublicUser[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchData = async () => {
        setIsLoading(true);

        try {
            const response = await fetchUsers()
            setUsers(response);
        } catch (error: any) {
            console.log(error.message);

            Toast.show(i18n.t('fetch_error')+  error.message, {
                shadow: false,
                textStyle: {
                    fontSize: 12
                }
            })
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData()
        }, [])
    );

    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <View
                className={'rounded-xl rounded-br-3xl'}
                style={{
                    marginHorizontal: 16,
                    width: 150,
                    height: 120,
                }}>
                <LoadingView/>
            </View>
        );
    }

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{columnGap: 4, paddingHorizontal: 16}}
        >
            {users.map((user, index) => (
                <UserCarouselCard key={user.id} user={user} position={(index+1)}/>
            ))}
        </ScrollView>
    );
}

const LoadingView = () => {
    const progress = useSharedValue(0);
    progress.value = withRepeat(
        withTiming(1, {
            duration: 1000,
            easing: Easing.inOut(Easing.ease)
        }),
        -1,
        true
    );

    const animatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                progress.value,
                [0, 1],
                ['#f6f6f6', '#FFFFFF']
            ),
            flex: 1,
        };
    });

    return (
        <Animated.View
            className={'rounded-xl rounded-br-3xl'}
            style={[{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }, animatedStyle]}>
            <ActivityIndicator size={'small'}/>
        </Animated.View>
    );
};
