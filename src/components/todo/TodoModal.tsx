import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { COLORS, FONTS } from "../../constants/theme";
import { Todo, TodoPeriod } from "../../types/todo";

interface TodoModalProps {
  visible: boolean;
  initialTodo?: Todo | null;
  defaultPeriod?: TodoPeriod;
  onClose: () => void;
  onSubmit: (title: string, period: TodoPeriod) => Promise<void>;
}

export function TodoModal({
  visible,
  initialTodo,
  defaultPeriod = "harian",
  onClose,
  onSubmit,
}: TodoModalProps) {
  const [title, setTitle] = useState("");
  const [period, setPeriod] = useState<TodoPeriod>(defaultPeriod);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      if (initialTodo) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTitle(initialTodo.title);
        setPeriod(initialTodo.period);
      } else {
        setTitle("");
        setPeriod(defaultPeriod);
      }
      setIsSubmitting(false);
    }
  }, [visible, initialTodo, defaultPeriod]);

  const handleSubmit = async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      Alert.alert("Input Tidak Valid", "Judul tugas tidak boleh kosong.");
      return;
    }
    if (trimmed.length > 80) {
      Alert.alert("Input Tidak Valid", "Judul tugas maksimal 80 karakter.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(trimmed, period);
      onClose();
    } catch (error: any) {
      Alert.alert(
        "Gagal Menyimpan",
        error?.message || "Terjadi kesalahan saat menyimpan tugas.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = Boolean(initialTodo);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
          {/* Grabber Bar */}
          <View style={styles.grabber} />

          {/* Header Title & Close Button */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {isEditing ? "Edit tugas" : "Tambah tugas"}
            </Text>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Tutup"
            >
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M6 6l12 12M18 6L6 18"
                  stroke={COLORS.muted}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* Diulang (Segmented Toggle) */}
          <Text style={styles.fieldLabel}>Diulang</Text>
          <View style={styles.periodRow}>
            <TouchableOpacity
              style={[
                styles.periodBtn,
                period === "harian"
                  ? styles.periodBtnActive
                  : styles.periodBtnInactive,
              ]}
              onPress={() => setPeriod("harian")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.periodBtnText,
                  period === "harian"
                    ? styles.periodTextActive
                    : styles.periodTextInactive,
                ]}
              >
                Harian
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.periodBtn,
                period === "mingguan"
                  ? styles.periodBtnActive
                  : styles.periodBtnInactive,
              ]}
              onPress={() => setPeriod("mingguan")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.periodBtnText,
                  period === "mingguan"
                    ? styles.periodTextActive
                    : styles.periodTextInactive,
                ]}
              >
                Mingguan
              </Text>
            </TouchableOpacity>
          </View>

          {/* Aktivitas Perawatan Input */}
          <Text style={styles.fieldLabel}>Aktivitas perawatan</Text>
          <TextInput
            style={styles.textInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Contoh: Cek kadar garam air"
            placeholderTextColor={COLORS.muted}
            maxLength={80}
            autoFocus
          />

          {/* Hint & Character Counter */}
          <View style={styles.metaRow}>
            <Text style={styles.hintText}>Contoh: cek kadar garam air</Text>
            <Text style={styles.counterText}>{title.length}/80</Text>
          </View>

          {/* Info Callout Banner */}
          <View style={styles.infoBanner}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path
                d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"
                stroke={COLORS.accent}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            <Text style={styles.submitBtnText}>
              {isSubmitting
                ? "Menyimpan..."
                : isEditing
                  ? "Simpan perubahan"
                  : "Simpan tugas"}
            </Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={onClose}
            disabled={isSubmitting}
          >
            <Text style={styles.cancelBtnText}>Batal</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(11, 43, 51, 0.5)",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    shadowColor: COLORS.headerDark,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.18,
    shadowRadius: 30,
    elevation: 16,
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#C9D6D8",
    alignSelf: "center",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: {
    fontFamily: FONTS.serif,
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.ink,
  },
  closeBtn: {
    width: 44,
    height: 44,
    marginRight: -10,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldLabel: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.muted,
    marginTop: 12,
    marginBottom: 8,
  },
  periodRow: {
    flexDirection: "row",
    gap: 8,
  },
  periodBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  periodBtnActive: {
    backgroundColor: COLORS.headerDark,
    borderWidth: 1,
    borderColor: COLORS.headerDark,
  },
  periodBtnInactive: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  periodBtnText: {
    fontFamily: FONTS.sans,
    fontSize: 14,
  },
  periodTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  periodTextInactive: {
    color: COLORS.ink,
    fontWeight: "500",
  },
  textInput: {
    boxSizing: "border-box" as any,
    height: 52,
    borderWidth: 2,
    borderColor: COLORS.accent,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontFamily: FONTS.sans,
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.ink,
    backgroundColor: COLORS.surface,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  hintText: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.muted,
  },
  counterText: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.muted,
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.accentSoft,
  },
  infoBannerText: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.headerDark,
    flex: 1,
  },
  submitBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  submitBtnText: {
    fontFamily: FONTS.sans,
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  cancelBtn: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  cancelBtnText: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.muted,
  },
});
