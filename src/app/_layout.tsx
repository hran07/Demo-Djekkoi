import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { DataProvider } from "../context/DataContext";

export default function RootLayout() {
  return (
    <DataProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </DataProvider>
  );
}
