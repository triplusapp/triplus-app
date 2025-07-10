import {Pressable, StyleSheet,} from 'react-native';
import React, {useCallback} from 'react';
import Animated, {SharedValue, useAnimatedStyle, withSpring, withTiming,} from 'react-native-reanimated';
import {useAuth} from "@/src/auth";
import brandColors from "@/assets/colors";
import i18n from "@/src/i18n";

type Props = {
    currentIndex: SharedValue<number>;
    length: number;
    flatListRef: any;
};
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Button = ({ currentIndex, length, flatListRef }: Props) => {
    const {setUserHasBeenOnboarded} = useAuth();
    const rnBtnStyle = useAnimatedStyle(() => {
        return {
            width:
                currentIndex.value === length - 1 ? withSpring(140) : withSpring(60),
            height: 60,
        };
    }, [currentIndex, length]);

    const rnTextStyle = useAnimatedStyle(() => {
        return {
            opacity:
                currentIndex.value === length - 1 ? withTiming(1) : withTiming(0),
            transform: [
                {
                    translateX:
                        currentIndex.value === length - 1 ? withTiming(0) : withTiming(100),
                },
            ],
        };
    }, [currentIndex, length]);

    const imageAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity:
                currentIndex.value !== length - 1 ? withTiming(1) : withTiming(0),
            transform: [
                {
                    translateX:
                        currentIndex.value !== length - 1 ? withTiming(0) : withTiming(100),
                },
            ],
        };
    }, [currentIndex, length]);

    const onPress = useCallback(() => {
        if (currentIndex.value === length - 1) {
            setUserHasBeenOnboarded(true);
            return;
        } else {
            flatListRef?.current?.scrollToIndex({
                index: currentIndex.value + 1,
            });
        }
    }, []);
    return (
        <AnimatedPressable style={[styles.container, rnBtnStyle]} onPress={onPress}>
            <Animated.Text style={[styles.textStyle, rnTextStyle]}>
                {i18n.t('onboarding.action_btn')}
            </Animated.Text>
            <Animated.Image
                source={require('../../assets/images/onboarding-screens/arrow.png')}
                style={[styles.imageStyle, imageAnimatedStyle]}
            />
        </AnimatedPressable>
    );
};

export default Button;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 100,
        backgroundColor: brandColors.green,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    textStyle: {
        color: 'white',
        position: 'absolute',
        fontWeight: '600',
        fontSize: 16,
    },
    imageStyle: {
        width: 24,
        height: 24,
        position: 'absolute',
    },
});
