import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

interface InfoRowProps {
  label: string;
  value: string;
}

export default function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  label: {
    fontFamily: FONTS.sans,
    color: COLORS.muted,
    fontSize: 14,
  },
  value: {
    fontFamily: FONTS.sans,
    color: COLORS.ink,
    fontSize: 14,
    fontWeight: '600',
  },
});
