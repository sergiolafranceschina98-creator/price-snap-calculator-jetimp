
import React, { useState, useEffect } from 'react';
import { colors, typography, spacing } from '@/styles/commonStyles';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

type Unit = 'g' | 'kg' | 'ml' | 'L' | 'oz' | 'lb' | 'pcs';

interface Calculation {
  price: number;
  quantity: number;
  unit: Unit;
  pricePerUnit: number;
  timestamp: number;
}

const UNITS: Unit[] = ['g', 'kg', 'ml', 'L', 'oz', 'lb', 'pcs'];

export default function CalculateScreen() {
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<Unit>('g');
  const [result, setResult] = useState<Calculation | null>(null);
  const [decimalPrecision, setDecimalPrecision] = useState(4);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const defaultUnit = await AsyncStorage.getItem('defaultUnit');
      const precision = await AsyncStorage.getItem('decimalPrecision');
      
      if (defaultUnit) {
        setSelectedUnit(defaultUnit as Unit);
      }
      if (precision) {
        setDecimalPrecision(parseInt(precision));
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const handleCalculate = async () => {
    console.log('User tapped CALCULATE button');
    
    const priceNum = parseFloat(price);
    const quantityNum = parseFloat(quantity);

    if (!priceNum || !quantityNum || priceNum <= 0 || quantityNum <= 0) {
      console.log('Invalid input - price or quantity is zero or negative');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const pricePerUnit = priceNum / quantityNum;
    
    const calculation: Calculation = {
      price: priceNum,
      quantity: quantityNum,
      unit: selectedUnit,
      pricePerUnit,
      timestamp: Date.now(),
    };

    setResult(calculation);
    console.log('Calculation result:', calculation);

    // Save to history
    try {
      const historyJson = await AsyncStorage.getItem('history');
      const history = historyJson ? JSON.parse(historyJson) : [];
      
      const newHistory = [
        {
          id: Date.now().toString(),
          ...calculation,
        },
        ...history,
      ].slice(0, 20); // Keep only last 20

      await AsyncStorage.setItem('history', JSON.stringify(newHistory));
      console.log('Saved to history');
    } catch (error) {
      console.log('Error saving to history:', error);
    }
  };

  const handleUnitSelect = (unit: Unit) => {
    console.log('User selected unit:', unit);
    Haptics.selectionAsync();
    setSelectedUnit(unit);
  };

  const formatResult = () => {
    if (!result) return '';
    
    const formattedPrice = result.pricePerUnit.toFixed(decimalPrecision);
    return `$${formattedPrice} per ${result.unit}`;
  };

  const resultText = formatResult();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>PriceSnap</Text>
            <Text style={styles.subtitle}>Know the real price instantly</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 4.99"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
                value={price}
                onChangeText={setPrice}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 500"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
                value={quantity}
                onChangeText={setQuantity}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Unit</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.unitSelector}
              >
                {UNITS.map((unit) => {
                  const isSelected = selectedUnit === unit;
                  return (
                    <TouchableOpacity
                      key={unit}
                      style={[
                        styles.unitButton,
                        isSelected && styles.unitButtonSelected,
                      ]}
                      onPress={() => handleUnitSelect(unit)}
                    >
                      <Text
                        style={[
                          styles.unitButtonText,
                          isSelected && styles.unitButtonTextSelected,
                        ]}
                      >
                        {unit}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>

          <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
            <Text style={styles.calculateButtonText}>CALCULATE</Text>
          </TouchableOpacity>

          {result && (
            <View style={styles.resultCard}>
              <Text style={styles.resultValue}>{resultText}</Text>
              <Text style={styles.resultLabel}>Cost per unit</Text>
            </View>
          )}

          <View style={styles.shortcutRow}>
            <TouchableOpacity
              style={styles.shortcutChip}
              onPress={() => handleUnitSelect('g')}
            >
              <Text style={styles.shortcutText}>Grocery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shortcutChip}
              onPress={() => handleUnitSelect('kg')}
            >
              <Text style={styles.shortcutText}>Protein</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shortcutChip}
              onPress={() => handleUnitSelect('L')}
            >
              <Text style={styles.shortcutText}>Fuel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shortcutChip}
              onPress={() => handleUnitSelect('pcs')}
            >
              <Text style={styles.shortcutText}>Bulk Pack</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.title,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.subtitle,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unitSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  unitButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unitButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  unitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  unitButtonTextSelected: {
    color: '#FFFFFF',
  },
  calculateButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  calculateButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resultCard: {
    backgroundColor: colors.highlight,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  resultValue: {
    ...typography.result,
    marginBottom: spacing.xs,
  },
  resultLabel: {
    ...typography.label,
  },
  shortcutRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  shortcutChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shortcutText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
