import React from "react";
import {Modal, View} from "react-native";

interface ModalProps {
    visible: boolean;
    onRequestClose: () => void;
    children: React.ReactNode;
}

export default function ThemedModal({visible, onRequestClose, children}: ModalProps) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onRequestClose}
        >
            <View className="flex-1 justify-center items-center px-5 backdrop-blur bg-black/60">
                <View className="rounded-xl bg-white items-center w-full px-10 py-8 gap-4">
                    {children}
                </View>
            </View>
        </Modal>
    );
};

