import "react-native-gesture-handler";

import {StatusBar} from "expo-status-bar";
import * as Linking from 'expo-linking';
import {SafeAreaProvider} from "react-native-safe-area-context";
import {ClickOutsideProvider} from 'react-native-click-outside';

import {useLoadedAssets} from "./src/hooks/useLoadedAssets";
import Navigation from "./src/navigation";

import "./assets/global.css";

export default function App() {
    const isLoadingComplete = useLoadedAssets();

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <ClickOutsideProvider>
                <SafeAreaProvider>
                    <Navigation/>
                    <StatusBar/>
                </SafeAreaProvider>
            </ClickOutsideProvider>
        );
    }
}
