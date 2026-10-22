import { StyleSheet, Text, View } from "react-native";

import { COLORS, SPACING } from "../constants/theme";

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
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  value: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: "500",
  },
});
