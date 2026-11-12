import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { COLORS, FONTS } from '../constants/theme';
import { DataProvider } from '../context/DataContext';

export default function RootLayout() {
  return (
    <DataProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.headerDark },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontFamily: FONTS.serif,
            fontWeight: '700',
            fontSize: 18,
          },
          headerBackTitle: 'Kembali',
          contentStyle: { backgroundColor: COLORS.bg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="kolam/[id]" options={{ title: 'Detail Kolam' }} />
        <Stack.Screen name="ikan/[id]" options={{ title: 'Detail Ikan' }} />
      </Stack>
    </DataProvider>
  );
}
