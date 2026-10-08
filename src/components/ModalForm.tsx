import { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { COLORS, RADIUS, SPACING } from "../constants/theme";

export interface SelectOption {
  label: string;
  value: string;
}

export interface FormField {
  key: string;
  label: string;
  type: "text" | "number" | "select";
  placeholder?: string;
  options?: SelectOption[]; // wajib untuk type 'select'
}

export type FormValues = Record<string, string>;

interface ModalFormProps {
  visible: boolean;
  title: string;
  fields: FormField[];
  initialValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onClose: () => void;
}

function buildEmptyValues(fields: FormField[]): FormValues {
  return fields.reduce<FormValues>((acc, field) => {
    acc[field.key] = "";
    return acc;
  }, {});
}

export default function ModalForm({
  visible,
  title,
  fields,
  initialValues,
  onSubmit,
  onClose,
}: ModalFormProps) {
  const [values, setValues] = useState<FormValues>(buildEmptyValues(fields));

  // Reset isi form setiap modal dibuka (kosong untuk tambah, terisi untuk edit)
  useEffect(() => {
    if (visible) {
      setValues({ ...buildEmptyValues(fields), ...initialValues });
    }
  }, [visible, fields, initialValues]);

  const setValue = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const isValid = fields.every((field) => values[field.key]?.trim() !== "");

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit(values);
  };

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
        <View style={styles.sheet}>
          <Text style={styles.title}>{title}</Text>

          <ScrollView
            contentContainerStyle={styles.form}
            keyboardShouldPersistTaps="handled"
          >
            {fields.map((field) => (
              <View key={field.key} style={styles.fieldGroup}>
                <Text style={styles.label}>{field.label}</Text>

                {field.type === "select" ? (
                  <View style={styles.optionRow}>
                    {field.options?.map((option) => {
                      const selected = values[field.key] === option.value;
                      return (
                        <Pressable
                          key={option.value}
                          style={[
                            styles.option,
                            selected && styles.optionSelected,
                          ]}
                          onPress={() => setValue(field.key, option.value)}
                        >
                          <Text
                            style={[
                              styles.optionText,
                              selected && styles.optionTextSelected,
                            ]}
                          >
                            {option.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                ) : (
                  <TextInput
                    style={styles.input}
                    value={values[field.key]}
                    onChangeText={(text) =>
                      setValue(
                        field.key,
                        field.type === "number"
                          ? text.replace(/[^0-9.]/g, "")
                          : text,
                      )
                    }
                    placeholder={field.placeholder}
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType={
                      field.type === "number" ? "numeric" : "default"
                    }
                  />
                )}
              </View>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>Batal</Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                styles.submitButton,
                !isValid && styles.submitDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!isValid}
            >
              <Text style={styles.submitText}>Simpan</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.5)",
  },
  sheet: {
    maxHeight: "85%",
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.modal,
    borderTopRightRadius: RADIUS.modal,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.secondary,
  },
  form: {
    gap: SPACING.gap,
  },
  fieldGroup: {
    gap: SPACING.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.secondary,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.sm + 4,
    fontSize: 16,
    color: COLORS.secondary,
    backgroundColor: COLORS.background,
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  option: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  optionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    fontSize: 14,
    color: COLORS.secondary,
  },
  optionTextSelected: {
    color: COLORS.surface,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    gap: SPACING.gap,
  },
  button: {
    flex: 1,
    alignItems: "center",
    paddingVertical: SPACING.sm + 4,
    borderRadius: RADIUS.card,
  },
  cancelButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelText: {
    color: COLORS.secondary,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: COLORS.primary,
  },
  submitDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: COLORS.surface,
    fontWeight: "600",
  },
});
