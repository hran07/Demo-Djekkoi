import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { COLORS } from "../constants/theme";
import { DataProvider } from "../context/DataContext";

export default function RootLayout() {
  return (
    <DataProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.surface,
          headerTitleStyle: { fontWeight: "700" },
          headerBackTitle: "Kembali",
        }}
      >
        {/* Tabs punya header sendiri, jadi header Stack disembunyikan */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="kolam/[id]" options={{ title: "Detail Kolam" }} />
        <Stack.Screen name="ikan/[id]" options={{ title: "Detail Ikan" }} />
      </Stack>
    </DataProvider>
  );
}
