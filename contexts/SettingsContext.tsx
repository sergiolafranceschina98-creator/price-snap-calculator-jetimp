
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Unit = 'g' | 'kg' | 'ml' | 'L' | 'oz' | 'lb' | 'pcs';
type DecimalPrecision = 2 | 3 | 4;

interface SettingsContextType {
  defaultUnit: Unit;
  decimalPrecision: DecimalPrecision;
  updateDefaultUnit: (unit: Unit) => Promise<void>;
  updateDecimalPrecision: (precision: DecimalPrecision) => Promise<void>;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [defaultUnit, setDefaultUnit] = useState<Unit>('g');
  const [decimalPrecision, setDecimalPrecision] = useState<DecimalPrecision>(3);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    console.log('SettingsContext: Loading settings from AsyncStorage');
    try {
      const unit = await AsyncStorage.getItem('defaultUnit');
      const precision = await AsyncStorage.getItem('decimalPrecision');

      if (unit) {
        setDefaultUnit(unit as Unit);
        console.log('SettingsContext: Loaded default unit:', unit);
      }
      if (precision) {
        setDecimalPrecision(parseInt(precision) as DecimalPrecision);
        console.log('SettingsContext: Loaded decimal precision:', precision);
      }
    } catch (error) {
      console.log('SettingsContext: Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateDefaultUnit = async (unit: Unit) => {
    console.log('SettingsContext: Updating default unit to:', unit);
    try {
      await AsyncStorage.setItem('defaultUnit', unit);
      setDefaultUnit(unit);
      console.log('SettingsContext: Default unit updated successfully');
    } catch (error) {
      console.log('SettingsContext: Error updating default unit:', error);
    }
  };

  const updateDecimalPrecision = async (precision: DecimalPrecision) => {
    console.log('SettingsContext: Updating decimal precision to:', precision);
    try {
      await AsyncStorage.setItem('decimalPrecision', precision.toString());
      setDecimalPrecision(precision);
      console.log('SettingsContext: Decimal precision updated successfully');
    } catch (error) {
      console.log('SettingsContext: Error updating decimal precision:', error);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        defaultUnit,
        decimalPrecision,
        updateDefaultUnit,
        updateDecimalPrecision,
        isLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
