import COLORS from '../assets/colors';

export const darkTheme = {
  // Background colors
  background: {
    primary: COLORS.black,
    secondary: COLORS.darkBg.primary,
    tertiary: COLORS.darkBg.secondary,
    card: COLORS.darkSurface.card,
    modal: COLORS.darkSurface.modal,
  },
  
  // Text colors
  text: {
    primary: COLORS.darkText.primary,
    secondary: COLORS.darkText.secondary,
    tertiary: COLORS.darkText.tertiary,
    disabled: COLORS.darkText.disabled,
    accent: COLORS.brandPrimary,
  },
  
  // Border colors
  border: {
    primary: 'rgba(255, 255, 255, 0.1)',
    secondary: 'rgba(255, 255, 255, 0.05)',
    focus: COLORS.brandPrimary,
  },
  
  // Icon colors
  icon: {
    primary: COLORS.darkText.primary,
    secondary: COLORS.darkText.secondary,
    inactive: COLORS.darkText.tertiary,
    active: COLORS.brandPrimary,
  },
  
  // Button styles
  button: {
    primary: {
      background: COLORS.brandPrimary,
      text: COLORS.white,
    },
    secondary: {
      background: COLORS.darkSurface.card,
      text: COLORS.darkText.primary,
    },
    danger: {
      background: COLORS.status.error,
      text: COLORS.white,
    },
    disabled: {
      background: COLORS.darkBg.tertiary,
      text: COLORS.darkText.disabled,
    },
  },
  
  // Common gradients
  gradients: {
    background: ['#1A1A1A', '#121212', '#050505'],
    primary: [COLORS.brandPrimary, '#27B6C0'],
    danger: ['#E74C3C', '#C0392B'],
    card: [COLORS.darkSurface.card, COLORS.darkBg.primary],
  },
  
  // Shadow defaults
  shadow: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 10,
    },
    glow: {
      shadowColor: COLORS.brandPrimary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 6,
    },
  },
  
  // Spacing constants
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Border radius constants
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 9999,
  },
};

export default darkTheme; 