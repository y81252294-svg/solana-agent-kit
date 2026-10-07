import { useAuth } from './useAuth';
import { Connection, Transaction, VersionedTransaction, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { useMemo, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/useReduxHooks';
import { fetchUserProfile } from '../../state/auth/reducer';
import { StandardWallet } from '../types';

/**
 * A hook that provides wallet and transaction capabilities
 * specifically for Privy wallet provider
 */
export function useWallet() {
  // Get Redux auth state
  const authState = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  
  // Get wallet from useAuth
  const { wallet, solanaWallet } = useAuth();

  // Add an effect to ensure profile data is loaded if we have a wallet address
  // but no profile info (prevents "flashing" anonymous state)
  useEffect(() => {
    // We need a stable flag to track if we should fetch
    let shouldFetch = false;
    
    // Check if we need to fetch profile data
    if (authState.isLoggedIn && authState.address) {
      // Only fetch if we're missing profile data
      if (!authState.username || !authState.profilePicUrl) {
        shouldFetch = true;
      }
    }
    
    // Use a timeout to debounce multiple profile fetch requests
    // and avoid multiple fetches during app initialization
    if (shouldFetch) {
      const timer = setTimeout(() => {
        // Explicitly pass the current user's address to ensure we only fetch their profile
        const userAddress = authState.address;
        if (userAddress) {
          dispatch(fetchUserProfile(userAddress));
        }
      }, 300); // Small delay to allow for auth state to stabilize
      
      return () => clearTimeout(timer);
    }
  }, [authState.isLoggedIn, authState.address, authState.username, authState.profilePicUrl, dispatch]);

  // Get the current wallet
  const currentWallet = useMemo(() => {
    return wallet || solanaWallet;
  }, [wallet, solanaWallet]);

  /**
   * Signs and sends a transaction using the Privy wallet
   */
  const sendTransaction = async (
    transaction: Transaction | VersionedTransaction,
    connection: Connection,
    options?: { confirmTransaction?: boolean; statusCallback?: (status: string) => void }
  ): Promise<string> => {
    if (!currentWallet) {
      throw new Error('No wallet connected');
    }

    // Use Privy's native signAndSendTransaction method via the wallet provider
    let provider;
    
    // Safely try to get wallet provider, checking for null at each step
    if (wallet && wallet.getProvider) {
      provider = await wallet.getProvider();
    } else if (solanaWallet && solanaWallet.getProvider) {
      provider = await solanaWallet.getProvider();
    }
    
    if (!provider) {
      throw new Error('Failed to get wallet provider');
    }

    const { signature } = await provider.request({
      method: 'signAndSendTransaction',
      params: {
        transaction,
        connection,
      },
    });

    if (!signature) {
      throw new Error('No signature returned from wallet');
    }

    // Handle confirmation if requested
    if (options?.confirmTransaction) {
      options?.statusCallback?.('Confirming transaction...');
      await connection.confirmTransaction(signature, 'confirmed');
      options?.statusCallback?.('Transaction confirmed!');
    }

    return signature;
  };

  /**
   * Signs and sends a transaction from instructions using the Privy wallet
   */
  const sendInstructions = async (
    instructions: TransactionInstruction[],
    feePayer: PublicKey,
    connection: Connection,
    options?: { confirmTransaction?: boolean; statusCallback?: (status: string) => void }
  ): Promise<string> => {
    if (!currentWallet) {
      throw new Error('No wallet connected');
    }

    // Create a transaction from the instructions
    const transaction = new Transaction();
    transaction.add(...instructions);
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = feePayer;

    return sendTransaction(transaction, connection, options);
  };

  /**
   * Signs and sends a base64-encoded transaction using the Privy wallet
   */
  const sendBase64Transaction = async (
    base64Tx: string,
    connection: Connection,
    options?: { confirmTransaction?: boolean; statusCallback?: (status: string) => void }
  ): Promise<string> => {
    if (!currentWallet) {
      throw new Error('No wallet connected');
    }

    // Convert base64 to Transaction object
    const buffer = Buffer.from(base64Tx, 'base64');
    let transaction;
    
    try {
      // Try to deserialize as VersionedTransaction first
      transaction = VersionedTransaction.deserialize(buffer);
    } catch (error) {
      // Fall back to legacy Transaction if that fails
      transaction = Transaction.from(buffer);
    }

    return sendTransaction(transaction, connection, options);
  };

  // Convert string public key to PublicKey object when available
  const publicKey = useMemo(() => {
    // First try to get from StandardWallet
    if (wallet?.publicKey) {
      try {
        return new PublicKey(wallet.publicKey);
      } catch (e) {
        console.error('[useWallet] Invalid publicKey in StandardWallet:', e);
      }
    }
    
    // Then try from legacy wallet
    if (solanaWallet?.wallets?.[0]?.publicKey) {
      try {
        return new PublicKey(solanaWallet.wallets[0].publicKey);
      } catch (e) {
        console.error('[useWallet] Invalid publicKey in legacy wallet:', e);
      }
    }
    
    // Fallback to Redux state address
    if (authState.address) {
      try {
        return new PublicKey(authState.address);
      } catch (e) {
        console.error('[useWallet] Invalid publicKey in Redux state:', e);
      }
    }
    
    return null;
  }, [wallet, solanaWallet, authState.address]);
  
  // Get wallet address as string
  const address = useMemo(() => {
    return wallet?.address || 
           wallet?.publicKey || 
           solanaWallet?.wallets?.[0]?.publicKey || 
           solanaWallet?.wallets?.[0]?.address || 
           authState.address ||
           null;
  }, [wallet, solanaWallet, authState.address]);

  // Determine if a wallet is connected
  const connected = useMemo(() => {
    return !!wallet || !!solanaWallet || !!authState.address;
  }, [wallet, solanaWallet, authState.address]);

  /**
   * Signs a message using the Privy wallet
   */
  const signMessage = async (message: Uint8Array): Promise<Uint8Array> => {
    if (!currentWallet) {
      throw new Error('No wallet connected');
    }

    // Use Privy's native signMessage method via the wallet provider
    let provider;
    
    // Safely try to get wallet provider, checking for null at each step
    if (wallet && wallet.getProvider) {
      provider = await wallet.getProvider();
    } else if (solanaWallet && solanaWallet.getProvider) {
      provider = await solanaWallet.getProvider();
    }
    
    if (!provider) {
      throw new Error('Failed to get wallet provider');
    }

    try {
      const { signature } = await provider.request({
        method: 'signMessage',
        params: {
          message,
          display: 'utf8', // Display message as UTF-8 string if possible
        },
      });

      if (!signature) {
        throw new Error('No signature returned from wallet');
      }

      return Buffer.from(signature);
    } catch (error) {
      console.error('Error signing message:', error);
      throw new Error('Failed to sign message');
    }
  };

  /**
   * Signs multiple transactions using the Privy wallet
   */
  const signAllTransactions = async (
    transactions: (Transaction | VersionedTransaction)[]
  ): Promise<(Transaction | VersionedTransaction)[]> => {
    if (!currentWallet) {
      throw new Error('No wallet connected');
    }

    // Use Privy's native signAllTransactions method via the wallet provider
    let provider;
    
    // Safely try to get wallet provider, checking for null at each step
    if (wallet && wallet.getProvider) {
      provider = await wallet.getProvider();
    } else if (solanaWallet && solanaWallet.getProvider) {
      provider = await solanaWallet.getProvider();
    }
    
    if (!provider) {
      throw new Error('Failed to get wallet provider');
    }

    try {
      const { signedTransactions } = await provider.request({
        method: 'signAllTransactions',
        params: {
          transactions,
        },
      });

      if (!signedTransactions || !Array.isArray(signedTransactions)) {
        throw new Error('No signed transactions returned from wallet');
      }

      return signedTransactions;
    } catch (error) {
      console.error('Error signing transactions:', error);
      throw new Error('Failed to sign transactions');
    }
  };

  /**
   * Signs a transaction using the Privy wallet but does not send it
   */
  const signTransaction = async (
    transaction: Transaction | VersionedTransaction
  ): Promise<Transaction | VersionedTransaction> => {
    if (!currentWallet) {
      throw new Error('No wallet connected');
    }

    // Use Privy's native signTransaction method via the wallet provider
    let provider;
    
    // Safely try to get wallet provider, checking for null at each step
    if (wallet && wallet.getProvider) {
      provider = await wallet.getProvider();
    } else if (solanaWallet && solanaWallet.getProvider) {
      provider = await solanaWallet.getProvider();
    }
    
    if (!provider) {
      throw new Error('Failed to get wallet provider');
    }

    try {
      const { signedTransaction } = await provider.request({
        method: 'signTransaction',
        params: {
          transaction,
        },
      });

      if (!signedTransaction) {
        throw new Error('No signed transaction returned from wallet');
      }

      return signedTransaction;
    } catch (error) {
      console.error('Error signing transaction:', error);
      throw new Error('Failed to sign transaction');
    }
  };

  return {
    wallet: currentWallet,    // The best available wallet
    solanaWallet,             // Legacy wallet (for backward compatibility)
    publicKey,
    address,
    connected,
    sendTransaction,          // Send transaction with Privy wallet
    sendInstructions,         // Send instructions with Privy wallet
    sendBase64Transaction,    // Send base64 transaction with Privy wallet
    signMessage,              // Sign message with Privy wallet
    signTransaction,          // Sign transaction with Privy wallet
    signAllTransactions,      // Sign multiple transactions with Privy wallet
    provider: 'privy',
    isPrivy: () => true,      // Always true since we only support Privy
  };
} 