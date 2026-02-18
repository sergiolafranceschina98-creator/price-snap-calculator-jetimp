
import React, { useState, useEffect } from 'react';
import { colors, typography, spacing } from '@/styles/commonStyles';
import { Stack } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

type Unit = 'g' | 'kg' | 'ml' | 'L' | 'oz' | 'lb' | 'pcs';
type DecimalPrecision = 2 | 3 | 4;

const UNITS: Unit[] = ['g', 'kg', 'ml', 'L', 'oz', 'lb', 'pcs'];
const DECIMAL_OPTIONS: DecimalPrecision[] = [2, 3, 4];

export default function SettingsScreen() {
  const [defaultUnit, setDefaultUnit] = useState<Unit>('g');
  const [decimalPrecision, setDecimalPrecision] = useState<DecimalPrecision>(3);
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
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const saveDefaultUnit = async (unit: Unit) => {
    console.log('User selected default unit:', unit);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await AsyncStorage.setItem('defaultUnit', unit);
      setDefaultUnit(unit);
    } catch (error) {
      console.log('Error saving default unit:', error);
    }
  };

  const saveDecimalPrecision = async (precision: DecimalPrecision) => {
    console.log('User selected decimal precision:', precision);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await AsyncStorage.setItem('decimalPrecision', precision.toString());
      setDecimalPrecision(precision);
    } catch (error) {
      console.log('Error saving decimal precision:', error);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('calculationHistory');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      console.log('Cleared history from settings');
    } catch (error) {
      console.log('Error clearing history:', error);
    }
  };

  const handleClearHistoryPress = () => {
    console.log('User tapped Clear History');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setClearModalVisible(true);
  };

  const confirmClearHistory = () => {
    clearHistory();
    setClearModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DEFAULT UNIT</Text>
          <View style={styles.card}>
            <View style={styles.unitGrid}>
              {UNITS.map((unit, index) => (
                <React.Fragment key={unit}>
                  <TouchableOpacity
                    style={[
                      styles.unitButton,
                      defaultUnit === unit && styles.unitButtonActive,
                    ]}
                    onPress={() => saveDefaultUnit(unit)}
                  >
                    <Text
                      style={[
                        styles.unitButtonText,
                        defaultUnit === unit && styles.unitButtonTextActive,
                      ]}
                    >
                      {unit}
                    </Text>
                  </TouchableOpacity>
                </React.Fragment>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DECIMAL PRECISION</Text>
          <View style={styles.card}>
            <View style={styles.precisionRow}>
              {DECIMAL_OPTIONS.map((precision, index) => {
                const exampleText = `e.g. $${(1.23456).toFixed(precision)}`;
                return (
                  <React.Fragment key={precision}>
                    <TouchableOpacity
                      style={[
                        styles.precisionButton,
                        decimalPrecision === precision && styles.precisionButtonActive,
                      ]}
                      onPress={() => saveDecimalPrecision(precision)}
                    >
                      <Text
                        style={[
                          styles.precisionButtonText,
                          decimalPrecision === precision && styles.precisionButtonTextActive,
                        ]}
                      >
                        {precision}
                      </Text>
                      <Text
                        style={[
                          styles.precisionExample,
                          decimalPrecision === precision && styles.precisionExampleActive,
                        ]}
                      >
                        {exampleText}
                      </Text>
                    </TouchableOpacity>
                  </React.Fragment>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATA</Text>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearHistoryPress}>
            <Text style={styles.clearButtonText}>Clear History</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>PriceSnap v1.0</Text>
          <Text style={styles.footerSubtext}>Know the real price instantly</Text>
        </View>
      </ScrollView>

      <Modal
        visible={clearModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setClearModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Clear History?</Text>
            <Text style={styles.modalText}>
              All your calculation history will be permanently deleted.
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: spacing.xxl + spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.title,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.label,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: spacing.lg,
    shadowColor: colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  unitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  unitButton: {
    paddingHorizontal: spacing.md + 4,
    paddingVertical: spacing.sm + 4,
    borderRadius: 12,
    backgroundColor: colors.inputBackground,
    borderWidth: 2,
    borderColor: colors.border,
    minWidth: 60,
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  unitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  unitButtonTextActive: {
    color: '#FFFFFF',
  },
  precisionRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  precisionButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 14,
    backgroundColor: colors.inputBackground,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  precisionButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  precisionButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  precisionButtonTextActive: {
    color: '#FFFFFF',
  },
  precisionExample: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  precisionExampleActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  clearButton: {
    backgroundColor: colors.error,
    borderRadius: 16,
    padding: spacing.md + 4,
    alignItems: 'center',
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  clearButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  footerSubtext: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
    shadowColor: colors.shadowDark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  modalTitle: {
    ...typography.heading,
    fontSize: 22,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  modalText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
    padding: spacing.md + 2,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: colors.inputBackground,
    borderWidth: 2,
    borderColor: colors.border,
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
