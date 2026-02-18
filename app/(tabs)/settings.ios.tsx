
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { colors, typography, spacing } from '@/styles/commonStyles';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

type Unit = 'g' | 'kg' | 'ml' | 'L' | 'oz' | 'lb' | 'pcs';
type DecimalPrecision = 2 | 3 | 4;

const UNITS: Unit[] = ['g', 'kg', 'ml', 'L', 'oz', 'lb', 'pcs'];
const DECIMAL_OPTIONS: DecimalPrecision[] = [2, 3, 4];

export default function SettingsScreen() {
  const [defaultUnit, setDefaultUnit] = useState<Unit>('g');
  const [decimalPrecision, setDecimalPrecision] = useState<DecimalPrecision>(4);
  const [clearModalVisible, setClearModalVisible] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const unit = await AsyncStorage.getItem('defaultUnit');
      const precision = await AsyncStorage.getItem('decimalPrecision');

      if (unit) {
        setDefaultUnit(unit as Unit);
      }
      if (precision) {
        setDecimalPrecision(parseInt(precision) as DecimalPrecision);
      }
      console.log('Settings loaded');
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const saveDefaultUnit = async (unit: Unit) => {
    console.log('Saving default unit:', unit);
    Haptics.selectionAsync();
    setDefaultUnit(unit);
    try {
      await AsyncStorage.setItem('defaultUnit', unit);
      console.log('Default unit saved');
    } catch (error) {
      console.log('Error saving default unit:', error);
    }
  };

  const saveDecimalPrecision = async (precision: DecimalPrecision) => {
    console.log('Saving decimal precision:', precision);
    Haptics.selectionAsync();
    setDecimalPrecision(precision);
    try {
      await AsyncStorage.setItem('decimalPrecision', precision.toString());
      console.log('Decimal precision saved');
    } catch (error) {
      console.log('Error saving decimal precision:', error);
    }
  };

  const clearHistory = async () => {
    console.log('Clearing history from settings');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    try {
      await AsyncStorage.setItem('history', JSON.stringify([]));
      console.log('History cleared');
    } catch (error) {
      console.log('Error clearing history:', error);
    }
  };

  const handleClearHistoryPress = () => {
    setClearModalVisible(true);
  };

  const confirmClearHistory = () => {
    clearHistory();
    setClearModalVisible(false);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Default Unit</Text>
          <Text style={styles.sectionDescription}>
            Choose your preferred unit for calculations
          </Text>
          <View style={styles.optionsGrid}>
            {UNITS.map((unit) => {
              const isSelected = defaultUnit === unit;
              return (
                <TouchableOpacity
                  key={unit}
                  style={[
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected,
                  ]}
                  onPress={() => saveDefaultUnit(unit)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      isSelected && styles.optionButtonTextSelected,
                    ]}
                  >
                    {unit}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Decimal Precision</Text>
          <Text style={styles.sectionDescription}>
            Number of decimal places in results
          </Text>
          <View style={styles.optionsRow}>
            {DECIMAL_OPTIONS.map((precision) => {
              const isSelected = decimalPrecision === precision;
              return (
                <TouchableOpacity
                  key={precision}
                  style={[
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected,
                  ]}
                  onPress={() => saveDecimalPrecision(precision)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      isSelected && styles.optionButtonTextSelected,
                    ]}
                  >
                    {precision}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearHistoryPress}
          >
            <Text style={styles.dangerButtonText}>Clear History</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>PriceSnap v1.0</Text>
          <Text style={styles.footerSubtext}>
            Simple, fast, premium unit price calculator
          </Text>
        </View>

        <Modal
          visible={clearModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setClearModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Clear History?</Text>
              <Text style={styles.modalMessage}>
                This will permanently delete all your calculation history.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={() => setClearModalVisible(false)}
                >
                  <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonConfirm]}
                  onPress={confirmClearHistory}
                >
                  <Text style={styles.modalButtonTextConfirm}>Clear</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 48,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionDescription: {
    ...typography.subtitle,
    marginBottom: spacing.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  optionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    backgroundColor: colors.inputBackground,
    borderWidth: 2,
    borderColor: colors.border,
    minWidth: 60,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  optionButtonTextSelected: {
    color: '#FFFFFF',
  },
  dangerButton: {
    backgroundColor: colors.error,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  footerSubtext: {
    ...typography.subtitle,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  modalMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: colors.inputBackground,
  },
  modalButtonConfirm: {
    backgroundColor: colors.error,
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  modalButtonTextConfirm: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
