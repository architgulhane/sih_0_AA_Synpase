import { Platform } from 'react-native';

// Use 10.0.2.2 for Android Emulator, localhost for iOS Simulator/Web
const DEV_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const PORT = 8000;

export const API_BASE_URL = 'https://pug-c-776087882401.europe-west1.run.app';
export const WS_BASE_URL = 'wss://pug-c-776087882401.europe-west1.run.app';
