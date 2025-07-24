import { Client, Databases, Account } from "react-native-appwrite";
import { EXPO_PUBLIC_APPWRITE_PROJECT_ID, EXPO_PUBLIC_APPWRITE_ENDPOINT } from '../config/Config';

const client = new Client();
client
  .setEndpoint(EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(EXPO_PUBLIC_APPWRITE_PROJECT_ID)
  .setPlatform('com.Guava.inkspire');


export const account = new Account(client);
export const databases = new Databases(client);
