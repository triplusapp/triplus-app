import React from 'react';
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import {Text, Pressable} from 'react-native';
import ThemedModal from "@/components/forms/ThemedModal";
import i18n from "@/src/i18n";

export default function ProductPendingValidationModal({visible, onRequestClose}: {
    visible: boolean;
    onRequestClose: () => void;
}) {
    return (
        <ThemedModal visible={visible} onRequestClose={onRequestClose}>
            <FontAwesome name="clock" size={20}/>
            <Text className="text-xl font-bold">{i18n.t('pending_validation_product.title')}</Text>
            <Text>{i18n.t('pending_validation_product.message')}</Text>
            <Pressable
                className="px-4 py-2"
                onPress={onRequestClose}>
                <Text className="text-brand-green font-bold">{i18n.t('pending_validation_product.go_back')}</Text>
            </Pressable>
        </ThemedModal>
    );
}
