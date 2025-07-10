import React from "react";
import {Text, TextProps} from "react-native";

interface TitleProps extends TextProps{
    text: string;
}

export default function Title(props: TitleProps) {
    return (
        <Text
            className="font-bold text-2xl"
            {...props}
        >{props.text}</Text>
    );
};

