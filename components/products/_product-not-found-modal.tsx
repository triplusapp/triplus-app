import React from 'react';
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import {Text, Pressable} from 'react-native';
import ThemedModal from "@/components/forms/ThemedModal";
import PrimaryButton from "@/components/forms/PrimaryButton";
import i18n from "@/src/i18n";

export default function ProductNotFoundModal({visible, onRequestClose, addNewProductAction}: {
    visible: boolean;
    onRequestClose: () => void;
    addNewProductAction: () => void;
}) {
    return (
        <ThemedModal visible={visible} onRequestClose={onRequestClose}>
            <FontAwesome name="triangle-exclamation" size={20}/>
            <Text className="text-xl font-bold">{i18n.t('product_not_found.title')}</Text>
            <Text className={'text-center'}>{i18n.t('product_not_found.message')}</Text>
            <PrimaryButton handleSubmit={addNewProductAction} text={i18n.t('product_not_found.suggest_addition')} />
            <Pressable
                className="px-4 py-2"
                onPress={onRequestClose}>
                <Text className="text-brand-green font-bold">{i18n.t('product_not_found.go_back')}</Text>
            </Pressable>
        </ThemedModal>
    );
}
