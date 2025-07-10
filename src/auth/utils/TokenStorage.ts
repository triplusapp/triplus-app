import AsyncStorage from '@react-native-async-storage/async-storage';

class TokenStorage {
  private static readonly TOKEN_KEY = 'authToken';

  static async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TokenStorage.TOKEN_KEY, token);
    } catch (error) {
      console.error('Error while saving the encrypted token:', error);
      throw error;
    }
  }

  static async getToken(): Promise<string | null> {
    try {
      const localToken = await AsyncStorage.getItem(TokenStorage.TOKEN_KEY);
      return localToken || null;
    } catch (error) {
      console.error('Error while retrieving the encrypted token:', error);
      throw error;
    }
  }

  static async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TokenStorage.TOKEN_KEY);
    } catch (error) {
      console.error('Error while removing the encrypted token:', error);
      throw error;
    }
  }
}

export default TokenStorage;
