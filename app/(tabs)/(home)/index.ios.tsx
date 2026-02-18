
import React, { useState } from 'react';
import { Stack } from 'expo-router';
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
import { colors, typography, spacing } from '@/styles/commonStyles';
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

  const handleCalculate = () => {
    console.log('User tapped CALCULATE button');
    const priceNum = parseFloat(price);
    const quantityNum = parseFloat(quantity);

    if (isNaN(priceNum) || isNaN(quantityNum) || quantityNum === 0) {
      console.log('Invalid input - price or quantity is not a valid number');
      return;
    }

    const pricePerUnit = priceNum / quantityNum;
    const calculation: Calculation = {
      price: priceNum,
      quantity: quantityNum,
      unit: selectedUnit,
      pricePerUnit,
      timestamp: Date.now(),
    };

    console.log('Calculation result:', calculation);
    setResult(calculation);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleUnitSelect = (unit: Unit) => {
    console.log('User selected unit:', unit);
    setSelectedUnit(unit);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const formatResult = () => {
    if (!result) return '';
    
    const formattedPrice = result.pricePerUnit.toFixed(4);
    return formattedPrice;
  };

  const resultText = formatResult();
  const unitText = selectedUnit;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'PriceSnap',
          headerLargeTitle: true,
        }}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Subtitle */}
          <Text style={styles.subtitle}>Know the real price instantly</Text>

          {/* Input Card */}
          <View style={styles.card}>
            {/* Price Input */}
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

            {/* Quantity Input */}
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

            {/* Unit Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Unit</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.unitSelector}
              >
                {UNITS.map((unit) => {
                  const isSelected = unit === selectedUnit;
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

          {/* Calculate Button */}
          <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
            <Text style={styles.calculateButtonText}>CALCULATE</Text>
          </TouchableOpacity>

          {/* Result Card */}
          {result && (
            <View style={styles.resultCard}>
              <Text style={styles.resultPrice}>{resultText}</Text>
              <Text style={styles.resultUnit}>per {unitText}</Text>
              <Text style={styles.resultLabel}>Cost per unit</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
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
  },
  subtitle: {
    ...typography.subtitle,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
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
    fontSize: 20,
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
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: spacing.lg,
  },
  calculateButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  resultCard: {
    backgroundColor: colors.highlight,
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  resultPrice: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  resultUnit: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
