import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
    COLORS,
    KONDISI_IKAN_COLOR,
    RADIUS,
    SPACING,
} from "../constants/theme";
import { Ikan } from "../types";

interface CardIkanProps {
  ikan: Ikan;
  namaKolam: string;
  onEdit: (ikan: Ikan) => void;
  onDelete: (id: string) => void;
}

export default function CardIkan({
  ikan,
  namaKolam,
  onEdit,
  onDelete,
}: CardIkanProps) {
  const kondisiColor = KONDISI_IKAN_COLOR[ikan.kondisi];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.varietas}>{ikan.varietas}</Text>
        <View style={[styles.badge, { backgroundColor: kondisiColor }]}>
          <Text style={styles.badgeText}>{ikan.kondisi}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.label}>Kolam</Text>
        <Text style={styles.value}>{namaKolam}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>Ukuran</Text>
        <Text style={styles.value}>{ikan.ukuranCm} cm</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>Jumlah</Text>
        <Text style={styles.value}>{ikan.jumlah} ekor</Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.actionButton} onPress={() => onEdit(ikan)}>
          <Ionicons name="create-outline" size={20} color={COLORS.primary} />
          <Text style={[styles.actionText, { color: COLORS.primary }]}>
            Edit
          </Text>
        </Pressable>
        <Pressable
          style={styles.actionButton}
          onPress={() => onDelete(ikan.id)}
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
  varietas: {
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
