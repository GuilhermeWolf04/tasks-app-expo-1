import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const baseURL = process.env.EXPO_PUBLIC_API_URL;
const TOKEN_KEY = 'sessionToken';

// SecureStore não funciona na web — fallback para localStorage
const storage = {
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  deleteItem: async (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

export interface AuthUser {
  id: number;
  email: string;
}

export const saveToken = (token: string) => storage.setItem(TOKEN_KEY, token);
export const getToken = () => storage.getItem(TOKEN_KEY);
export const removeToken = () => storage.deleteItem(TOKEN_KEY);

export const signup = async (
  email: string,
  password: string
): Promise<{ token: string; user: AuthUser }> => {
  const { data } = await axios.post(`${baseURL}/api/auth/signup`, { email, password });
  return data;
};

export const login = async (
  email: string,
  password: string
): Promise<{ token: string; user: AuthUser }> => {
  const { data } = await axios.post(`${baseURL}/api/auth/login`, { email, password });
  return data;
};

export const logout = async () => {
  await removeToken();
};
