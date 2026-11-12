import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { COLORS, FONTS } from "../../constants/theme";

interface TabIconProps {
  focused: boolean;
  children: React.ReactNode;
}

function TabPillWrapper({ focused, children }: TabIconProps) {
  return (
    <View style={[styles.iconWrapper, focused && styles.activePill]}>
      {children}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      {/* ── Tab 1: Beranda ────────────────────────────────────── */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                styles.tabLabel,
                focused ? styles.tabLabelActive : styles.tabLabelInactive,
              ]}
            >
              Beranda
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <TabPillWrapper focused={focused}>
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"
                  stroke={focused ? COLORS.accent : COLORS.muted}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TabPillWrapper>
          ),
        }}
      />

      {/* ── Tab 2: Kolam ──────────────────────────────────────── */}
      <Tabs.Screen
        name="kolam"
        options={{
          title: "Kolam",
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                styles.tabLabel,
                focused ? styles.tabLabelActive : styles.tabLabelInactive,
              ]}
            >
              Kolam
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <TabPillWrapper focused={focused}>
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 3s6 6.2 6 10.5A6 6 0 0 1 6 13.5C6 9.2 12 3 12 3z"
                  stroke={focused ? COLORS.accent : COLORS.muted}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TabPillWrapper>
          ),
        }}
      />

      {/* ── Tab 3: Ikan ───────────────────────────────────────── */}
      <Tabs.Screen
        name="ikan"
        options={{
          title: "Ikan",
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                styles.tabLabel,
                focused ? styles.tabLabelActive : styles.tabLabelInactive,
              ]}
            >
              Ikan
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <TabPillWrapper focused={focused}>
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M2 12c3-4.5 7.5-6 11.5-4.2C15.4 8.7 16.8 10 18 12c-1.2 2-2.6 3.3-4.5 4.2C9.5 18 5 16.5 2 12z"
                  stroke={focused ? COLORS.accent : COLORS.muted}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M18 12l4-3.5v7z"
                  stroke={focused ? COLORS.accent : COLORS.muted}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TabPillWrapper>
          ),
        }}
      />

      {/* ── Tab 4: Tugas (Todo List) ─────────────────────────── */}
      <Tabs.Screen
        name="todo"
        options={{
          title: "Tugas",
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                styles.tabLabel,
                focused ? styles.tabLabelActive : styles.tabLabelInactive,
              ]}
            >
              Tugas
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <TabPillWrapper focused={focused}>
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M9 6h11M9 12h11M9 18h11M3.5 6l1.2 1.2L7 4.8M3.5 12l1.2 1.2L7 10.8M3.5 18l1.2 1.2L7 16.8"
                  stroke={focused ? COLORS.accent : COLORS.muted}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TabPillWrapper>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: Platform.OS === "ios" ? 82 : 68,
    paddingTop: 6,
    paddingBottom: Platform.OS === "ios" ? 22 : 10,
    elevation: 8,
    shadowColor: COLORS.ink,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  tabBarItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    width: 56,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  activePill: {
    backgroundColor: COLORS.accentSoft,
  },
  tabLabel: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    marginTop: 2,
  },
  tabLabelActive: {
    color: COLORS.accent,
    fontWeight: "700",
  },
  tabLabelInactive: {
    color: COLORS.muted,
    fontWeight: "500",
  },
});
