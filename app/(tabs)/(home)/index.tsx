
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
  const [decimalPrecision, setDecimalPrecision] = useState(3);

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
    
    if (!price || !quantity) {
      console.log('Missing price or quantity');
      return;
    }

    const priceNum = parseFloat(price);
    const quantityNum = parseFloat(quantity);

    if (isNaN(priceNum) || isNaN(quantityNum) || quantityNum === 0) {
      console.log('Invalid input values');
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

    try {
      const historyJson = await AsyncStorage.getItem('calculationHistory');
      const history = historyJson ? JSON.parse(historyJson) : [];
      
      const newHistory = [
        {
          id: Date.now().toString(),
          price: priceNum,
          quantity: quantityNum,
          unit: selectedUnit,
          pricePerUnit,
          timestamp: Date.now(),
        },
        ...history,
      ].slice(0, 20);

      await AsyncStorage.setItem('calculationHistory', JSON.stringify(newHistory));
      console.log('Calculation saved to history');
    } catch (error) {
      console.log('Error saving to history:', error);
    }
  };

  const handleUnitSelect = (unit: Unit) => {
    console.log('User selected unit:', unit);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedUnit(unit);
  };

  const formatResult = () => {
    if (!result) return '';
    
    const formattedPrice = result.pricePerUnit.toFixed(decimalPrecision);
    return formattedPrice;
  };

  const resultPrice = formatResult();
  const resultUnit = result ? result.unit : '';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'PriceSnap',
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
          <Text style={styles.subtitle}>Know the real price instantly</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>PRICE</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="e.g. 4.99"
              placeholderTextColor={colors.textSecondary}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>QUANTITY</Text>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
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
                      selectedUnit === unit && styles.unitButtonActive,
                    ]}
                    onPress={() => handleUnitSelect(unit)}
                  >
                    <Text
                      style={[
                        styles.unitButtonText,
                        selectedUnit === unit && styles.unitButtonTextActive,
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

        <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
          <Text style={styles.calculateButtonText}>CALCULATE</Text>
        </TouchableOpacity>

        {result && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultLabel}>COST PER UNIT</Text>
            </View>
            <View style={styles.resultContent}>
              <Text style={styles.resultPrice}>${resultPrice}</Text>
              <Text style={styles.resultUnit}>per {resultUnit}</Text>
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
  inputGroup: {
    marginBottom: spacing.lg,
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
  calculateButton: {
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
  calculateButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  resultCard: {
    backgroundColor: colors.highlight,
    borderRadius: 24,
    padding: spacing.xl,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  resultHeader: {
    marginBottom: spacing.md,
  },
  resultLabel: {
    ...typography.label,
    color: colors.primary,
  },
  resultContent: {
    alignItems: 'center',
  },
  resultPrice: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -1.5,
    marginBottom: spacing.xs,
  },
  resultUnit: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
