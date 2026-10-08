import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
    COLORS,
    RADIUS,
    SPACING,
    STATUS_KOLAM_COLOR,
} from "../constants/theme";
import { Kolam } from "../types";

interface CardKolamProps {
  kolam: Kolam;
  onEdit: (kolam: Kolam) => void;
  onDelete: (id: string) => void;
}

export default function CardKolam({ kolam, onEdit, onDelete }: CardKolamProps) {
  const statusColor = STATUS_KOLAM_COLOR[kolam.status];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.nama}>{kolam.nama}</Text>
        <View style={[styles.badge, { backgroundColor: statusColor }]}>
          <Text style={styles.badgeText}>{kolam.status}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.label}>Jenis</Text>
        <Text style={styles.value}>{kolam.jenis}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>Kapasitas</Text>
        <Text style={styles.value}>
          {kolam.kapasitas.toLocaleString("id-ID")}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.actionButton} onPress={() => onEdit(kolam)}>
          <Ionicons name="create-outline" size={20} color={COLORS.primary} />
          <Text style={[styles.actionText, { color: COLORS.primary }]}>
            Edit
          </Text>
        </Pressable>
        <Pressable
          style={styles.actionButton}
          onPress={() => onDelete(kolam.id)}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
          <Text style={[styles.actionText, { color: COLORS.danger }]}>
            Hapus
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: SPACING.md,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nama: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.secondary,
  },
  badge: {
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs,
    borderRadius: 999,
  },
  badgeText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: "600",
  },
  info: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: SPACING.md,
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm + 4,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
