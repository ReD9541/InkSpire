import { Account, Client, Databases, Storage } from 'react-native-appwrite';
import {
  EXPO_PUBLIC_APPWRITE_ENDPOINT,
  EXPO_PUBLIC_APPWRITE_PACKAGE_NAME,
  EXPO_PUBLIC_APPWRITE_PROJECT_ID
} from '../config/Config';

const client = new Client()
  .setEndpoint(EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(EXPO_PUBLIC_APPWRITE_PROJECT_ID)
  .setPlatform(EXPO_PUBLIC_APPWRITE_PACKAGE_NAME);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);