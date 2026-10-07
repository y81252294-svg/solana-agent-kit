import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {loginSuccess, logoutSuccess} from '../../state/auth/reducer';
import {usePrivyWalletLogic} from '../services/walletProviders/privy';
import {useAppNavigation} from '../../hooks/useAppNavigation';
import {useAppSelector} from '../../hooks/useReduxHooks';
import {useLoginWithOAuth} from '@privy-io/expo';
import { StandardWallet } from '../types';
import { SERVER_URL } from '@env';
import { Alert } from 'react-native';
import { createOrUpdateUser } from '@/lib/utils';

// Default server URL if not provided in env
const SERVER_BASE_URL = SERVER_URL || 'http://localhost:3001';

/**
 * Hook for managing authentication and wallet connection
 * Simplified to only use Privy wallet provider
 */
export function useAuth() {
  const dispatch = useDispatch();
  const navigation = useAppNavigation();
  const authState = useAppSelector(state => state.auth);

  const {
    handlePrivyLogin,
    handlePrivyLogout,
    monitorSolanaWallet,
    user,
    solanaWallet,
  } = usePrivyWalletLogic();
  
  // Get the direct Privy OAuth login hook
  const {login: loginWithOAuth} = useLoginWithOAuth();

  // Create a standardized wallet object for Privy
  const standardWallet: StandardWallet | null = solanaWallet?.wallets?.[0] ? {
    provider: 'privy',
    address: solanaWallet.wallets[0].publicKey,
    publicKey: solanaWallet.wallets[0].publicKey,
    rawWallet: solanaWallet.wallets[0],
    getWalletInfo: () => ({
      walletType: 'Privy',
      address: solanaWallet.wallets?.[0]?.publicKey || null,
    }),
    getProvider: async () => {
      if (solanaWallet?.getProvider) {
        return solanaWallet.getProvider();
      }
      throw new Error('Privy wallet provider not available');
    },
  } : null;

  // Create user in backend after successful Privy login
  const createUserInBackend = useCallback(async (walletAddress: string) => {
    try {
      console.log(`Creating user in backend with wallet address: ${walletAddress}`);
      
      // Create user in our custom server
      const user = await createOrUpdateUser({
        walletAddress: walletAddress
      });
      
      return !!user;
    } catch (error) {
      console.error('Error creating user in backend:', error);
      Alert.alert(
        'Connection Error',
        'Failed to connect to server. Please check your internet connection.'
      );
      return false;
    }
  }, []);

  const handleSuccessfulWalletConnection = useCallback(async (info: {address: string}) => {
    try {
      // First create the user in the backend
      console.log('Wallet connected, creating user with address:', info.address);
      const userCreated = await createUserInBackend(info.address);
      
      if (!userCreated) {
        console.warn('User creation in backend failed, but continuing with local login');
      } else {
        console.log('User successfully created in backend');
      }
      
      // Update Redux state
      dispatch(loginSuccess({address: info.address}));
      
      // Navigate to main app
      navigation.navigate('MainTabs');
    } catch (error) {
      console.error('Error in wallet connection handling:', error);
      Alert.alert('Login Error', 'Connected to wallet but failed to complete login process.');
    }
  }, [createUserInBackend, dispatch, navigation]);

  const loginWithGoogle = useCallback(async () => {
    try {
      // Use direct OAuth login instead of handlePrivyLogin
      await loginWithOAuth({ provider: 'google' });
      
      // Continue monitoring the wallet after login
      await monitorSolanaWallet({
        selectedProvider: 'privy',
        setStatusMessage: () => {},
        onWalletConnected: handleSuccessfulWalletConnection
      });
    } catch (error) {
      console.error('Google login error:', error);
    }
  }, [loginWithOAuth, monitorSolanaWallet, handleSuccessfulWalletConnection]);

  const loginWithApple = useCallback(async () => {
    try {
      // Use direct OAuth login instead of handlePrivyLogin
      await loginWithOAuth({ provider: 'apple' });
      
      // Continue monitoring the wallet after login
      await monitorSolanaWallet({
        selectedProvider: 'privy',
        setStatusMessage: () => {},
        onWalletConnected: handleSuccessfulWalletConnection
      });
    } catch (error) {
      console.error('Apple login error:', error);
    }
  }, [loginWithOAuth, monitorSolanaWallet, handleSuccessfulWalletConnection]);

  const loginWithEmail = useCallback(async () => {
    await handlePrivyLogin({
      loginMethod: 'email',
      setStatusMessage: () => {},
    });
    await monitorSolanaWallet({
      selectedProvider: 'privy',
      setStatusMessage: () => {},
      onWalletConnected: handleSuccessfulWalletConnection
    });
  }, [handlePrivyLogin, monitorSolanaWallet, handleSuccessfulWalletConnection]);

  const logout = useCallback(async () => {
    await handlePrivyLogout(() => {});
    dispatch(logoutSuccess());
  }, [handlePrivyLogout, dispatch]);

  const connectWallet = useCallback(async () => {
    try {
      if (!user) {
        throw new Error('User must be logged in to connect a wallet');
      }
      
      // If we already have a wallet connected, do nothing
      if (solanaWallet?.wallets && solanaWallet.wallets.length > 0) {
        return;
      }
      
      // Connect wallet using Privy
      await monitorSolanaWallet({
        selectedProvider: 'privy',
        setStatusMessage: () => {},
        onWalletConnected: info => {
          // Create user in backend
          createUserInBackend(info.address).catch(err => 
            console.error('Failed to create user during wallet connect:', err)
          );
          
          // Update user login state with wallet address
          dispatch(loginSuccess({
            address: info.address,
            // Preserve existing profile data but handle null values
            ...(authState.username ? { username: authState.username } : {}),
            ...(authState.profilePicUrl ? { profilePicUrl: authState.profilePicUrl } : {}),
            ...(authState.description ? { description: authState.description } : {})
          }));
        },
      });
    } catch (error) {
      console.error('Connect wallet error:', error);
      throw error;
    }
  }, [user, solanaWallet, monitorSolanaWallet, dispatch, authState, createUserInBackend]);

  return {
    status: user ? 'authenticated' : '',
    loginWithGoogle,
    loginWithApple,
    loginWithEmail,
    logout,
    connectWallet,
    user,
    solanaWallet, // Keep for backward compatibility
    wallet: standardWallet, // Add standardized wallet
  };
}
