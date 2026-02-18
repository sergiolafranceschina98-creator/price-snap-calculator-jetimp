
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
  const [decimalPrecision, setDecimalPrecision] = useState(3);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const defaultUnit = await AsyncStorage.getItem('defaultUnit');
      const precision = await AsyncStorage.getItem('decimalPrecision');
      
      if (defaultUnit) {
        setUnitA(defaultUnit as Unit);
        setUnitB(defaultUnit as Unit);
      }
      if (precision) {
        setDecimalPrecision(parseInt(precision));
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const handleCompare = async () => {
    console.log('User tapped COMPARE NOW button');
    
    if (!priceA || !quantityA || !priceB || !quantityB) {
      console.log('Missing input values');
      return;
    }

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
      console.log('Invalid input values');
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

    const comparisonResult = {
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

    try {
      const historyJson = await AsyncStorage.getItem('calculationHistory');
      const history = historyJson ? JSON.parse(historyJson) : [];
      
      const newHistoryItem = {
        id: Date.now().toString(),
        type: 'compare',
        productA: {
          price: priceANum,
          quantity: quantityANum,
          unit: unitA,
          pricePerUnit: pricePerUnitA,
        },
        productB: {
          price: priceBNum,
          quantity: quantityBNum,
          unit: unitB,
          pricePerUnit: pricePerUnitB,
        },
        cheaperProduct,
        percentageDiff,
        timestamp: Date.now(),
      };

      const newHistory = [newHistoryItem, ...history].slice(0, 20);

      await AsyncStorage.setItem('calculationHistory', JSON.stringify(newHistory));
      console.log('Comparison saved to history:', newHistoryItem);
    } catch (error) {
      console.log('Error saving comparison to history:', error);
    }
  };

  const handleUnitSelect = (product: 'A' | 'B', unit: Unit) => {
    console.log('User selected unit for product', product, ':', unit);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (product === 'A') {
      setUnitA(unit);
    } else {
      setUnitB(unit);
    }
  };

  const formatPrice = (price: number) => {
    return price.toFixed(decimalPrecision);
  };

  const productAPrice = result ? formatPrice(result.productA.pricePerUnit) : '';
  const productBPrice = result ? formatPrice(result.productB.pricePerUnit) : '';
  const percentageDiffText = result ? result.percentageDiff.toFixed(0) : '';
  const cheaperProductText = result ? (result.cheaperProduct === 'A' ? 'Product A' : 'Product B') : '';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Compare',
          headerLargeTitle: true,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.subtitle}>Find the better deal</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.productHeader}>
            <Text style={styles.productLabel}>PRODUCT A</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>PRICE</Text>
            <TextInput
              style={styles.input}
              value={priceA}
              onChangeText={setPriceA}
              placeholder="e.g. 4.99"
              placeholderTextColor={colors.textSecondary}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>QUANTITY</Text>
            <TextInput
              style={styles.input}
              value={quantityA}
              onChangeText={setQuantityA}
              placeholder="e.g. 500"
              placeholderTextColor={colors.textSecondary}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>UNIT</Text>
            <View style={styles.unitSelector}>
              {UNITS.map((unit, index) => (
                <React.Fragment key={unit}>
                  <TouchableOpacity
                    style={[
                      styles.unitButton,
                      unitA === unit && styles.unitButtonActive,
                    ]}
                    onPress={() => handleUnitSelect('A', unit)}
                  >
                    <Text
                      style={[
                        styles.unitButtonText,
                        unitA === unit && styles.unitButtonTextActive,
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

        <View style={styles.card}>
          <View style={styles.productHeader}>
            <Text style={styles.productLabel}>PRODUCT B</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>PRICE</Text>
            <TextInput
              style={styles.input}
              value={priceB}
              onChangeText={setPriceB}
              placeholder="e.g. 3.99"
              placeholderTextColor={colors.textSecondary}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>QUANTITY</Text>
            <TextInput
              style={styles.input}
              value={quantityB}
              onChangeText={setQuantityB}
              placeholder="e.g. 400"
              placeholderTextColor={colors.textSecondary}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>UNIT</Text>
            <View style={styles.unitSelector}>
              {UNITS.map((unit, index) => (
                <React.Fragment key={unit}>
                  <TouchableOpacity
                    style={[
                      styles.unitButton,
                      unitB === unit && styles.unitButtonActive,
                    ]}
                    onPress={() => handleUnitSelect('B', unit)}
                  >
                    <Text
                      style={[
                        styles.unitButtonText,
                        unitB === unit && styles.unitButtonTextActive,
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

        <TouchableOpacity style={styles.compareButton} onPress={handleCompare}>
          <Text style={styles.compareButtonText}>COMPARE NOW</Text>
        </TouchableOpacity>

        {result && (
          <View style={styles.resultSection}>
            <View
              style={[
                styles.resultCard,
                result.productA.isCheaper && styles.resultCardCheaper,
              ]}
            >
              <Text style={styles.resultProductLabel}>Product A</Text>
              <Text style={styles.resultPrice}>${productAPrice}</Text>
              <Text style={styles.resultUnit}>per {unitA}</Text>
              {result.productA.isCheaper && (
                <View style={styles.cheaperBadge}>
                  <Text style={styles.cheaperBadgeText}>✓ CHEAPER</Text>
                </View>
              )}
            </View>

            <View
              style={[
                styles.resultCard,
                result.productB.isCheaper && styles.resultCardCheaper,
              ]}
            >
              <Text style={styles.resultProductLabel}>Product B</Text>
              <Text style={styles.resultPrice}>${productBPrice}</Text>
              <Text style={styles.resultUnit}>per {unitB}</Text>
              {result.productB.isCheaper && (
                <View style={styles.cheaperBadge}>
                  <Text style={styles.cheaperBadgeText}>✓ CHEAPER</Text>
                </View>
              )}
            </View>

            <View style={styles.savingsCard}>
              <Text style={styles.savingsLabel}>SAVINGS</Text>
              <Text style={styles.savingsText}>{cheaperProductText} is</Text>
              <Text style={styles.savingsPercentage}>{percentageDiffText}%</Text>
              <Text style={styles.savingsText}>cheaper</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
  header: {
    marginBottom: spacing.lg,
  },
  subtitle: {
    ...typography.subtitle,
    fontSize: 17,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: spacing.lg,
    shadowColor: colors.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: spacing.lg,
  },
  productHeader: {
    marginBottom: spacing.md,
  },
  productLabel: {
    ...typography.label,
    fontSize: 15,
    color: colors.primary,
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
    borderRadius: 16,
    padding: spacing.md + 4,
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    borderWidth: 2,
    borderColor: colors.border,
  },
  unitSelector: {
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
  compareButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: spacing.md + 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: spacing.lg,
  },
  compareButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  resultSection: {
    gap: spacing.md,
  },
  resultCard: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  resultCardCheaper: {
    backgroundColor: colors.highlight,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
  },
  resultProductLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  resultPrice: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -1,
    marginBottom: spacing.xs,
  },
  resultUnit: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  cheaperBadge: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
  },
  cheaperBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  savingsCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  savingsLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  savingsText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  savingsPercentage: {
    fontSize: 56,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -2,
    marginVertical: spacing.xs,
  },
});
