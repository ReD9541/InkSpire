import { StyleSheet, Text, type TextProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    fontFamily: "Sen",
    lineHeight: 24,
    color: "#C08EFF",
  },
  defaultSemiBold: {
    fontSize: 16,
    fontFamily: "Sen",
    lineHeight: 24,
    fontWeight: "600",
    color: "#C08EFF",
  },
  title: {
    fontSize: 32,
    fontFamily: "Sen",
    fontWeight: "bold",
    lineHeight: 32,
    color: "#C08EFF",
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "Sen",
    fontWeight: "bold",
    color: "#C08EFF",
  },
  link: {
    lineHeight: 30,
    fontFamily: "Sen",
    fontSize: 16,
    color: "#C08EFF",
  },
});
