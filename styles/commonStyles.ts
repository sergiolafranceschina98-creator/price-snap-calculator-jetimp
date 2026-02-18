
import { StyleSheet } from 'react-native';

// PriceSnap Premium Color Theme - Sophisticated & Elegant
export const colors = {
  // Light theme - Premium aesthetic with deep navy and warm accents
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  primary: '#10B981', // Keep the green as requested
  secondary: '#1E293B', // Deep navy for sophistication
  accent: '#F59E0B', // Warm amber for highlights
  highlight: '#ECFDF5', // Subtle green tint for results
  border: '#E5E7EB',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  
  // Specific UI elements - Premium feel
  inputBackground: '#F9FAFB',
  shadow: 'rgba(0, 0, 0, 0.06)',
  shadowDark: 'rgba(0, 0, 0, 0.12)',
  cheaper: '#10B981',
  expensive: '#EF4444',
  
  // Additional premium colors
  cardBorder: '#F3F4F6',
  divider: '#E5E7EB',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Gradient colors for premium feel
  gradientStart: '#10B981',
  gradientEnd: '#059669',
};

export const typography = {
  title: {
    fontSize: 34,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    letterSpacing: -0.2,
  },
  heading: {
    fontSize: 26,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    color: colors.text,
    lineHeight: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    letterSpacing: -0.1,
  },
  result: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.5,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
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
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: 14,
    padding: spacing.md + 2,
    fontSize: 19,
    fontWeight: '600' as const,
    color: colors.text,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
});
