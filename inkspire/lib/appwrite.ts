import { Client, Databases, Account } from 'react-native-appwrite';
import {
  EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  EXPO_PUBLIC_APPWRITE_ENDPOINT,
  EXPO_PUBLIC_APPWRITE_PACKAGE_NAME
} from '../config/Config';

const client = new Client()
  .setEndpoint(EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(EXPO_PUBLIC_APPWRITE_PROJECT_ID)
  .setPlatform(EXPO_PUBLIC_APPWRITE_PACKAGE_NAME);

export const account = new Account(client);
export const databases = new Databases(client);
export default client;