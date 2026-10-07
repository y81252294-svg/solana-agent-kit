import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
  Platform,
  FlatList,
  ActivityIndicator,
  Alert,
  Clipboard,
  Animated,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../walletProviders/hooks/useAuth';
import { useWallet } from '../walletProviders/hooks/useWallet';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import COLORS from '../assets/colors';
import { HELIUS_STAKED_API_KEY, HELIUS_STAKED_URL } from '@env';

const { width, height } = Dimensions.get('window');

// Use a more reliable Solana RPC endpoint
const SOLANA_RPC = HELIUS_STAKED_URL;
// Add a backup RPC in case the primary one fails
// Helius API endpoint (replace with your API key)
const HELIUS_API_ENDPOINT = 'https://api.helius.xyz/v0';
const HELIUS_API_KEY = HELIUS_STAKED_API_KEY; // Replace with your actual API key

// Define the transaction interfaces based on Helius API response
interface NativeTransfer {
  fromUserAccount: string;
  toUserAccount: string;
  amount: number;
}

interface TokenTransfer {
  fromUserAccount: string;
  toUserAccount: string;
  fromTokenAccount?: string;
  toTokenAccount?: string;
  tokenAmount: number;
  mint: string;
}

interface TokenBalanceChange {
  userAccount: string;
  tokenAccount: string;
  mint: string;
  rawTokenAmount: {
    tokenAmount: string;
    decimals: number;
  };
}

interface AccountData {
  account: string;
  nativeBalanceChange: number;
  tokenBalanceChanges?: Array<TokenBalanceChange>;
}

interface SwapEvent {
  nativeInput?: {
    account: string;
    amount: string;
  };
  nativeOutput?: {
    account: string;
    amount: string;
  };
  tokenInputs?: Array<TokenBalanceChange>;
  tokenOutputs?: Array<TokenBalanceChange>;
  tokenFees?: Array<TokenBalanceChange>;
  nativeFees?: Array<{
    account: string;
    amount: string;
  }>;
  innerSwaps?: any[];
}

interface NFTEvent {
  description: string;
  type: string;
  source: string;
  amount: number;
  fee: number;
  feePayer: string;
  signature: string;
  slot: number;
  timestamp: number;
  saleType: string;
  buyer?: string;
  seller?: string;
  staker?: string;
  nfts?: Array<{
    mint: string;
    tokenStandard: string;
  }>;
}

interface Events {
  nft?: NFTEvent;
  swap?: SwapEvent;
  compressed?: {
    type: string;
    treeId: string;
    assetId: string;
    newLeafOwner: string;
    oldLeafOwner: string;
  };
  setAuthority?: {
    account: string;
    from: string;
    to: string;
  };
}

interface Transaction {
  description: string;
  type: string;
  source: string;
  fee: number;
  feePayer: string;
  signature: string;
  slot: number;
  timestamp: number;
  nativeTransfers?: Array<NativeTransfer>;
  tokenTransfers?: Array<TokenTransfer>;
  accountData?: Array<AccountData>;
  transactionError?: {
    error: string;
  };
  instructions?: any[];
  events?: Events;
}

