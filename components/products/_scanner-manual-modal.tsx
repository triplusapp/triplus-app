import React from 'react';
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import {Text, Pressable, TouchableOpacity} from 'react-native';
import ThemedModal from "@/components/forms/ThemedModal";
import i18n from "@/src/i18n";
import PrimaryButton from "@/components/forms/PrimaryButton";
import SearchIcon from "@/components/svgs/searchIcon";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {ScannerStackNavigation} from "@/src/navigation/BottomTabNavigator";
import {useNavigation} from "@react-navigation/native";
import {StackNavigation} from "@/src/navigation";

export default function ScannerManualModal({visible, onRequestClose, showManualForm}: {
    visible: boolean;
    onRequestClose: () => void;
    showManualForm: () => void;
}) {
    const stackNavigation = useNavigation<StackNavigation>();
    const tabsNavigation = useNavigation<ScannerStackNavigation>();

    return (
        <ThemedModal visible={visible} onRequestClose={onRequestClose}>
            <Text>{i18n.t('scanner_manual.search_text')}</Text>
            <TouchableOpacity
                onPress={() => {
                    stackNavigation.navigate('Tabs', {screen: 'search'})
                    onRequestClose()
                }}
                className="bg-brand-green items-center rounded-full px-6 py-3.5 disabled:opacity-50"
            >
                <SearchIcon width={20} height={20} fill={'white'}/>
            </TouchableOpacity>
            <Text>{i18n.t('scanner_manual.form_text')}</Text>
            <PrimaryButton text={i18n.t('scanner_manual.form_button')} handleSubmit={() => {
                tabsNavigation.navigate("UploadProduct", {barcode: ''});
                onRequestClose();
            }}/>
            <Pressable
                className="px-4 py-2"
                onPress={onRequestClose}>
                <Text className="text-brand-green font-bold">{i18n.t('pending_validation_product.go_back')}</Text>
            </Pressable>
        </ThemedModal>
    );
}
