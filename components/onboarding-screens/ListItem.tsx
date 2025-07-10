import {
    View,
    useWindowDimensions,
    StyleSheet,
} from 'react-native';
import React, {useEffect} from 'react';
import Animated, {
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';
import LogoVertical from "@/components/svgs/logoVertical";
import CameraIcon from "@/components/svgs/cameraIcon";
import SearchIcon from "@/components/svgs/searchIcon";
import BookmarkIcon from "@/components/svgs/bookmarkIcon";
import CommunityIcon from "@/components/svgs/communityIcon";
import Level5Icon from "@/components/svgs/levels/level5Icon";
import Stamp from "@/components/svgs/stamp";

type Props = {
    item: { top_text: string; bottom_text: string; };
    index: number;
    x: SharedValue<number>;
};

const stampData = [
    {color: "#00d163", socialCircles: 3, environmentCircles: 3, economicCircles: 3},
    {color: "#d1db00", socialCircles: 1, environmentCircles: 2, economicCircles: 3},
    {color: "#ffc800", socialCircles: 1, environmentCircles: 2, economicCircles: 2},
    {color: "#ff5b00", socialCircles: 0, environmentCircles: 1, economicCircles: 2},
    {color: "#ef0000", socialCircles: 0, environmentCircles: 0, economicCircles: 1},
];

const ListItem = ({item, index, x}: Props) => {
    const {width: SCREEN_WIDTH} = useWindowDimensions();
    const primaryColor = '#00D163';

    const createAnimatedStyle = () => {
        return useAnimatedStyle(() => {
            const translateY = interpolate(
                x.value,
                [
                    (index - 1) * SCREEN_WIDTH,
                    index * SCREEN_WIDTH,
                    (index + 1) * SCREEN_WIDTH,
                ],
                [100, 0, 100],
                Extrapolation.CLAMP
            );

            const opacity = interpolate(
                x.value,
                [
                    (index - 1) * SCREEN_WIDTH,
                    index * SCREEN_WIDTH,
                    (index + 1) * SCREEN_WIDTH,
                ],
                [0, 1, 0],
                Extrapolation.CLAMP
            );

            return {
                opacity,
                transform: [{translateY}]
            };
        }, [x.value, index]);
    };

    // Create animated styles using the centralized function
    const animatedImagesStyle = createAnimatedStyle();
    const animatedTextStyle = createAnimatedStyle();

    const IconCard = ({Icon, style = {}}) => (
        <View style={[styles.iconCard, style]}>
            <Icon
                width={SCREEN_WIDTH * 0.12}
                height={SCREEN_WIDTH * 0.12}
                fill={primaryColor}
            />
        </View>
    );

    const renderSlideContent = () => {
        switch (index) {
            case 0:
                return (
                    <>
                        {stampData.map((stamp, idx) => (
                            <View key={idx}>
                                <Stamp
                                    width={SCREEN_WIDTH * 0.17}
                                    height={SCREEN_WIDTH * 0.17}
                                    {...stamp}
                                />
                            </View>
                        ))}
                    </>
                );
            case 1:
                return (
                    <>
                        <IconCard Icon={CameraIcon}/>
                        <IconCard Icon={SearchIcon}/>
                        <IconCard Icon={BookmarkIcon}/>
                    </>
                );
            case 2:
                return (
                    <>
                        <IconCard Icon={CommunityIcon}/>
                        <View style={styles.iconCardUserLevel5}>
                            <Level5Icon
                                width={SCREEN_WIDTH * 0.21}
                                height={SCREEN_WIDTH * 0.21}
                                fill={primaryColor}
                            />
                        </View>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <View style={[styles.itemContainer, {width: SCREEN_WIDTH}]}>
            <View style={styles.child}>
                <Animated.View style={animatedImagesStyle}>
                    <LogoVertical
                        width={SCREEN_WIDTH * 0.25}
                        height={SCREEN_WIDTH * 0.25}
                    />
                </Animated.View>
            </View>

            <View style={styles.child}>
                <Animated.Text
                    style={[
                        index === 0 ? styles.textItemEmphasis : styles.textItem,
                        animatedTextStyle,
                    ]}
                >
                    {item.top_text}
                </Animated.Text>
            </View>

            <View style={styles.child}>
                <Animated.View style={[
                    styles.imagesContainer,
                    animatedImagesStyle,
                    index === 0 && {gap: 2}
                ]}>
                    {renderSlideContent()}
                </Animated.View>
            </View>

            <View style={styles.child}>
                <Animated.Text style={[styles.textItem, animatedTextStyle]}>
                    {item.bottom_text}
                </Animated.Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
        paddingVertical: 10,
    },
    imagesContainer: {
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
        gap: 12,
    },
    child: {
        justifyContent: 'center'
    },
    iconCard: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        borderBottomRightRadius: 18,
    },
    iconCardUserLevel5: {
        paddingLeft: 20,
        paddingRight: 20,
    },
    textItem: {
        fontFamily: 'Roobert-Regular',
        lineHeight: 26,
        fontSize: 22,
        paddingHorizontal: 25,
        textAlign: 'center',
    },
    textItemEmphasis: {
        fontFamily: 'Roobert-Bold',
        lineHeight: 30,
        fontSize: 30,
        paddingHorizontal: 30,
        textAlign: 'center'
    },
});

export default React.memo(ListItem);
