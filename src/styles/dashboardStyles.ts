import { StyleSheet } from "react-native";

import { COLORS, RADIUS, SPACING } from "../constants/theme";

export const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
    gap: SPACING.gap,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.secondary,
    marginTop: SPACING.sm,
  },
  row: {
    flexDirection: "row",
    gap: SPACING.gap,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: SPACING.md,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.secondary,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
});
