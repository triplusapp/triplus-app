import useLocalization from "@/src/i18n/useLocalization";

import React, {useState} from "react";
import {Alert, Pressable, ScrollView, Text, View} from "react-native";
import PrimaryButton from "@/components/forms/PrimaryButton";
import {ApiResponseError} from "@/src/api/core/apiResponseError";
import * as ImagePicker from "expo-image-picker";
import {Image} from "expo-image";
import {ImagePickerAsset} from "expo-image-picker/src/ImagePicker.types";
import {productService} from "@/src/api/services/productService";
import {UserProductSuggestionSubmission} from "@/src/types/suggestedProduct";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {CommonStackParamList} from "@/src/navigation/BottomTabNavigator";
import {useNavigation} from "@react-navigation/native";
import {RootStackParamList} from "@/src/navigation";
import TextInput from "@/components/forms/TextInput";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import brandColors from "@/assets/colors";
import {useAuth} from "@/src/auth";
import Unauthenticated from "@/components/screens/Unauthenticated";

type Props = NativeStackScreenProps<CommonStackParamList, 'UploadProduct'>;

export default function UploadProductScreen({route}: Props) {
    const {barcode} = route.params;
    const {i18n} = useLocalization();
    const {isAuthenticated} = useAuth();

    if (!isAuthenticated) {
        return (
            <View className={'px-4 flex-1'}>
                <Unauthenticated />
            </View>
        );
    }

    return (
        <ScrollView
            automaticallyAdjustKeyboardInsets={true}
            keyboardShouldPersistTaps={'handled'}
        >
            <View className="flex-1 bg-white px-4 py-6 mt-4">
                <Text className="font-bold text-2xl">{i18n.t('add_product.title')}</Text>
                <ProductForm initialBarcode={barcode}></ProductForm>
            </View>
        </ScrollView>
    );
}

function ProductForm({initialBarcode}: { initialBarcode: string }) {
    const [name, setName] = useState('');
    const [format, setFormat] = useState('');
    const [barcode, setBarcode] = useState(initialBarcode);
    const [brand, setBrand] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyEmail, setCompanyEmail] = useState('');
    const [comments, setComments] = useState('');
    const {i18n} = useLocalization();
    const [image, setImage] = useState<ImagePickerAsset | null>(null);
    const navigation = useNavigation<NativeStackScreenProps<RootStackParamList, 'Tabs'>['navigation']>();
    const disableBarcode = initialBarcode !== '';

    const takePhoto = async () => {
        try {
            const cameraResp = await ImagePicker.launchCameraAsync({
                allowsEditing: false,
                mediaTypes: ['images'],
                quality: 0.6,
            });
            if (!cameraResp.canceled) {
                setImage(cameraResp.assets[0]);
            }
        } catch (e) {
            // console.error(e);
        }
    };

    const handleSubmit = async () => {
        if (!image) {
            Alert.alert('Error', i18n.t('add_product.errors.required_photo'))
            return;
        }
        try {
            const data: UserProductSuggestionSubmission = {
                barcode: barcode,
                name: name,
                comments: comments,
                company_email: companyEmail,
                company_name: companyName,
                format: format,
                brand: brand,
                image: image
            };
            const response = await productService.suggestProduct(data);

            if (response.existing) {
                Alert.alert(i18n.t('add_product.messages.successful_upload.title'), i18n.t('add_product.messages.exists'));
                // @ts-ignore
                navigation.navigate('Product', {id: response.id});
            } else {
                Alert.alert(i18n.t('add_product.messages.successful_upload.title'), i18n.t('add_product.messages.successful_upload.message'));
                navigation.goBack()
            }

        } catch (responseError) {
            if (responseError instanceof ApiResponseError) {
                console.log(responseError.statusCode);
                Alert.alert('Error', responseError.message);
                console.log(responseError.errors);
            } else {
                console.error("Unexpected error:", responseError);
                Alert.alert('Error inesperat');
                console.log(responseError);
            }
        }
    };

    return (
        <View className="mt-4 flex gap-4">
            <TextInput
                onChangeText={text => setName(text)}
                value={name}
                placeholder={i18n.t('add_product.fields.name')}
            />

            <TextInput
                onChangeText={text => setFormat(text)}
                value={format}
                placeholder={i18n.t('add_product.fields.format')}
            />
            <Text className={'text-gray-400 text-sm -mt-3'}>{i18n.t('add_product.fields.format_hint')}</Text>

            <TextInput
                onChangeText={text => setBrand(text)}
                value={brand}
                placeholder={i18n.t('add_product.fields.brand')}
            />

            <TextInput
                onChangeText={text => setBarcode(text)}
                value={barcode}
                editable={!disableBarcode}
                placeholder={i18n.t('add_product.fields.barcode')}
            />
            <TextInput
                onChangeText={text => setCompanyName(text)}
                value={companyName}
                placeholder={i18n.t('add_product.fields.company')}
            />
            <TextInput
                onChangeText={text => setCompanyEmail(text)}
                value={companyEmail}
                autoCapitalize="none"
                placeholder={i18n.t('add_product.fields.email')}
            />

            <TextInput
                onChangeText={text => setComments(text)}
                value={comments}
                multiline={true}
                placeholder={i18n.t('add_product.fields.comments')}
            />

            <View
                className={'bg-white border border-gray-300 px-3.5 py-3.5 rounded-lg'}
            >
                <Pressable
                    className={'flex-row gap-2'}
                    onPress={takePhoto}
                >
                    <FontAwesome name={'camera'} color={brandColors.green} size={16}/>
                    <Text>{i18n.t('add_product.fields.photo')}</Text>
                </Pressable>
                {image && (
                    <Image
                        source={{uri: image.uri}}
                        style={{height: 100, marginTop: 10}}
                        contentFit="contain"
                    />
                )}
            </View>

            <PrimaryButton text={i18n.t('add_product.action_btn')} handleSubmit={handleSubmit}/>
        </View>
    );
}


