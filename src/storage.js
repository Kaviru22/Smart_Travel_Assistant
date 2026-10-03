import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "STA_TOKEN";

export async function saveToken(token) {
  await AsyncStorage.setItem(KEY, token);
}

export async function getToken() {
  return AsyncStorage.getItem(KEY);
}

export async function clearToken() {
  return AsyncStorage.removeItem(KEY);
}