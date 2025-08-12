import { HapticTab } from "@/components/HapticTab";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View, Image } from "react-native";

const ACTIVE = "#FFE6EC";
const INACTIVE = "#8F86A8";

function IconWithGlow({
  focused,
  children,
}: {
  focused: boolean;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.iconWrap}>
      {focused && (
        <LinearGradient
          colors={["#C08EFF55", "#F0A7F555", "#FFCAA755"]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.glow}
        />
      )}
      {children}
    </View>
  );
}

function TabIcon({
  focused,
  src,
  size = 32,
}: {
  focused: boolean;
  src: any; // require(...) result
  size?: number;
}) {
  return (
    <IconWithGlow focused={focused}>
      <Image
        source={src}
        style={[
          styles.iconImg,
          { width: size, height: size, tintColor: focused ? ACTIVE : INACTIVE },
        ]}
        resizeMode="contain"
      />
    </IconWithGlow>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => null,
        tabBarItemStyle: { alignItems: "center", justifyContent: "center" },
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen name="settings" options={{ href: null }} />

      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              src={require("../../assets/icons/home-icon.png")}
              size={34}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              src={require("../../assets/icons/add-post-icon.png")}
              size={34}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              src={require("../../assets/icons/profile-icon.png")}
              size={34}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 0,
    height: 90,
    backgroundColor: "#181818",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#2B2B2B",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 18,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  glow: {
    position: "absolute",
    borderRadius: 40,
    backgroundColor: "rgba(255, 230, 236, 0.05)",
    shadowColor: "rgba(255, 230, 236, 1)",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  iconImg: {
    width: 40,
    height: 40,
  },
});
