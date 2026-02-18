
import { StyleSheet } from 'react-native';

// PriceSnap Premium Color Theme - Sophisticated & Elegant
export const colors = {
  // Premium color palette - Deep navy, warm accents, keeping green
  background: '#F5F7FA', // Soft blue-gray background
  card: '#FFFFFF',
  text: '#1A202C', // Rich charcoal
  textSecondary: '#64748B', // Sophisticated gray-blue
  primary: '#10B981', // Keep the green as requested
  secondary: '#1E293B', // Deep navy for sophistication
  accent: '#D97706', // Rich amber for warmth
  highlight: '#ECFDF5', // Subtle green tint for results
  border: '#E2E8F0',
  success: '#10B981',
  error: '#DC2626',
  warning: '#F59E0B',
  
  // Specific UI elements - Premium feel
  inputBackground: '#F8FAFC',
  shadow: 'rgba(30, 41, 59, 0.08)',
  shadowDark: 'rgba(30, 41, 59, 0.15)',
  cheaper: '#10B981',
  expensive: '#DC2626',
  
  // Additional premium colors
  cardBorder: '#F1F5F9',
  divider: '#E2E8F0',
  overlay: 'rgba(15, 23, 42, 0.6)',
  
  // Gradient colors for premium feel
  gradientStart: '#10B981',
  gradientEnd: '#059669',
  
  // Subtle tints for depth
  backgroundTint: '#EFF6FF',
  accentLight: '#FEF3C7',
};

export const typography = {
  title: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    letterSpacing: 0,
    lineHeight: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: '600' as const,
    color: colors.text,
    letterSpacing: -0.5,
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    color: colors.text,
    lineHeight: 26,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    letterSpacing: 0.3,
    textTransform: 'uppercase' as const,
  },
  result: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -1,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  button: {
    fontSize: 17,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
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
    borderRadius: 24,
    padding: spacing.lg,
    shadowColor: colors.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: 16,
    padding: spacing.md + 4,
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.text,
    borderWidth: 2,
    borderColor: colors.border,
  },
  button: {
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
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
});
