import { Ionicons } from "@expo/vector-icons";
import { ComponentProps, useMemo } from "react";
import { ScrollView, Text, View } from "react-native";

import { COLORS, KONDISI_IKAN_COLOR } from "../../constants/theme";
import { useData } from "../../context/DataContext";
import { dashboardStyles as styles } from "../../styles/dashboardStyles";
import { Ikan, KondisiIkan } from "../../types";

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

function hitungJumlahIkan(daftar: Ikan[], kondisi?: KondisiIkan): number {
  let total = 0;
  for (const item of daftar) {
    if (kondisi === undefined || item.kondisi === kondisi) {
      total += item.jumlah;
    }
  }
  return total;
}

const KONDISI_LIST: { kondisi: KondisiIkan; icon: IconName }[] = [
  { kondisi: "Sehat", icon: "heart-outline" },
  { kondisi: "Karantina", icon: "alert-circle-outline" },
  { kondisi: "Sakit", icon: "medkit-outline" },
];

export default function DashboardScreen() {
  const { kolam, ikan } = useData();

  const totalIkan = useMemo(() => hitungJumlahIkan(ikan), [ikan]);

  const jumlahPerKondisi = useMemo(
    () =>
      KONDISI_LIST.map(({ kondisi, icon }) => ({
        kondisi,
        icon,
        jumlah: hitungJumlahIkan(ikan, kondisi),
      })),
    [ikan],
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {}
      <Text style={{ color: COLORS.textMuted, fontSize: 13 }}>
        Data tersimpan sementara di memori aplikasi.
      </Text>

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
