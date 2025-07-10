import React, {ReactNode} from "react";
import {TextField, TextFieldProps} from "react-native-ui-lib";
import {View} from "react-native";

type TextInputProps = TextFieldProps & {
    icon?: ReactNode
}

export default function TextInput(props: TextInputProps) {
    return (
        <View
            className={'flex-row items-center justify-between bg-white border border-gray-300 px-3.5 pb-3.5 rounded-lg'}
        >
            <TextField
                {...props}
                placeholderTextColor={'#8885AC'}
                floatingPlaceholder
                floatOnFocus
                floatingPlaceholderStyle={{
                    marginTop: -2,
                }}
                style={{
                    fontSize: 16,
                }}
                containerStyle={{
                    flexGrow: 1
                }}
            />
            {props.icon && (props.icon)}
        </View>
    );
};

