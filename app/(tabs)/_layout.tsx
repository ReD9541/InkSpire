import { HapticTab } from "@/components/HapticTab";
import { Tabs } from "expo-router";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

const ACTIVE = "#FFE6EC";
const INACTIVE = "#8F86A8";

// Custom tabicon for the app
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
    <View style={styles.iconWrap}>
      <Image
        source={src}
        style={[
          styles.iconImg,
          { width: size, height: size, tintColor: focused ? ACTIVE : INACTIVE },
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

// Tab layout component for the app
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
  iconImg: {
    width: 40,
    height: 40,
  },
});
