
import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { colors, typography, spacing } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Unit = 'g' | 'kg' | 'ml' | 'L' | 'oz' | 'lb' | 'pcs';
type DecimalPrecision = 2 | 3 | 4;

const UNITS: Unit[] = ['g', 'kg', 'ml', 'L', 'oz', 'lb', 'pcs'];
const DECIMAL_OPTIONS: DecimalPrecision[] = [2, 3, 4];

export default function SettingsScreen() {
  const [defaultUnit, setDefaultUnit] = useState<Unit>('g');
  const [decimalPrecision, setDecimalPrecision] = useState<DecimalPrecision>(4);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedUnit = await AsyncStorage.getItem('defaultUnit');
      const storedPrecision = await AsyncStorage.getItem('decimalPrecision');
      
      if (storedUnit) {
        setDefaultUnit(storedUnit as Unit);
      }
      if (storedPrecision) {
        setDecimalPrecision(parseInt(storedPrecision) as DecimalPrecision);
      }
      
      console.log('Settings loaded:', { unit: storedUnit, precision: storedPrecision });
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const saveDefaultUnit = async (unit: Unit) => {
    console.log('User changed default unit to:', unit);
    setDefaultUnit(unit);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    try {
      await AsyncStorage.setItem('defaultUnit', unit);
      console.log('Default unit saved');
    } catch (error) {
      console.log('Error saving default unit:', error);
    }
  };

  const saveDecimalPrecision = async (precision: DecimalPrecision) => {
    console.log('User changed decimal precision to:', precision);
    setDecimalPrecision(precision);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    try {
      await AsyncStorage.setItem('decimalPrecision', precision.toString());
      console.log('Decimal precision saved');
    } catch (error) {
      console.log('Error saving decimal precision:', error);
    }
  };

  const clearHistory = async () => {
    console.log('User tapped Clear History');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all calculation history?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('priceSnapHistory');
              console.log('History cleared from settings');
              Alert.alert('Success', 'History has been cleared');
            } catch (error) {
              console.log('Error clearing history:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Settings',
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Default Unit Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Default Unit</Text>
          <Text style={styles.sectionSubtitle}>
            Choose your preferred unit for calculations
          </Text>
          
          <View style={styles.optionsGrid}>
            {UNITS.map((unit) => {
              const isSelected = unit === defaultUnit;
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

        {/* Decimal Precision Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Decimal Precision</Text>
          <Text style={styles.sectionSubtitle}>
            Number of decimal places in results
          </Text>
          
          <View style={styles.optionsRow}>
            {DECIMAL_OPTIONS.map((precision) => {
              const isSelected = precision === decimalPrecision;
              const precisionText = `${precision} decimals`;
              
              return (
                <TouchableOpacity
                  key={precision}
                  style={[
                    styles.optionButton,
                    styles.optionButtonWide,
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
                    {precisionText}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity style={styles.dangerButton} onPress={clearHistory}>
            <Text style={styles.dangerButtonText}>Clear History</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>PriceSnap v1.0</Text>
          <Text style={styles.infoSubtext}>Smart Unit Price Calculator</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
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
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
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
    paddingVertical: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.inputBackground,
    borderWidth: 2,
    borderColor: colors.border,
    minWidth: 60,
    alignItems: 'center',
  },
  optionButtonWide: {
    flex: 1,
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
  infoSection: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  infoSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
