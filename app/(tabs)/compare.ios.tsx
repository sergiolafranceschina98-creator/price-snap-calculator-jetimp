
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

const UNITS: Unit[] = ['g', 'kg', 'ml', 'L', 'oz', 'lb', 'pcs'];

interface ComparisonResult {
  productA: {
    pricePerUnit: number;
    isCheaper: boolean;
  };
  productB: {
    pricePerUnit: number;
    isCheaper: boolean;
  };
  percentageDiff: number;
  cheaperProduct: 'A' | 'B';
}

export default function CompareScreen() {
  const [priceA, setPriceA] = useState('');
  const [quantityA, setQuantityA] = useState('');
  const [unitA, setUnitA] = useState<Unit>('g');

  const [priceB, setPriceB] = useState('');
  const [quantityB, setQuantityB] = useState('');
  const [unitB, setUnitB] = useState<Unit>('g');

  const [result, setResult] = useState<ComparisonResult | null>(null);

  const handleCompare = () => {
    console.log('User tapped COMPARE NOW button');
    const priceANum = parseFloat(priceA);
    const quantityANum = parseFloat(quantityA);
    const priceBNum = parseFloat(priceB);
    const quantityBNum = parseFloat(quantityB);

    if (
      isNaN(priceANum) ||
      isNaN(quantityANum) ||
      isNaN(priceBNum) ||
      isNaN(quantityBNum) ||
      quantityANum === 0 ||
      quantityBNum === 0
    ) {
      console.log('Invalid input - one or more values are not valid numbers');
      return;
    }

    const pricePerUnitA = priceANum / quantityANum;
    const pricePerUnitB = priceBNum / quantityBNum;

    const cheaperProduct = pricePerUnitA < pricePerUnitB ? 'A' : 'B';
    const percentageDiff =
      cheaperProduct === 'A'
        ? ((pricePerUnitB - pricePerUnitA) / pricePerUnitB) * 100
        : ((pricePerUnitA - pricePerUnitB) / pricePerUnitA) * 100;

    const comparison: ComparisonResult = {
      productA: {
        pricePerUnit: pricePerUnitA,
        isCheaper: cheaperProduct === 'A',
      },
      productB: {
        pricePerUnit: pricePerUnitB,
        isCheaper: cheaperProduct === 'B',
      },
      percentageDiff,
      cheaperProduct,
    };

    console.log('Comparison result:', comparison);
    setResult(comparison);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleUnitSelect = (product: 'A' | 'B', unit: Unit) => {
    console.log(`User selected unit ${unit} for Product ${product}`);
    if (product === 'A') {
      setUnitA(unit);
    } else {
      setUnitB(unit);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const pricePerUnitAText = result ? result.productA.pricePerUnit.toFixed(4) : '';
  const pricePerUnitBText = result ? result.productB.pricePerUnit.toFixed(4) : '';
  const percentageDiffText = result ? result.percentageDiff.toFixed(1) : '';
  const cheaperProductText = result ? result.cheaperProduct : '';

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Compare',
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
          {/* Product A Card */}
          <View style={styles.productCard}>
            <Text style={styles.productTitle}>Product A</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 4.99"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
                value={priceA}
                onChangeText={setPriceA}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 500"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
                value={quantityA}
                onChangeText={setQuantityA}
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
                  const isSelected = unit === unitA;
                  return (
                    <TouchableOpacity
                      key={unit}
                      style={[
                        styles.unitButton,
                        isSelected && styles.unitButtonSelected,
                      ]}
                      onPress={() => handleUnitSelect('A', unit)}
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

          {/* Product B Card */}
          <View style={styles.productCard}>
            <Text style={styles.productTitle}>Product B</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 3.99"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
                value={priceB}
                onChangeText={setPriceB}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 400"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
                value={quantityB}
                onChangeText={setQuantityB}
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
                  const isSelected = unit === unitB;
                  return (
                    <TouchableOpacity
                      key={unit}
                      style={[
                        styles.unitButton,
                        isSelected && styles.unitButtonSelected,
                      ]}
                      onPress={() => handleUnitSelect('B', unit)}
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

          {/* Compare Button */}
          <TouchableOpacity style={styles.compareButton} onPress={handleCompare}>
            <Text style={styles.compareButtonText}>COMPARE NOW</Text>
          </TouchableOpacity>

          {/* Result Section */}
          {result && (
            <View style={styles.resultSection}>
              {/* Product A Result */}
              <View
                style={[
                  styles.resultCard,
                  result.productA.isCheaper
                    ? styles.resultCardCheaper
                    : styles.resultCardExpensive,
                ]}
              >
                <Text style={styles.resultProductLabel}>Product A</Text>
                <Text style={styles.resultPrice}>{pricePerUnitAText}</Text>
                <Text style={styles.resultUnit}>per {unitA}</Text>
              </View>

              {/* Product B Result */}
              <View
                style={[
                  styles.resultCard,
                  result.productB.isCheaper
                    ? styles.resultCardCheaper
                    : styles.resultCardExpensive,
                ]}
              >
                <Text style={styles.resultProductLabel}>Product B</Text>
                <Text style={styles.resultPrice}>{pricePerUnitBText}</Text>
                <Text style={styles.resultUnit}>per {unitB}</Text>
              </View>

              {/* Winner Card */}
              <View style={styles.winnerCard}>
                <Text style={styles.winnerIcon}>✅</Text>
                <Text style={styles.winnerText}>Product {cheaperProductText} is</Text>
                <Text style={styles.winnerPercentage}>{percentageDiffText}% cheaper</Text>
              </View>
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
  productCard: {
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
  productTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.md,
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
  compareButton: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: spacing.lg,
  },
  compareButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  resultSection: {
    gap: spacing.md,
  },
  resultCard: {
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
  },
  resultCardCheaper: {
    backgroundColor: '#D1FAE5',
    borderWidth: 2,
    borderColor: colors.cheaper,
  },
  resultCardExpensive: {
    backgroundColor: '#FEE2E2',
    borderWidth: 2,
    borderColor: colors.expensive,
  },
  resultProductLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  resultPrice: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
  },
  resultUnit: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  winnerCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
  },
  winnerIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  winnerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  winnerPercentage: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
