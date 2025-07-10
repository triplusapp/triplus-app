import React, {useState} from "react";
import {TextField, TextFieldProps} from "react-native-ui-lib";
import {View} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function PasswordInput(props: TextFieldProps) {
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => setShowPassword(!showPassword);

    return (
        <View
            className={'bg-white border border-gray-300 px-3.5 pb-3.5 rounded-lg flex flex-row items-center w-full'}
        >
            <TextField
                {...props}
                placeholderTextColor={'#8885AC'}
                floatingPlaceholder
                floatOnFocus
                autoCapitalize={'none'}
                textContentType={'password'}
                floatingPlaceholderStyle={{
                    marginTop: -2,
                }}
                style={{
                    fontSize: 16,
                }}
                secureTextEntry={!showPassword}
                containerStyle={{
                    flexGrow: 1,
                }}
            />
            <FontAwesome
                name={showPassword ? 'eye-slash' : 'eye'}
                size={20}
                color={'#00d163'}
                style={{
                    marginTop: 10
                }}
                onPress={toggleShowPassword}
            />
        </View>
    );
};

