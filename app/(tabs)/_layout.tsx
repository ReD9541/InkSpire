import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

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
            <IconWithGlow focused={focused}>
              <IconSymbol
                name="house.fill"
                size={40}
                color={focused ? ACTIVE : INACTIVE}
              />
            </IconWithGlow>
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ focused }) => (
            <IconWithGlow focused={focused}>
              <FontAwesome
                name="pencil-square-o"
                size={40}
                color={focused ? ACTIVE : INACTIVE}
              />
            </IconWithGlow>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <IconWithGlow focused={focused}>
              <Ionicons
                name="person-circle"
                size={40}
                color={focused ? ACTIVE : INACTIVE}
              />
            </IconWithGlow>
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
    width: 48,
    height: 48,
    borderRadius: 24,
    opacity: 0.55,
  },
});

