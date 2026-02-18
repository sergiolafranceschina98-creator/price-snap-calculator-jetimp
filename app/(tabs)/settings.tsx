
import React from 'react';
import { colors, typography, spacing } from '@/styles/commonStyles';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useSettings } from '@/contexts/SettingsContext';

type Unit = 'g' | 'kg' | 'ml' | 'L' | 'oz' | 'lb' | 'pcs';
type DecimalPrecision = 2 | 3 | 4;

const UNITS: Unit[] = ['g', 'kg', 'ml', 'L', 'oz', 'lb', 'pcs'];
const DECIMAL_OPTIONS: DecimalPrecision[] = [2, 3, 4];

export default function SettingsScreen() {
  const { defaultUnit, decimalPrecision, updateDefaultUnit, updateDecimalPrecision } = useSettings();

  const handleUnitChange = async (unit: Unit) => {
    console.log('User selected default unit:', unit);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await updateDefaultUnit(unit);
  };

  const handlePrecisionChange = async (precision: DecimalPrecision) => {
    console.log('User selected decimal precision:', precision);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await updateDecimalPrecision(precision);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Settings',
          headerLargeTitle: true,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DEFAULT UNIT</Text>
          <View style={styles.card}>
            <View style={styles.unitGrid}>
              {UNITS.map((unit) => (
                <React.Fragment key={unit}>
                  <TouchableOpacity
                    style={[
                      styles.unitButton,
                      defaultUnit === unit && styles.unitButtonActive,
                    ]}
                    onPress={() => handleUnitChange(unit)}
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
              {DECIMAL_OPTIONS.map((precision) => {
                const exampleText = `e.g. $${(1.23456).toFixed(precision)}`;
                return (
                  <React.Fragment key={precision}>
                    <TouchableOpacity
                      style={[
                        styles.precisionButton,
                        decimalPrecision === precision && styles.precisionButtonActive,
                      ]}
                      onPress={() => handlePrecisionChange(precision)}
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

        <View style={styles.footer}>
          <Text style={styles.footerText}>PriceSnap v1.0</Text>
          <Text style={styles.footerSubtext}>Know the real price instantly</Text>
        </View>
      </ScrollView>
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
    paddingBottom: spacing.xxl,
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
});
