import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS, FONTS } from '../constants/theme';

export interface SelectOption {
  label: string;
  value: string;
}

export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select';
  placeholder?: string;
  options?: SelectOption[];
  suggestions?: string[];
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
    acc[field.key] = field.type === 'select' && field.options?.length ? field.options[0].value : '';
    return acc;
  }, {});
}

function filterSuggestions(suggestions: string[], input: string): string[] {
  const query = input.trim().toLowerCase();
  const cocok = suggestions.filter((item) => {
    const lower = item.toLowerCase();
    return lower !== query && (query === '' || lower.includes(query));
  });
  return cocok.sort((a, b) => {
    const aStarts = a.toLowerCase().startsWith(query) ? 0 : 1;
    const bStarts = b.toLowerCase().startsWith(query) ? 0 : 1;
    return aStarts - bStarts;
  });
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
  const [focusedKey, setFocusedKey] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValues({ ...buildEmptyValues(fields), ...initialValues });
    } else {
      setFocusedKey(null);
    }
  }, [visible, fields, initialValues]);

  const setValue = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = () => {
    const adaKosong = fields.some((f) => !values[f.key] || values[f.key].trim() === '');
    if (adaKosong) {
      return;
    }
    onSubmit(values);
  };

  const renderSuggestions = (field: FormField) => {
    if (field.type !== 'text' || !field.suggestions) return null;

    const value = values[field.key] ?? '';
    const aktif = focusedKey === field.key || value.trim() !== '';
    if (!aktif) return null;

    const daftar = filterSuggestions(field.suggestions, value);
    if (daftar.length === 0) return null;

    return (
      <View style={styles.suggestionWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.suggestionRow}
        >
          {daftar.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.suggestionChip}
              onPress={() => setValue(field.key, item)}
            >
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
          {/* Grabber Bar */}
          <View style={styles.grabber} />

          {/* Header Title & Close Button */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
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

          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            keyboardShouldPersistTaps="handled"
          >
            {fields.map((field) => (
              <View key={field.key} style={styles.fieldGroup}>
                <Text style={styles.label}>{field.label}</Text>

                {field.type === 'select' ? (
                  <View style={styles.optionRow}>
                    {field.options?.map((opt) => {
                      const selected = values[field.key] === opt.value;
                      return (
                        <TouchableOpacity
                          key={opt.value}
                          style={[
                            styles.optionChip,
                            selected ? styles.optionChipSelected : styles.optionChipUnselected,
                          ]}
                          onPress={() => setValue(field.key, opt.value)}
                        >
                          <Text
                            style={[
                              styles.optionText,
                              selected ? styles.optionTextSelected : styles.optionTextUnselected,
                            ]}
                          >
                            {opt.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : (
                  <TextInput
                    style={[
                      styles.input,
                      focusedKey === field.key && styles.inputFocused,
                    ]}
                    value={values[field.key]}
                    onChangeText={(text) =>
                      setValue(
                        field.key,
                        field.type === 'number' ? text.replace(/[^0-9]/g, '') : text
                      )
                    }
                    onFocus={() => setFocusedKey(field.key)}
                    onBlur={() => setFocusedKey((prev) => (prev === field.key ? null : prev))}
                    placeholder={field.placeholder}
                    placeholderTextColor={COLORS.muted}
                    keyboardType={field.type === 'number' ? 'numeric' : 'default'}
                    autoCapitalize={field.suggestions ? 'words' : undefined}
                  />
                )}

                {renderSuggestions(field)}
              </View>
            ))}
          </ScrollView>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitBtnText}>Simpan</Text>
          </TouchableOpacity>

          {/* Batal Button */}
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
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
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(11, 43, 51, 0.5)',
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
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '90%',
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
    backgroundColor: '#C9D6D8',
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.ink,
  },
  closeBtn: {
    width: 44,
    height: 44,
    marginRight: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    maxHeight: 380,
  },
  bodyContent: {
    gap: 14,
    paddingBottom: 10,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.muted,
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontFamily: FONTS.sans,
    fontSize: 15,
    color: COLORS.ink,
    backgroundColor: COLORS.surface,
  },
  inputFocused: {
    borderColor: COLORS.accent,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionChipSelected: {
    backgroundColor: COLORS.headerDark,
    borderColor: COLORS.headerDark,
  },
  optionChipUnselected: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  optionText: {
    fontFamily: FONTS.sans,
    fontSize: 13,
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  optionTextUnselected: {
    color: COLORS.ink,
    fontWeight: '500',
  },
  suggestionWrapper: {
    marginTop: 4,
  },
  suggestionRow: {
    gap: 8,
  },
  suggestionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.accentSoft,
  },
  suggestionText: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '600',
  },
  submitBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  submitBtnText: {
    fontFamily: FONTS.sans,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  cancelBtnText: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.muted,
  },
});
