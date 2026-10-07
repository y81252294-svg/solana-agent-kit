// File: src/config/index.ts

import {
  PRIVY_APP_ID,
  PRIVY_CLIENT_ID,
} from '@env';

// Fallback values in case environment variables are undefined
const DEFAULT_PRIVY_APP_ID = 'local-dev-app-id';
const DEFAULT_PRIVY_CLIENT_ID = 'local-dev-client-id';

/** Extended config for Privy */
export interface PrivyConfig {
  appId: string;
  clientId: string;
}

export interface AuthProviderConfig {
  provider: 'privy';
  loginMethods: Array<'email' | 'sms' | 'google' | 'apple'>;
  privy: PrivyConfig;
}

/** Provide default auth config, reading from env or fallback. */
export const DefaultAuthConfig: AuthProviderConfig = {
  provider: 'privy',
  loginMethods: ['email', 'google', 'apple'],

  privy: {
    // Read from environment variables or fallback with default values
    appId: PRIVY_APP_ID || DEFAULT_PRIVY_APP_ID,
    clientId: PRIVY_CLIENT_ID || DEFAULT_PRIVY_CLIENT_ID,
  },
};

/** Overall customization config shape. */
export interface CustomizationConfig {
  auth: AuthProviderConfig;
}

/** The combined default config. */
export const DefaultCustomizationConfig: CustomizationConfig = {
  auth: DefaultAuthConfig,
};