export default function ProfileScreen() {
  const { logout } = useAuth();
  const { address, publicKey } = useWallet();
  const walletAddress = address || publicKey?.toString();

  // State for wallet balance
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  // State for transactions
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastSignature, setLastSignature] = useState<string | null>(null);
  
  // Refs for API rate limiting
  const lastBalanceApiCall = useRef<number>(0);
  const lastTransactionsApiCall = useRef<number>(0);
  const minApiCallInterval = 5000; // 5 seconds between API calls
  
  // API call attempts counter for exponential backoff
  const balanceApiAttempts = useRef<number>(0);
  const transactionsApiAttempts = useRef<number>(0);
  
  // Function to check if we can make an API call based on time elapsed
  const canMakeApiCall = (lastCallRef: React.MutableRefObject<number>): boolean => {
    const now = Date.now();
    const timeElapsed = now - lastCallRef.current;
    return timeElapsed >= minApiCallInterval;
  };
  
  // Get exponential backoff time based on attempts
  const getBackoffTime = (attempts: number): number => {
    return Math.min(Math.pow(2, attempts) * 1000, 30000); // Max 30 seconds
  };

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Animation on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Fetch balance using RPC with backoff and rate limiting
  const fetchBalance = useCallback(async (forceRefresh = false) => {
    if (!walletAddress || balanceLoading) return;
    
    // Check if we need to wait due to rate limiting
    if (!forceRefresh && !canMakeApiCall(lastBalanceApiCall)) {
      return;
    }
    
    setBalanceLoading(true);
    setBalanceError(null);
    
    lastBalanceApiCall.current = Date.now();
    
    try {
      // Use a single RPC endpoint - simplified to avoid retries
      const rpcEndpoint = SOLANA_RPC;
      
      // Use a timeout to avoid hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      const fetchPromise = fetch(rpcEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [walletAddress]
        })
      });
      
      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.result && data.result.value !== undefined) {
        // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
        setBalance(data.result.value / 1000000000);
        // Reset attempt counter on success
        balanceApiAttempts.current = 0;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalanceError('Could not load balance');
      // No automatic retries
    } finally {
      setBalanceLoading(false);
    }
  }, [walletAddress, balanceLoading]);

  // Fetch transactions using Helius API
  const fetchTransactions = useCallback(
    async (reset = false) => {
      if (!walletAddress || (transactionsLoading && !reset)) return;
      
      // Check if we need to wait due to rate limiting
      if (!reset && !canMakeApiCall(lastTransactionsApiCall)) {
        return;
      }
      
      setTransactionsLoading(true);
      if (reset) {
        setTransactionsError(null);
        setLastSignature(null);
      }
      
      lastTransactionsApiCall.current = Date.now();
      
      try {
        let url = `${HELIUS_API_ENDPOINT}/addresses/${walletAddress}/transactions?api-key=${HELIUS_API_KEY}`;
        
        // Add pagination if we have a last signature
        if (lastSignature && !reset) {
          url += `&before=${lastSignature}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
          // Update transactions and pagination state
          if (reset) {
            setTransactions(data);
          } else {
            setTransactions(prev => [...prev, ...data]);
          }
          
          // Update pagination state
          if (data.length > 0) {
            setLastSignature(data[data.length - 1].signature);
            setHasMore(data.length >= 10); // Assuming default page size is 10
          } else {
            setHasMore(false);
          }
          
          // Reset attempt counter on success
          transactionsApiAttempts.current = 0;
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setTransactionsError('Could not load transactions');
        transactionsApiAttempts.current += 1;
        
        // For development/testing, use mock data if API fails
        if (process.env.NODE_ENV === 'development') {
          console.log('Using mock transaction data for development');
          setTransactions([
            {
              signature: 'mock-tx-1',
              timestamp: Math.floor(Date.now() / 1000) - 300,
              description: 'Sent SOL',
              type: 'TRANSFER',
              source: 'WALLET',
              fee: 5000,
              feePayer: walletAddress || '',
              slot: 1234567,
              nativeTransfers: [{
                fromUserAccount: walletAddress || '',
                toUserAccount: 'mock-recipient-address',
                amount: 1000000000, // 1 SOL
              }]
            },
            {
              signature: 'mock-tx-2',
              timestamp: Math.floor(Date.now() / 1000) - 3600,
              description: 'Received SOL',
              type: 'TRANSFER',
              source: 'WALLET',
              fee: 5000,
              feePayer: 'mock-sender-address',
              slot: 1234566,
              nativeTransfers: [{
                fromUserAccount: 'mock-sender-address',
                toUserAccount: walletAddress || '',
                amount: 500000000, // 0.5 SOL
              }]
            },
            {
              signature: 'mock-tx-3',
              timestamp: Math.floor(Date.now() / 1000) - 7200,
              description: 'Swapped SOL for USDC',
              type: 'SWAP',
              source: 'JUPITER',
              fee: 5000,
              feePayer: walletAddress || '',
              slot: 1234565,
              events: {
                swap: {
                  nativeInput: {
                    account: walletAddress || '',
                    amount: '100000000' // 0.1 SOL
                  },
                  tokenOutputs: [{
                    userAccount: walletAddress || '',
                    tokenAccount: 'mock-token-account',
                    mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC mint
                    rawTokenAmount: {
                      tokenAmount: '10000000',
                      decimals: 6
                    }
                  }]
                }
              }
            },
            {
              signature: 'mock-tx-4',
              timestamp: Math.floor(Date.now() / 1000) - 86400,
              description: 'NFT Purchase',
              type: 'NFT_SALE',
              source: 'MAGIC_EDEN',
              fee: 5000,
              feePayer: walletAddress || '',
              slot: 1234564,
              events: {
                nft: {
                  description: 'NFT Purchase',
                  type: 'NFT_SALE',
                  source: 'MAGIC_EDEN',
                  amount: 1500000000, // 1.5 SOL
                  fee: 5000,
                  feePayer: walletAddress || '',
                  signature: 'mock-sig',
                  slot: 1234564,
                  timestamp: Math.floor(Date.now() / 1000) - 86400,
                  saleType: 'INSTANT_SALE',
                  buyer: walletAddress || '',
                  seller: 'mock-seller-address',
                  nfts: [{
                    mint: 'mock-nft-mint',
                    tokenStandard: 'NonFungible'
                  }]
                }
              }
            }
          ]);
          setHasMore(false);
        }
      } finally {
        setTransactionsLoading(false);
        setRefreshing(false);
      }
    },
    [walletAddress, transactionsLoading, lastSignature]
  );

  // Initial data loading - only load once on mount
  useEffect(() => {
    let mounted = true;
    
    if (walletAddress && !balance && !balanceError) {
      // Only fetch balance once initially, without automatic retries
      fetchBalance();
    }
    
    return () => {
      mounted = false;
    };
  }, [walletAddress, fetchBalance, balance, balanceError]);

  // Initial transactions loading - with debounce to prevent excessive API calls
  useEffect(() => {
    let mounted = true;
    
    if (walletAddress) {
      // Add delay to initial load to prevent app startup spike
      const timer = setTimeout(() => {
        if (mounted) {
          fetchTransactions(true);
        }
      }, 1000);
      
      return () => {
        mounted = false;
        clearTimeout(timer);
      };
    }
  }, [walletAddress, fetchTransactions]);

  // Handle refresh - but prevent too frequent refreshes
  const handleRefresh = useCallback(() => {
    if (!canMakeApiCall(lastBalanceApiCall) || !canMakeApiCall(lastTransactionsApiCall)) {
      Alert.alert(
        "Rate Limited", 
        "Please wait a few seconds before refreshing again."
      );
      setRefreshing(false);
      return;
    }
    
    setRefreshing(true);
    fetchBalance(true);
    fetchTransactions(true);
  }, [fetchBalance, fetchTransactions]);

  // Handle load more - with rate limiting
  const handleLoadMore = useCallback(() => {
    if (hasMore && !transactionsLoading && canMakeApiCall(lastTransactionsApiCall)) {
      fetchTransactions(false);
    }
  }, [hasMore, transactionsLoading, fetchTransactions]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Copy address to clipboard
  const copyAddressToClipboard = () => {
    if (walletAddress) {
      Clipboard.setString(walletAddress);
      Alert.alert('Success', 'Address copied to clipboard!');
    }
  };

  // Format transaction date
  const formatTransactionDate = (timestamp: number) => {
    const now = Date.now();
    const txTime = timestamp * 1000;
    const diffMs = now - txTime;
    
    // Less than a minute ago
    if (diffMs < 60000) {
      return 'Just now';
    }
    
    // Less than an hour ago
    if (diffMs < 3600000) {
      const minutes = Math.floor(diffMs / 60000);
      return `${minutes}m ago`;
    }
    
    // Less than a day ago
    if (diffMs < 86400000) {
      const hours = Math.floor(diffMs / 3600000);
      return `${hours}h ago`;
    }
    
    // Less than a week ago
    if (diffMs < 604800000) {
      const days = Math.floor(diffMs / 86400000);
      return `${days}d ago`;
    }
    
    // Default to date format
    const date = new Date(txTime);
    return date.toLocaleDateString();
  };

  // Format amount based on decimals
  const formatTokenAmount = (amount: string | number, decimals: number = 9, symbol: string = 'SOL') => {
    const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount;
    const formattedAmount = (amountNum / Math.pow(10, decimals)).toFixed(
      decimals === 9 ? 4 : 2
    );
    return `${formattedAmount} ${symbol}`;
  };

  // Determine if a transaction is an inbound transaction
  const isInboundTransaction = (transaction: Transaction): boolean => {
    // For native transfers
    if (transaction.nativeTransfers && transaction.nativeTransfers.length > 0) {
      return transaction.nativeTransfers.some(transfer => 
        transfer.toUserAccount === walletAddress
      );
    }
    
    // For token transfers
    if (transaction.tokenTransfers && transaction.tokenTransfers.length > 0) {
      return transaction.tokenTransfers.some(transfer => 
        transfer.toUserAccount === walletAddress
      );
    }
    
    // For NFT sales
    if (transaction.events?.nft) {
      return transaction.events.nft.buyer === walletAddress;
    }
    
    // For swaps, check if user is receiving tokens
    if (transaction.events?.swap) {
      const tokenOutputs = transaction.events.swap.tokenOutputs;
      if (tokenOutputs && tokenOutputs.some(output => 
        output.userAccount === walletAddress
      )) {
        return true;
      }
    }
    
    return false;
  };

  // Get transaction type and details
  const getTransactionInfo = (transaction: Transaction) => {
    let type = transaction.type || 'UNKNOWN';
    let icon = 'arrow-right';
    let iconColor = COLORS.darkText.secondary;
    let description = transaction.description || 'Transaction';
    let amount = '';
    let isInbound = false;
    
    // Determine transaction type and icon
    if (type === 'TRANSFER' || transaction.nativeTransfers?.length) {
      isInbound = isInboundTransaction(transaction);
      icon = isInbound ? 'arrow-down' : 'arrow-up';
      iconColor = isInbound ? COLORS.status.success : COLORS.status.error;
      
      if (transaction.nativeTransfers?.length) {
        const relevantTransfer = transaction.nativeTransfers.find(transfer => 
          transfer.toUserAccount === walletAddress || transfer.fromUserAccount === walletAddress
        );
        
        if (relevantTransfer) {
          amount = formatTokenAmount(relevantTransfer.amount);
          description = isInbound ? 'Received SOL' : 'Sent SOL';
        }
      }
    } else if (type === 'SWAP' || transaction.events?.swap) {
      icon = 'repeat';
      iconColor = '#F1C232'; // Yellow for swaps
      
      if (transaction.events?.swap) {
        const swap = transaction.events.swap;
        
        // Handle SOL input
        if (swap.nativeInput && swap.nativeInput.account === walletAddress) {
          const solAmount = formatTokenAmount(swap.nativeInput.amount);
          
          // Check for token output
          if (swap.tokenOutputs && swap.tokenOutputs.length > 0) {
            const output = swap.tokenOutputs[0];
            const tokenAmount = formatTokenAmount(
              output.rawTokenAmount.tokenAmount,
              output.rawTokenAmount.decimals,
              getMintSymbol(output.mint)
            );
            description = `Swapped ${solAmount} → ${tokenAmount}`;
          } else {
            description = `Swapped ${solAmount}`;
          }
        } 
        // Handle token input
        else if (swap.tokenInputs && swap.tokenInputs.length > 0) {
          const input = swap.tokenInputs.find(i => i.userAccount === walletAddress);
          
          if (input) {
            const tokenInputAmount = formatTokenAmount(
              input.rawTokenAmount.tokenAmount,
              input.rawTokenAmount.decimals,
              getMintSymbol(input.mint)
            );
            
            // Check for SOL output
            if (swap.nativeOutput && swap.nativeOutput.account === walletAddress) {
              const solAmount = formatTokenAmount(swap.nativeOutput.amount);
              description = `Swapped ${tokenInputAmount} → ${solAmount}`;
            } 
            // Check for token output
            else if (swap.tokenOutputs && swap.tokenOutputs.length > 0) {
              const output = swap.tokenOutputs.find(o => o.userAccount === walletAddress);
              
              if (output) {
                const tokenOutputAmount = formatTokenAmount(
                  output.rawTokenAmount.tokenAmount,
                  output.rawTokenAmount.decimals,
                  getMintSymbol(output.mint)
                );
                description = `Swapped ${tokenInputAmount} → ${tokenOutputAmount}`;
              }
            }
          }
        }
      }
    } else if (type.includes('NFT') || transaction.events?.nft) {
      const nftEvent = transaction.events?.nft;
      
      if (nftEvent) {
        isInbound = nftEvent.buyer === walletAddress;
        
        if (type === 'NFT_SALE' || type === 'NFT_LISTING_SALE') {
          icon = isInbound ? 'cart' : 'cash';
          iconColor = isInbound ? '#9D4EDD' : '#2A9D8F';
          const nftAmount = formatTokenAmount(nftEvent.amount);
          description = isInbound ? `Bought NFT for ${nftAmount}` : `Sold NFT for ${nftAmount}`;
          amount = nftAmount;
        } else if (type === 'NFT_MINT') {
          icon = 'star';
          iconColor = '#9D4EDD';
          description = 'Minted NFT';
        } else if (type === 'NFT_BID') {
          icon = 'gavel';
          iconColor = '#E9C46A';
          description = 'Bid on NFT';
        }
      }
    } else if (type === 'UNKNOWN') {
      icon = 'help-circle';
    }
    
    return { 
      type, 
      icon, 
      iconColor, 
      description, 
      amount, 
      isInbound
    };
  };

  // Get token symbol based on mint address
  const getMintSymbol = (mintAddress: string): string => {
    // Common token mint addresses and their symbols
    const knownTokens: Record<string, string> = {
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'USDC',
      'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': 'USDT',
      'DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ': 'DUST',
      // Add more known tokens as needed
    };
    
    return knownTokens[mintAddress] || 'Unknown';
  };

  // Render transaction item with improved UI
  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const { type, icon, iconColor, description, amount, isInbound } = getTransactionInfo(item);
    
    // Select the right icon component based on the icon name
    let IconComponent: any = Ionicons;
    if (icon === 'repeat' || icon === 'cash' || icon === 'star' || icon === 'cart') {
      IconComponent = FontAwesome5;
    } else if (icon === 'gavel') {
      IconComponent = MaterialCommunityIcons;
    }

    return (
      <Animated.View
        style={[
          styles.transactionItem,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        <LinearGradient
          colors={['rgba(42, 42, 42, 0.8)', 'rgba(48, 48, 48, 0.8)']}
          style={styles.transactionGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={[styles.transactionIconContainer, { backgroundColor: `${iconColor}20` }]}>
            <IconComponent 
              name={icon} 
              size={20} 
              color={iconColor} 
            />
          </View>
          
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionType} numberOfLines={1}>
              {description}
            </Text>
            
            <Text style={styles.transactionDate}>
              {formatTransactionDate(item.timestamp)}
            </Text>
          </View>
          
          {amount && (
            <View style={styles.transactionAmountContainer}>
              <Text style={[
                styles.transactionAmount,
                type === 'SWAP' ? styles.amountSwap : (isInbound ? styles.amountPositive : styles.amountNegative)
              ]}>
                {isInbound ? '+' : '-'} {amount}
              </Text>
            </View>
          )}
        </LinearGradient>
      </Animated.View>
    );
  };

  // Render the footer for the transaction list (loading indicator)
  const renderFooter = () => {
    if (!transactionsLoading || refreshing) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.brandPrimary} />
      </View>
    );
  };

  // Render empty state for transactions
  const renderEmptyComponent = () => {
    if (transactionsLoading && !refreshing) return null;
    
    if (transactionsError) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={COLORS.status.error} />
          <Text style={styles.emptyText}>Transactions Unavailable</Text>
          <Text style={styles.emptySubtext}>We're experiencing issues with the transaction API. Please check back later.</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="wallet-outline" size={60} color={COLORS.darkText.tertiary} />
        <Text style={styles.emptyText}>No transactions yet</Text>
        <Text style={styles.emptySubtext}>Transactions will appear here once you start using your wallet</Text>
      </View>
    );
  };

  // Group transactions by date
  const groupTransactionsByDate = useCallback(() => {
    if (!transactions.length) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = Math.floor(today.getTime() / 1000);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayTimestamp = Math.floor(yesterday.getTime() / 1000);
    
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoTimestamp = Math.floor(oneWeekAgo.getTime() / 1000);
    
    const groups = [
      { title: 'Today', data: [] as Transaction[] },
      { title: 'Yesterday', data: [] as Transaction[] },
      { title: 'This Week', data: [] as Transaction[] },
      { title: 'Earlier', data: [] as Transaction[] },
    ];
    
    transactions.forEach(transaction => {
      if (transaction.timestamp >= todayTimestamp) {
        groups[0].data.push(transaction);
      } else if (transaction.timestamp >= yesterdayTimestamp) {
        groups[1].data.push(transaction);
      } else if (transaction.timestamp >= oneWeekAgoTimestamp) {
        groups[2].data.push(transaction);
      } else {
        groups[3].data.push(transaction);
      }
    });
    
    // Filter out empty groups
    return groups.filter(group => group.data.length > 0);
  }, [transactions]);

  // Render section header
  const renderSectionHeader = ({ section }: { section: { title: string, data: Transaction[] } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
      
      <LinearGradient
        colors={['#1A1A1A', '#121212', '#050505']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Decorative elements */}
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />
        <LinearGradient
          colors={['rgba(50, 212, 222, 0.05)', 'transparent']}
          style={styles.glow1}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        <Animated.View 
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Text style={styles.title}>Profile</Text>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={COLORS.status.error} />
          </TouchableOpacity>
        </Animated.View>
        
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={[COLORS.brandPrimary, COLORS.cyan, '#2AABB3']}
              style={styles.avatarBorder}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {walletAddress ? walletAddress.substring(0, 2).toUpperCase() : 'P'}
                </Text>
              </View>
            </LinearGradient>
          </View>
          
          <TouchableOpacity 
            onPress={copyAddressToClipboard} 
            style={styles.addressContainer}
            activeOpacity={0.7}
          >
            <Text style={styles.walletAddress}>
              {walletAddress 
                ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
                : 'Not connected'
              }
            </Text>
            <Ionicons name="copy-outline" size={16} color={COLORS.darkText.tertiary} style={styles.copyIcon} />
          </TouchableOpacity>
          
          <LinearGradient
            colors={['rgba(30, 30, 30, 0.7)', 'rgba(40, 40, 40, 0.7)']}
            style={styles.infoCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.infoTitle}>Wallet Balance</Text>
            <View style={styles.balanceRow}>
              {balanceLoading ? (
                <ActivityIndicator size="small" color={COLORS.brandPrimary} />
              ) : balanceError ? (
                <View style={styles.balanceErrorContainer}>
                  <Text style={styles.infoValue}>-- SOL</Text>
                  <TouchableOpacity 
                    onPress={() => {
                      if (canMakeApiCall(lastBalanceApiCall)) {
                        fetchBalance(true);
                      } else {
                        Alert.alert(
                          "Rate Limited", 
                          "Please wait a few seconds before retrying."
                        );
                      }
                    }}
                  >
                    <Ionicons name="refresh-outline" size={20} color={COLORS.darkText.tertiary} style={styles.refreshIcon} />
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.infoValue}>
                  {balance !== null ? `${balance.toFixed(4)} SOL` : '0 SOL'}
                </Text>
              )}
            </View>
          </LinearGradient>
        </View>
        
        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.transactionsHeader}>Recent Activity</Text>
        </View>
        
        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.signature}
          contentContainerStyle={styles.transactionsList}
          ListEmptyComponent={renderEmptyComponent}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.brandPrimary}
              colors={[COLORS.brandPrimary]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  decorCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.brandPrimaryAlpha.a10,
    top: -50,
    left: -50,
    opacity: 0.5,
  },
  decorCircle2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(181, 145, 255, 0.04)',
    bottom: 100,
    right: -100,
  },
  glow1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: height * 0.4,
    left: -width * 0.3,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.darkText.primary,
    textShadowColor: COLORS.brandPrimaryAlpha.a50,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  profileContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarBorder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.brandPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  avatar: {
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: COLORS.darkBg.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.darkText.primary,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(45, 45, 45, 0.6)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  walletAddress: {
    fontSize: 16,
    color: COLORS.darkText.secondary,
  },
  copyIcon: {
    marginLeft: 8,
  },
  refreshIcon: {
    marginLeft: 8,
  },
  infoCard: {
    width: width * 0.9,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoTitle: {
    fontSize: 14,
    color: COLORS.darkText.tertiary,
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.darkText.primary,
  },
  transactionsHeaderContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  transactionsHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.darkText.primary,
  },
  sectionHeader: {
    backgroundColor: 'rgba(25, 25, 25, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkText.secondary,
  },
  transactionsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.darkText.secondary,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    color: COLORS.darkText.tertiary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  transactionItem: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  transactionGradient: {
    width: '100%',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.darkText.primary,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: COLORS.darkText.tertiary,
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
    minWidth: 100,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  amountPositive: {
    color: COLORS.status.success,
  },
  amountNegative: {
    color: COLORS.status.error,
  },
  amountSwap: {
    color: '#F1C232',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});