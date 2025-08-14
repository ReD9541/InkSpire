import {
  EXPO_PUBLIC_APPWRITE_ENDPOINT,
  EXPO_PUBLIC_APPWRITE_PROJECT_ID,
} from "@/config/Config";
import { Dimensions } from "react-native";

// Appwrite Helpers

export const buildFileUrl = (bucketId: string, fileId: string): string => {
  if (!bucketId || !fileId) return "";
  return `${EXPO_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${encodeURIComponent(
    bucketId
  )}/files/${encodeURIComponent(fileId)}/view?project=${encodeURIComponent(
    EXPO_PUBLIC_APPWRITE_PROJECT_ID
  )}`;
};

// Data Parsers 
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


// Validation Helpers 
export const isValidEmail = (email: string): boolean => {
  // A simple regex for basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};


// UI & Layout Constants 
const SCREEN_W = Dimensions.get("window").width;
const H_PADDING = 20; 
const GAP = 6;        
const COLS = 3;       

// Calculates the size for a square tile in a 3-column grid layout,
export const TILE_SIZE = Math.floor((SCREEN_W - H_PADDING * 2 - GAP * (COLS - 1)) / COLS);