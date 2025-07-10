import AsyncStorage from "@react-native-async-storage/async-storage";

export const setStorageItem = async (key: string, value: any): Promise<void> => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.log('Error storing value: ', error);
    }
}

export const getStorageItem = async (key: string): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(key);
    } catch (error) {
        console.error('Error getting item:', error);
        return null;
    }
}

export const removeStorageItem = async (key: string): Promise<void> => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error('Error deleting item:', error);
    }
}
