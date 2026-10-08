import { Ionicons } from "@expo/vector-icons";
import { ComponentProps, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import {
    COLORS,
    KONDISI_IKAN_COLOR,
    RADIUS,
    SPACING,
} from "../../constants/theme";
import { useData } from "../../context/DataContext";
import { KondisiIkan } from "../../types";

type IconName = ComponentProps<typeof Ionicons>["name"];

interface StatCardProps {
  label: string;
  value: number;
  unit?: string;
  color: string;
  icon: IconName;
}

function StatCard({ label, value, unit, color, icon }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.iconWrapper, { backgroundColor: color }]}>
        <Ionicons name={icon} size={20} color={COLORS.surface} />
      </View>
      <Text style={styles.statValue}>{value.toLocaleString("id-ID")}</Text>
      <Text style={styles.statLabel}>
        {unit ? `${label} (${unit})` : label}
      </Text>
    </View>
  );
}

const KONDISI_LIST: { kondisi: KondisiIkan; icon: IconName }[] = [
  { kondisi: "Sehat", icon: "heart-outline" },
  { kondisi: "Karantina", icon: "alert-circle-outline" },
  { kondisi: "Sakit", icon: "medkit-outline" },
];

export default function DashboardScreen() {
  const { kolam, ikan } = useData();

  // Total ikan dihitung dari jumlah ekor, bukan dari banyaknya baris data
  const totalIkan = useMemo(
    () => ikan.reduce((sum, item) => sum + item.jumlah, 0),
    [ikan],
  );

  const jumlahPerKondisi = useMemo(
    () =>
      KONDISI_LIST.map(({ kondisi, icon }) => ({
        kondisi,
        icon,
        jumlah: ikan
          .filter((item) => item.kondisi === kondisi)
          .reduce((sum, item) => sum + item.jumlah, 0),
      })),
    [ikan],
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Ringkasan</Text>
      <View style={styles.row}>
        <StatCard
          label="Total Kolam"
          value={kolam.length}
          color={COLORS.primary}
          icon="water-outline"
        />
        <StatCard
          label="Total Ikan"
          unit="ekor"
          value={totalIkan}
          color={COLORS.secondary}
          icon="fish-outline"
        />
      </View>

      <Text style={styles.sectionTitle}>Kondisi Ikan</Text>
      <View style={styles.row}>
        {jumlahPerKondisi.map(({ kondisi, icon, jumlah }) => (
          <StatCard
            key={kondisi}
            label={kondisi}
            value={jumlah}
            color={KONDISI_IKAN_COLOR[kondisi]}
            icon={icon}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
