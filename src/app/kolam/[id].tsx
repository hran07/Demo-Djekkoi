import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import InfoRow from "../../components/InfoRow";
import {
  COLORS,
  KONDISI_IKAN_COLOR,
  RADIUS,
  SPACING,
  STATUS_KOLAM_COLOR,
} from "../../constants/theme";
import { useData } from "../../context/DataContext";
import { useSafeBack } from "../../hooks/useSafeBack";

export default function DetailKolamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const goBack = useSafeBack();
  const { kolam, ikan } = useData();

  const item = kolam.find((x) => x.id === id);

  const ikanDiKolam = useMemo(
    () => ikan.filter((x) => x.kolamId === id),
    [ikan, id],
  );

  const totalEkor = useMemo(
    () => ikanDiKolam.reduce((total, x) => total + x.jumlah, 0),
    [ikanDiKolam],
  );

  if (!item) {
    return (
      <View style={styles.empty}>
        <Ionicons name="water-outline" size={48} color={COLORS.textMuted} />
        <Text style={styles.emptyText}>Data kolam tidak ditemukan.</Text>
        <Pressable style={styles.secondaryButton} onPress={goBack}>
          <Text style={styles.secondaryText}>Kembali</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: item.nama }} />

      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{item.nama}</Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: STATUS_KOLAM_COLOR[item.status] },
            ]}
          >
            <Text style={styles.badgeText}>{item.status}</Text>
          </View>
        </View>

        <InfoRow label="Jenis" value={item.jenis} />
        <InfoRow
          label="Kapasitas"
          value={item.kapasitas.toLocaleString("id-ID")}
        />
        <InfoRow label="Total ikan" value={`${totalEkor} ekor`} />
      </View>

      <Text style={styles.sectionTitle}>Ikan di kolam ini</Text>

      {ikanDiKolam.length === 0 ? (
        <Text style={styles.emptyText}>Belum ada ikan di kolam ini.</Text>
      ) : (
        ikanDiKolam.map((x) => (
          <Pressable
            key={x.id}
            style={styles.ikanRow}
            onPress={() =>
              router.push({ pathname: "/ikan/[id]", params: { id: x.id } })
            }
          >
            <View style={styles.ikanInfo}>
              <Text style={styles.ikanName}>{x.varietas}</Text>
              <Text style={styles.ikanMeta}>
                {x.ukuranCm} cm · {x.jumlah} ekor
              </Text>
            </View>
            <View
              style={[
                styles.dot,
                { backgroundColor: KONDISI_IKAN_COLOR[x.kondisi] },
              ]}
            />
            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.textMuted}
            />
          </Pressable>
        ))
      )}
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
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.secondary,
  },
  badge: {
    paddingHorizontal: SPACING.gap,
    paddingVertical: SPACING.xs,
    borderRadius: 999,
  },
  badgeText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.secondary,
    marginTop: SPACING.sm,
  },
  ikanRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.gap,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ikanInfo: {
    flex: 1,
    gap: SPACING.xs,
  },
  ikanName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.secondary,
  },
  ikanMeta: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.md,
    backgroundColor: COLORS.background,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  secondaryButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  secondaryText: {
    color: COLORS.secondary,
    fontWeight: "600",
  },
});
