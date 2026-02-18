
import { StyleSheet } from 'react-native';

// PriceSnap Premium Color Theme - Sophisticated & Elegant with Deep Navy
export const colors = {
  // Premium color palette - Deep navy cards, warm accents, keeping green
  background: '#0F172A', // Deep navy background (darker)
  card: '#1E293B', // Deep navy for cards
  text: '#F8FAFC', // Light text for contrast on dark background
  textSecondary: '#94A3B8', // Lighter gray-blue for secondary text
  primary: '#10B981', // Keep the green as requested
  secondary: '#334155', // Lighter navy for secondary elements
  accent: '#D97706', // Rich amber for warmth
  highlight: '#064E3B', // Dark green tint for results
  border: '#334155',
  success: '#10B981',
  error: '#DC2626',
  warning: '#F59E0B',
  
  // Specific UI elements - Premium feel
  inputBackground: '#334155',
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowDark: 'rgba(0, 0, 0, 0.5)',
  cheaper: '#10B981',
  expensive: '#DC2626',
  
  // Additional premium colors
  cardBorder: '#475569',
  divider: '#334155',
  overlay: 'rgba(15, 23, 42, 0.9)',
  
  // Gradient colors for premium feel
  gradientStart: '#10B981',
  gradientEnd: '#059669',
  
  // Subtle tints for depth
  backgroundTint: '#1E293B',
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
