import {
    EXPO_PUBLIC_APPWRITE_ENDPOINT,
    EXPO_PUBLIC_APPWRITE_PROJECT_ID,
} from "@/config/Config";
import * as ImagePicker from "expo-image-picker";
import { Dimensions } from "react-native";

// Builds a URL for accessing a file in Appwrite storage.
// Returns an empty string if bucketId or fileId is not provided.
export const buildFileUrl = (bucketId: string, fileId: string): string => {
  if (!bucketId || !fileId) return "";
  return `${EXPO_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${encodeURIComponent(
    bucketId
  )}/files/${encodeURIComponent(fileId)}/view?project=${encodeURIComponent(
    EXPO_PUBLIC_APPWRITE_PROJECT_ID
  )}`;
};

// Converts an array of strings to a comma-separated list.
export const toIdList = (arr: string[]): string => {
  // Use a Set to ensure all IDs are unique before joining
  return Array.from(new Set(arr)).join(",");
};

// Parses a comma-separated string into an array of strings.
export const parseIdList = (list?: string | null): string[] => {
  return typeof list === "string" && list.trim().length
    ? list
        .split(/[\s,;|]+/)
        .map((x) => x.trim())
        .filter(Boolean)
    : [];
};

// Checks if a specific ID exists within a delimited string list.
export const idInList = (list: string, id: string): boolean => {
  const parts = parseIdList(list);
  return parts.some((p) => p === id);
};


//email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

//password validation
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};


// Launches the device's image library to select a single image.
export const pickImage = async (
  options?: Partial<ImagePicker.ImagePickerOptions>
) => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: false,
    quality: 1,
    // Allow overriding default options
    ...options, 
  });

  if (!result.canceled && result.assets?.[0]) {
    // Return the local URI of the selected image
    return result.assets[0].uri; 
  }
   // Return null if the user cancels
  return null;
};

// UI & Layout Constants
const SCREEN_W = Dimensions.get("window").width;
const H_PADDING = 20;
const GAP = 6;
const COLS = 3;


 //Calculates the size for a square tile in a 3-column grid layout.
export const TILE_SIZE = Math.floor(
  (SCREEN_W - H_PADDING * 2 - GAP * (COLS - 1)) / COLS
);