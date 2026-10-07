import React, { createContext, useContext, ReactNode } from 'react';
import { StatusBar } from 'react-native';
import darkTheme from './darkTheme';
import COLORS from '../assets/colors';

// Create the theme context
const ThemeContext = createContext(darkTheme);

// Custom hook to use the theme
export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // We're setting dark theme as the default theme for the app
  const theme = darkTheme;

  return (
    <ThemeContext.Provider value={theme}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.black}
        translucent={false}
      />
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 