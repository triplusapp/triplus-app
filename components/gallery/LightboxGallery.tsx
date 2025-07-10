import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    ScrollView
} from 'react-native';
import {
    PinchGestureHandler,
    PanGestureHandler,
    GestureEvent,
    PanGestureHandlerEventPayload,
    PinchGestureHandlerEventPayload,
    State, GestureHandlerRootView, NativeViewGestureHandler
} from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    interpolate,
    Extrapolate,
    runOnJS
} from 'react-native-reanimated';
import {Media} from "@/src/types/media";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface LightboxGalleryProps {
    images: Media[];
    singleThumb: boolean;
}

const LightboxGallery: React.FC<LightboxGalleryProps> = ({ images, singleThumb }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const scale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const activeGestureRef = useRef<'none' | 'horizontal' | 'vertical'>('none');

    useEffect(() => {
        if (selectedImageIndex !== null) {
            scale.value = withTiming(1);
            translateX.value = withTiming(0);
            translateY.value = withTiming(0);
        }
    }, [selectedImageIndex]);

    const handlePinchEvent = (event: GestureEvent<PinchGestureHandlerEventPayload>) => {
        scale.value = event.nativeEvent.scale;
    };

    const handlePanEvent = (event: GestureEvent<PanGestureHandlerEventPayload>) => {
        const { translationX, translationY } = event.nativeEvent;
        if (
            activeGestureRef.current === 'none'
            && !(Math.abs(translationX) === 0 && Math.abs(translationY) === 0)
        ) {
            if (Math.abs(translationX) > Math.abs(translationY)) {
                activeGestureRef.current = 'horizontal';
            } else {
                activeGestureRef.current = 'vertical';
            }
        }

        if (activeGestureRef.current === 'horizontal') {
            translateX.value = translationX;
            translateY.value = 0;
        } else if (activeGestureRef.current === 'vertical') {
            translateX.value = 0;
            translateY.value = translationY;
        }
    };

    const onPinchStateChange = (event: GestureEvent<PinchGestureHandlerEventPayload>) => {
        if (event.nativeEvent.state === State.END) {
            scale.value = withTiming(1);
        }
    };

    const onPanStateChange = (event: GestureEvent<PanGestureHandlerEventPayload>) => {
        if (event.nativeEvent.state === State.END) {
            const gestureType = activeGestureRef.current;
            activeGestureRef.current = 'none';

            if (gestureType === 'vertical' && Math.abs(event.nativeEvent.translationY) > SCREEN_HEIGHT * 0.3) {
                setSelectedImageIndex(null);
                return;
            }

            if (gestureType === 'horizontal') {
                const { translationX, velocityX } = event.nativeEvent;
                const shouldChangeImage = Math.abs(translationX) > SCREEN_WIDTH * 0.3 || Math.abs(velocityX) > 500;

                if (shouldChangeImage) {
                    const direction = translationX > 0 ? -1 : 1;
                    const newIndex = (selectedImageIndex || 0) + direction;

                    if (newIndex >= 0 && newIndex < images.length) {
                        setSelectedImageIndex(newIndex);
                    }
                }
            }

            translateX.value = withTiming(0);
            translateY.value = withTiming(0);
        }
    };

    const animatedImageStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { translateX: translateX.value },
            { translateY: translateY.value }
        ],
        opacity: interpolate(
            Math.abs(translateX.value),
            [0, SCREEN_WIDTH],
            [1, 0.5],
            'clamp',
        )
    }));

    const renderThumbnails = () => {
        if (singleThumb) {
            return (
                <TouchableOpacity
                    onPress={() => setSelectedImageIndex(0)}
                    style={styles.thumbnailTouch}
                >
                    <Image
                        source={{uri: images[0].preview}}
                        style={{
                            height: 120,
                            width: 120,
                            // borderRadius: 120 / 2,
                            overflow: "hidden",
                            flexShrink: 0,
                        }}
                    />
                </TouchableOpacity>
            )
        }
        return (
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.thumbnailContainer}
            >
                {images.map((image, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setSelectedImageIndex(index)}
                        style={styles.thumbnailTouch}
                    >
                        <Image
                            source={{ uri: image.preview }}
                            style={styles.thumbnail}
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    };

    const renderLightbox = () => (
        <Modal
            visible={selectedImageIndex !== null}
            transparent={true}
            onRequestClose={() => setSelectedImageIndex(null)}
        >
            <GestureHandlerRootView>
            <NativeViewGestureHandler>
            <View style={styles.modalContainer}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setSelectedImageIndex(null)}
                >
                    <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>

                <PinchGestureHandler
                    onGestureEvent={handlePinchEvent}
                    onHandlerStateChange={onPinchStateChange}
                >
                    <PanGestureHandler
                        onGestureEvent={handlePanEvent}
                        onHandlerStateChange={onPanStateChange}
                    >
                        <Animated.Image
                            source={{ uri: selectedImageIndex !== null ? images[selectedImageIndex].preview : '' }}
                            loadingIndicatorSource={require("../../assets/images/image-placeholder.png")}
                            style={[styles.lightboxImage, animatedImageStyle]}
                            resizeMode="contain"
                        />
                    </PanGestureHandler>
                </PinchGestureHandler>

                {images.length > 1 && (
                    <View style={styles.paginationContainer}>
                        {images.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.paginationDot,
                                    index === selectedImageIndex && styles.activePaginationDot
                                ]}
                            />
                        ))}
                    </View>
                )}
            </View>
            </NativeViewGestureHandler>
            </GestureHandlerRootView>
        </Modal>
    );

    return (
        <View>
            {renderThumbnails()}
            {renderLightbox()}
        </View>
    );
};

const styles = StyleSheet.create({
    thumbnailContainer: {
        gap: 8,
        paddingLeft: 16,
    },
    thumbnailTouch: {
    },
    thumbnail: {
        width: 96,
        height: 96,
        borderRadius: 8
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 10
    },
    closeText: {
        color: 'white',
        fontSize: 30
    },
    lightboxImage: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%'
    },
    paginationDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'gray',
        marginHorizontal: 4
    },
    activePaginationDot: {
        backgroundColor: 'white'
    }
});

export default LightboxGallery;
