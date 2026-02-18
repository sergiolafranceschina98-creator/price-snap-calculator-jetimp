
import { StyleSheet } from 'react-native';

// PriceSnap Color Theme - Clean, Premium, Money-focused
export const colors = {
  // Light theme (default)
  background: '#FFFFFF',
  card: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  primary: '#10B981', // Green for money/savings
  secondary: '#3B82F6', // Blue for actions
  accent: '#8B5CF6', // Purple for highlights
  highlight: '#FEF3C7', // Light yellow for results
  border: '#E5E7EB',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  
  // Specific UI elements
  inputBackground: '#F9FAFB',
  shadow: 'rgba(0, 0, 0, 0.08)',
  cheaper: '#10B981',
  expensive: '#EF4444',
};

export const typography = {
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.text,
  },
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
  result: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
});
