import useLocalization from "@/src/i18n/useLocalization";

import React, {useState} from "react";
import {Alert, Linking, Pressable, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {useAuth} from "@/src/auth";
import {userService} from "@/src/api/services/userService";
import {ApiResponseError} from "@/src/api/core/apiResponseError";
import PrimaryButton from "@/components/forms/PrimaryButton";
import TextInput from "@/components/forms/TextInput";
import {useNavigation} from "@react-navigation/native";
import {ImagePickerAsset} from "expo-image-picker/src/ImagePicker.types";
import * as ImagePicker from "expo-image-picker";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import brandColors from "@/assets/colors";
import {Image} from "expo-image";
import {Avatar} from "react-native-ui-lib";
import ThemedModal from "@/components/forms/ThemedModal";
import {AntDesign} from "@expo/vector-icons";
import type {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/navigation";

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function ProfileScreen({navigation}: Props) {
    const {i18n} = useLocalization();
    const {destroy, setUserIsAuthenticated, updateUser} = useAuth();
    const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

    const handleDeleteModalDeny = () => {
        setDeleteModalVisible(false);
    };

    const handleDeleteModalAccept = async () => {
        setDeleteModalVisible(false);

        await userService.deleteAccount()
        const isLoggedOut = await destroy();
        if (isLoggedOut) {
            setUserIsAuthenticated(false);
            await updateUser();
            navigation.reset({
                index: 0,
                routes: [{name: 'Home'}]
            });
        }
    };

    return (
        <View className={''}>
            <ProfileForm/>
            <TouchableOpacity
                className={'px-4 py-6'}
                onPress={() => setDeleteModalVisible(true)}
            >
                <Text className={'text-red-600 text-right'}>{i18n.t("delete_account_modal.toggle_button")}</Text>
            </TouchableOpacity>
            <DeleteAccountModal
                visible={deleteModalVisible}
                onDeny={handleDeleteModalDeny}
                onAccept={handleDeleteModalAccept}
            />
        </View>
    );
}

function ProfileForm() {
    const {updateUser, currentUser} = useAuth();
    const [name, setName] = useState(currentUser?.name ?? '');
    const [isLoading, setIsLoading] = useState(false);
    const [location, setLocation] = useState(currentUser?.location ?? '');
    const [picture, setPicture] = useState<ImagePickerAsset | null>(null);
    const {i18n} = useLocalization();
    const navigation = useNavigation();

    // const takePhoto = async () => {
    //     try {
    //         const cameraResp = await ImagePicker.launchCameraAsync({
    //             allowsEditing: false,
    //             mediaTypes: 'images',
    //             cameraType: CameraType.front,
    //             quality: 0.6,
    //             base64: true
    //         });
    //         if (!cameraResp.canceled) {
    //             setPicture(cameraResp.assets[0]);
    //         }
    //     } catch (e) {
    //         // console.error(e);
    //     }
    // };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            // allowsEditing: true,
            quality: 1,
            base64: true,
        });

        console.log(result);

        if (!result.canceled) {
            setPicture(result.assets[0]);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            console.log(picture);
            console.log(picture?.base64);
            await userService.updateProfile(name, location, picture?.base64 ?? null);
            await updateUser();
            navigation.goBack();
        } catch (responseError) {
            if (responseError instanceof ApiResponseError) {
                console.log(responseError.statusCode);
                console.error(responseError.message);
                console.log(responseError.errors);
            } else {
                // Si no és del tipus esperat, pots fer alguna cosa com manejar l'error o llençar-ne un altre
                Alert.alert('Error', "Error inesperat: " + responseError);
            }
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <View className={'bg-white px-4 py-8 flex gap-4'}>
            <TextInput
                onChangeText={text => setName(text)}
                placeholder={i18n.t('profile.form.name')}
                value={name}
            />
            <TextInput
                onChangeText={text => setLocation(text)}
                placeholder={i18n.t('profile.form.location')}
                value={location}
            />
            <View className={'flex-row gap-6'}>
                <View className={'grow'}>
                    <View
                        className={'bg-white border border-gray-300 px-3.5 py-5 rounded-lg'}
                    >
                        <Pressable
                            className={'flex-row gap-2'}
                            onPress={pickImage}
                        >
                            <FontAwesome name={'camera'} color={brandColors.green} size={16}/>
                            <Text>{i18n.t('add_product.fields.photo')}</Text>
                        </Pressable>
                        {picture && (
                            <Image
                                source={{uri: picture.uri}}
                                style={{height: 100, marginTop: 10}}
                                contentFit="contain"
                            />
                        )}
                    </View>
                </View>
                {currentUser?.avatar?.thumb && (
                    <View>
                        <Avatar
                            size={100}
                            source={{uri: currentUser.avatar.thumb}}
                        />
                    </View>
                )}
            </View>
            <View className="flex-row">
                <PrimaryButton
                    disabled={isLoading}
                    text={i18n.t('profile.form.save_btn')}
                    handleSubmit={handleSubmit}
                />
            </View>
        </View>
    );
}

function DeleteAccountModal({ visible, onDeny, onAccept }: {
    visible: boolean;
    onDeny: () => void;
    onAccept: () => void;
}) {
    const {i18n} = useLocalization();

    return (
        <ThemedModal visible={visible} onRequestClose={onDeny}>
            <AntDesign name="deleteuser" size={24} color={'#dc2626'}/>
            <Text className="text-red-600 text-xl font-bold">{i18n.t("delete_account_modal.title")}</Text>
            <Text className="text-center">{i18n.t("delete_account_modal.message")}</Text>

            <Pressable className="px-4 py-2" onPress={onAccept}>
                <Text className="text-red-600 font-bold">{i18n.t("delete_account_modal.allow")}</Text>
            </Pressable>

            <Pressable className="px-4 py-2" onPress={onDeny}>
                <Text className="text-gray-500 font-bold">{i18n.t("delete_account_modal.deny")}</Text>
            </Pressable>
        </ThemedModal>
    );
}
