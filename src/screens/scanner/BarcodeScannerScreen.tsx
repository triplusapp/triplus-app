import {Linking, Text, TouchableOpacity, Vibration, View} from 'react-native';
import {BarcodeScanningResult, CameraView, useCameraPermissions} from 'expo-camera';
import React, {useCallback, useEffect, useState} from "react";
import * as Device from 'expo-device';
import {productService} from "@/src/api/services/productService";
import {ApiResponseError} from "@/src/api/core/apiResponseError";
import {useAuth} from "@/src/auth";
import {ProductType} from "@/src/types/productType";
import ProductPendingValidationModal from "@/components/products/_product-pending-validation-modal";
import ProductNotFoundModal from "@/components/products/_product-not-found-modal";
import {useSuggestedProductStore} from "@/src/stores/suggestedProductStore";
import {useProductStore} from "@/src/stores/productStore";
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScannerStackParamList} from "@/src/navigation/BottomTabNavigator";
import {useFocusEffect} from "@react-navigation/core";
import i18n from "@/src/i18n";
import ScannerManualModal from "@/components/products/_scanner-manual-modal";
import PrimaryButton from "@/components/forms/PrimaryButton";

type Props = NativeStackScreenProps<ScannerStackParamList, 'Scanner'>;

export default function BarcodeScannerScreen({navigation}: Props) {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState<boolean>(false);
    const [useCamera, setUseCamera] = useState<boolean>(true);
    const [barcode, setBarcode] = useState<string | null>(null);
    const [showNotFoundModal, setShowNotFoundModal] = useState<boolean>(false);
    const [showManualModal, setShowManualModal] = useState<boolean>(false);
    const [showPendingValidationModal, setShowPendingValidationModal] = useState<boolean>(false);

    const {isAuthenticated} = useAuth();
    const {setSuggestedProduct} = useSuggestedProductStore();
    const {setProduct} = useProductStore();

    const resetState = () => {
        setUseCamera(true);
        setScanned(false);
        setBarcode(null);
        setShowNotFoundModal(false);
        setShowManualModal(false);
        setShowPendingValidationModal(false);

        if (! permission) {
            requestPermission()
        }
    }

    useFocusEffect(
        useCallback(() => resetState(), [])
    );

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setUseCamera(false);
        });

        return unsubscribe;
    }, [navigation]);

    const handleBarCodeScanned = async (result: BarcodeScanningResult) => {
        if (scanned) {
            return
        }

        setScanned(true);
        setBarcode(result.data);
        Vibration.vibrate(100);

        try {
            const response = await productService.barcodeSearch(result.data, isAuthenticated ?? false);
            if (response.type === ProductType.SuggestedProduct) {
                if (response.status === 'accepted') {
                    setSuggestedProduct(response);
                    navigation.push('SuggestedProduct', {id: response.id});
                } else if (response.status === 'pending') {
                    setShowPendingValidationModal(true);
                }
            } else if (response.type === ProductType.Product) {
                setProduct(response);
                navigation.push('Product', {id: response.id});
            }
        } catch (responseError) {
            if (responseError instanceof ApiResponseError && responseError.statusCode === 404) {
                setShowNotFoundModal(true);
            } else {
                // Si no és del tipus esperat, pots fer alguna cosa com manejar l'error o llençar-ne un altre
                console.error("Error inesperat:", responseError);
            }
        }
    };

    if (!permission) {
        requestPermission();

        return (
            <View className="py-10 justify-center mx-4 rounded-2xl bg-white p-3">
                <Text className={'text-center'}>{i18n.t('scanner.requesting_permission')}</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View className="py-10 justify-center mx-4 rounded-2xl bg-white p-3 gap-6">
                <Text className={'text-center'}>{i18n.t('scanner.missing_permission')}</Text>
                {permission.canAskAgain && (
                    <PrimaryButton
                        style={{marginTop: 20}}
                        text={'Permetre accés a la càmera'}
                        handleSubmit={() => requestPermission()}
                    />
                )}
                {!permission.canAskAgain && (
                    <View className={'text-center items-center gap-6 p-3'}>
                        <Text className={'text-center'}>{i18n.t('scanner.cant_ask_again')}</Text>
                        <PrimaryButton
                            text={i18n.t('scanner.cant_ask_again_button')}
                            handleSubmit={() => Linking.openSettings()}
                        />
                    </View>
                )}
            </View>
        );
    }

    const closeNotFoundModal = () => resetState();

    const addNewProductAction = () => {
        if (!barcode) {
            return;
        }
        setShowNotFoundModal(false);
        navigation.push("UploadProduct", {barcode: barcode});
    };

    const closePendingValidationModal = () => resetState();
    const closeManualModal = () => resetState();
    const showManualForm = () => {
        resetState()
        navigation.push("UploadProduct", {barcode: ''});
    };
    const manualInputGuest = () => {
        navigation.push("UploadProduct", {barcode: ''});
    };


    return (
        <View className={'flex-1 py-6 gap-6'} style={{height: '100%'}}>
            <Text className={'text-center text-sm'}>{i18n.t('scanner.placeholder')}</Text>
            <View
                className="grow justify-center mx-4 rounded-2xl bg-white p-3"
                // style={{height: '50%'}}
            >
                {(Device.isDevice && useCamera) ? (
                    <View className={'overflow-hidden rounded-xl flex-grow'}>
                        <CameraView
                            style={{flex: 1}}
                            autofocus={'on'}
                            onBarcodeScanned={handleBarCodeScanned}
                            barcodeScannerSettings={{
                                barcodeTypes: ['ean13'],
                            }}
                        />
                    </View>
                ) : (
                    <Text>{i18n.t('scanner.camera_not_found')}</Text>
                )}

                {showNotFoundModal && (
                    <ProductNotFoundModal
                        visible={showNotFoundModal}
                        onRequestClose={closeNotFoundModal}
                        addNewProductAction={addNewProductAction}/>
                )}
                {showPendingValidationModal && (
                    <ProductPendingValidationModal
                        visible={showPendingValidationModal}
                        onRequestClose={closePendingValidationModal}
                    />
                )}
            </View>
            {isAuthenticated ? (
                <TouchableOpacity onPress={() => setShowManualModal(true)}>
                    <Text className={'underline text-center text-sm'}>{i18n.t('scanner.manual_input')}</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={() => manualInputGuest()}>
                    <Text className={'underline text-center text-sm'}>{i18n.t('scanner.manual_input')}</Text>
                </TouchableOpacity>
            )}
            <Text className={'italic text-center text-sm'}>{i18n.t('scanner.reminder')}</Text>
            {showManualModal && (
                <ScannerManualModal
                    visible={showManualModal}
                    onRequestClose={closeManualModal}
                    showManualForm={showManualForm}
                />
            )}
        </View>
    );
}
