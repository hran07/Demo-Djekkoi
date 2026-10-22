import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import InfoRow from "../../components/InfoRow";
import {
  COLORS,
  KONDISI_IKAN_COLOR,
  RADIUS,
  SPACING,
} from "../../constants/theme";
import { useData } from "../../context/DataContext";
import { useSafeBack } from "../../hooks/useSafeBack";

export default function DetailIkanScreen() {
  // Nilai [id] dari nama file, contoh: /ikan/i1 -> id = "i1"
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const goBack = useSafeBack();
  const { kolam, ikan, deleteIkan } = useData();

  const item = ikan.find((x) => x.id === id);
  const kolamIkan = kolam.find((x) => x.id === item?.kolamId);

  if (!item) {
    return (
      <View style={styles.empty}>
        <Ionicons name="fish-outline" size={48} color={COLORS.textMuted} />
        <Text style={styles.emptyText}>Data ikan tidak ditemukan.</Text>
        <Pressable style={styles.secondaryButton} onPress={goBack}>
          <Text style={styles.secondaryText}>Kembali</Text>
        </Pressable>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert("Hapus Ikan", `Hapus data ${item.varietas}?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => {
          deleteIkan(item.id);
          goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Judul header mengikuti varietas ikan yang sedang dibuka */}
      <Stack.Screen options={{ title: item.varietas }} />

      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{item.varietas}</Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: KONDISI_IKAN_COLOR[item.kondisi] },
            ]}
          >
            <Text style={styles.badgeText}>{item.kondisi}</Text>
          </View>
        </View>

        <InfoRow label="Kolam" value={kolamIkan?.nama ?? "-"} />
        <InfoRow label="Ukuran" value={`${item.ukuranCm} cm`} />
        <InfoRow label="Jumlah" value={`${item.jumlah} ekor`} />
      </View>

      {kolamIkan && (
        <Pressable
          style={styles.primaryButton}
          onPress={() =>
            router.push({
              pathname: "/kolam/[id]",
              params: { id: kolamIkan.id },
            })
          }
        >
          <Ionicons name="water-outline" size={20} color={COLORS.surface} />
          <Text style={styles.primaryText}>Lihat {kolamIkan.nama}</Text>
        </Pressable>
      )}

      <Pressable style={styles.dangerButton} onPress={handleDelete}>
        <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
        <Text style={styles.dangerText}>Hapus Ikan</Text>
      </Pressable>
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
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.gap,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.primary,
  },
  primaryText: {
    color: COLORS.surface,
    fontWeight: "600",
    fontSize: 16,
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.gap,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.danger,
    backgroundColor: COLORS.surface,
  },
  dangerText: {
    color: COLORS.danger,
    fontWeight: "600",
    fontSize: 16,
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
