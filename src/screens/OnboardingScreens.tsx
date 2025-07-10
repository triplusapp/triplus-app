import { useCallback, useRef } from 'react';
import {
    Pressable,
    SafeAreaView,
    StyleSheet,
    View,
    ViewToken,
} from 'react-native';
import Animated, {
    useAnimatedRef,
    useAnimatedScrollHandler,
    useSharedValue,
} from 'react-native-reanimated';
import ListItem from '@/components/onboarding-screens/ListItem';
import PaginationElement from '@/components/onboarding-screens/PaginationElement';
import Button from '@/components/onboarding-screens/Button';
import brandColors from "@/assets/colors";
import i18n from "@/src/i18n";

const pages = [
    {
        top_text: i18n.t('onboarding.screen1.top'),
        bottom_text: i18n.t('onboarding.screen1.bottom'),
    },
    {
        top_text: i18n.t('onboarding.screen2.top'),
        bottom_text: i18n.t('onboarding.screen2.bottom'),
    },
    {
        top_text: i18n.t('onboarding.screen3.top'),
        bottom_text: i18n.t('onboarding.screen3.bottom'),
    },
];

export default function OnboardingScreens() {
    const x = useSharedValue(0);
    const flatListIndex = useSharedValue(0);
    const flatListRef = useAnimatedRef<
        Animated.FlatList<{
            top_text: string;
            bottom_text: string;
        }>
    >();

    const onViewableItemsChanged = useCallback(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            flatListIndex.value = viewableItems[0].index ?? 0;
        },
        []
    );
    const scrollHandle = useAnimatedScrollHandler({
        onScroll: (event) => {
            x.value = event.contentOffset.x;
        },
    });

    const renderItem = useCallback(
        ({
             item,
             index,
         }: {
            item: { top_text: string;bottom_text: string;};
            index: number;
        }) => {
            return <ListItem item={item} index={index} x={x} />;
        },
        [x]
    );
    return (
        <SafeAreaView style={styles.container}>
            <Animated.FlatList
                ref={flatListRef}
                onScroll={scrollHandle}
                horizontal
                scrollEventThrottle={16}
                pagingEnabled={true}
                data={pages}
                keyExtractor={(_, index) => index.toString()}
                bounces={false}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
            />
            <View style={styles.bottomContainer}>
                <PaginationElement length={pages.length} x={x} />
                <Button
                    currentIndex={flatListIndex}
                    length={pages.length}
                    flatListRef={flatListRef}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: brandColors.bg,
        paddingBottom: 30,
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
});
