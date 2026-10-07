import React, { createContext, useContext, ReactNode } from 'react';
import { DefaultCustomizationConfig, CustomizationConfig } from './config';

// Create a context with the default config
const CustomizationContext = createContext<CustomizationConfig>(DefaultCustomizationConfig);

// Provider component that will wrap the app
export const CustomizationProvider: React.FC<{
  config?: Partial<CustomizationConfig>;
  children: ReactNode;
}> = ({ config, children }) => {
  // Merge custom config with defaults
  console.log('config', config);
  const mergedConfig = {
    ...DefaultCustomizationConfig,
    ...config,
    // Merge nested objects
    auth: {
      ...DefaultCustomizationConfig.auth,
      ...(config?.auth || {}),
    },
  };

  return (
    <CustomizationContext.Provider value={mergedConfig}>
      {children}
    </CustomizationContext.Provider>
  );
};

// Hook to use the configuration
export function useCustomization() {
  return useContext(CustomizationContext);
} 