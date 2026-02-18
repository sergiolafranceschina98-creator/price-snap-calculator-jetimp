
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

const UNITS: Unit[] = ['g', 'kg', 'ml', 'L', 'oz', 'lb', 'pcs'];

export default function CompareScreen() {
  const [priceA, setPriceA] = useState('');
  const [quantityA, setQuantityA] = useState('');
  const [unitA, setUnitA] = useState<Unit>('g');

  const [priceB, setPriceB] = useState('');
  const [quantityB, setQuantityB] = useState('');
  const [unitB, setUnitB] = useState<Unit>('g');

  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [decimalPrecision, setDecimalPrecision] = useState(4);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const precision = await AsyncStorage.getItem('decimalPrecision');
      if (precision) {
        setDecimalPrecision(parseInt(precision));
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const handleCompare = () => {
    console.log('User tapped COMPARE NOW button');

    const priceANum = parseFloat(priceA);
    const quantityANum = parseFloat(quantityA);
    const priceBNum = parseFloat(priceB);
    const quantityBNum = parseFloat(quantityB);

    if (
      !priceANum ||
      !quantityANum ||
      !priceBNum ||
      !quantityBNum ||
      priceANum <= 0 ||
      quantityANum <= 0 ||
      priceBNum <= 0 ||
      quantityBNum <= 0
    ) {
      console.log('Invalid input - one or more values are zero or negative');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const pricePerUnitA = priceANum / quantityANum;
    const pricePerUnitB = priceBNum / quantityBNum;

    const cheaperProduct = pricePerUnitA < pricePerUnitB ? 'A' : 'B';
    const percentageDiff =
      cheaperProduct === 'A'
        ? ((pricePerUnitB - pricePerUnitA) / pricePerUnitB) * 100
        : ((pricePerUnitA - pricePerUnitB) / pricePerUnitA) * 100;

    const comparisonResult: ComparisonResult = {
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

    setResult(comparisonResult);
    console.log('Comparison result:', comparisonResult);
  };

  const handleUnitSelect = (product: 'A' | 'B', unit: Unit) => {
    console.log(`User selected unit ${unit} for Product ${product}`);
    Haptics.selectionAsync();
    if (product === 'A') {
      setUnitA(unit);
    } else {
      setUnitB(unit);
    }
  };

  const formatPrice = (price: number) => {
    return price.toFixed(decimalPrecision);
  };

  const priceAFormatted = result ? formatPrice(result.productA.pricePerUnit) : '';
  const priceBFormatted = result ? formatPrice(result.productB.pricePerUnit) : '';
  const percentageText = result ? `${result.percentageDiff.toFixed(1)}%` : '';
  const cheaperText = result ? `Product ${result.cheaperProduct}` : '';

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
          <Text style={styles.header}>Compare Two Products</Text>

          <View style={styles.productCard}>
            <Text style={styles.productLabel}>Product A</Text>
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
                  const isSelected = unitA === unit;
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

          <View style={styles.productCard}>
            <Text style={styles.productLabel}>Product B</Text>
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
                  const isSelected = unitB === unit;
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

          <TouchableOpacity style={styles.compareButton} onPress={handleCompare}>
            <Text style={styles.compareButtonText}>COMPARE NOW</Text>
          </TouchableOpacity>

          {result && (
            <View style={styles.resultSection}>
              <View
                style={[
                  styles.resultCard,
                  result.productA.isCheaper
                    ? styles.resultCardCheaper
                    : styles.resultCardExpensive,
                ]}
              >
                <Text style={styles.resultProductLabel}>Product A</Text>
                <Text style={styles.resultPrice}>
                  ${priceAFormatted} per {unitA}
                </Text>
              </View>

              <View
                style={[
                  styles.resultCard,
                  result.productB.isCheaper
                    ? styles.resultCardCheaper
                    : styles.resultCardExpensive,
                ]}
              >
                <Text style={styles.resultProductLabel}>Product B</Text>
                <Text style={styles.resultPrice}>
                  ${priceBFormatted} per {unitB}
                </Text>
              </View>

              <View style={styles.savingsCard}>
                <Text style={styles.savingsIcon}>✅</Text>
                <Text style={styles.savingsText}>
                  {cheaperText} is {percentageText} cheaper
                </Text>
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
    paddingTop: 48,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    ...typography.heading,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  productCard: {
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
  productLabel: {
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
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  compareButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resultSection: {
    gap: spacing.md,
  },
  resultCard: {
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 3,
  },
  resultCardCheaper: {
    backgroundColor: '#ECFDF5',
    borderColor: colors.cheaper,
  },
  resultCardExpensive: {
    backgroundColor: '#FEF2F2',
    borderColor: colors.expensive,
  },
  resultProductLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  resultPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  savingsCard: {
    backgroundColor: colors.success,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
  },
  savingsIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  savingsText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
