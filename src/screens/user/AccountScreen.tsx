import useLocalization from "@/src/i18n/useLocalization";
import {Text, View} from "react-native";

export default function AccountScreen() {
    const {i18n} = useLocalization();

    return (
        <View>
            <Text className="font-bold text-2xl">Compte</Text>
        </View>
    );
}
