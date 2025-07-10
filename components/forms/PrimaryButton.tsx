import React from "react";
import {Pressable, PressableProps, Text, TouchableOpacity, TouchableOpacityProps} from "react-native";

interface PrimaryButtonProps extends TouchableOpacityProps {
    text: string;
    handleSubmit: () => void;
}

export default function PrimaryButton(props: PrimaryButtonProps) {
    return (
        <TouchableOpacity
            disabled={props.disabled}
            style={props.style}
            onPress={props.handleSubmit}
            className="bg-brand-green items-center rounded-full px-6 py-3.5 disabled:opacity-50"
        >
            <Text className="text-white font-bold text-center text-lg">{props.text}</Text>
        </TouchableOpacity>
    );
};

