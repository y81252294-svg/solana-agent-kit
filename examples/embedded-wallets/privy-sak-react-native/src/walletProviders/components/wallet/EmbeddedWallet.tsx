import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  Dimensions,
  ActivityIndicator,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icons from '../../../assets/svgs';
import { useAuth } from '../../hooks/useAuth';
import COLORS from '../../../assets/colors';

export interface EmbeddedWalletAuthProps {
  onWalletConnected: (info: {
    provider: 'privy';
    address: string;
  }) => void;
  authMode?: 'login' | 'signup';
}

const { width } = Dimensions.get('window');

const EmbeddedWalletAuth: React.FC<EmbeddedWalletAuthProps> = ({
  onWalletConnected,
  authMode = 'login',
}) => {
  const {
    status,
    loginWithGoogle,
    loginWithApple,
    loginWithEmail,
    user,
    solanaWallet,
  } = useAuth();

  // Debug logs for authentication flow
  useEffect(() => {
    console.log('Auth status:', status);
    console.log('Privy user:', user ? `User ID: ${user.id}` : 'No user');
    console.log('Solana wallet:', solanaWallet ? 
      `Wallets: ${solanaWallet.wallets?.length || 0}` : 
      'No wallet');
    
    if (user && solanaWallet?.wallets?.length) {
      console.log('Ready to connect wallet with address:', 
        solanaWallet.wallets[0].publicKey);
    }
  }, [status, user, solanaWallet]);

  // When user is authenticated and has a wallet, trigger the callback
  useEffect(() => {
    if (status === 'authenticated' && user?.id && solanaWallet?.wallets?.length) {
      const walletPublicKey = solanaWallet.wallets[0].publicKey;
      if (walletPublicKey) {
        console.log('Wallet connected, triggering callback with address:', walletPublicKey);
        onWalletConnected({ provider: 'privy', address: walletPublicKey });
      }
    }
  }, [status, user, solanaWallet, onWalletConnected]);

  const isLoading = status === 'loading';

  // Handle login with error handling
  const handleGoogleLogin = async () => {
    try {
      if (loginWithGoogle) {
        await loginWithGoogle();
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Authentication Error', 'Failed to authenticate with Google. Please try again.');
    }
  };

  const handleAppleLogin = async () => {
    try {
      if (loginWithApple) {
        await loginWithApple();
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Authentication Error', 'Failed to authenticate with Apple. Please try again.');
    }
  };

  const handleEmailLogin = async () => {
    try {
      if (loginWithEmail) await loginWithEmail();
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Authentication Error', 'Failed to authenticate with Email. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.brandPrimary} />
        <Text style={styles.loadingText}>Connecting...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Google Button */}
      <TouchableOpacity 
        style={styles.socialButton} 
        onPress={handleGoogleLogin}
        activeOpacity={0.7}
      >
        <View style={styles.buttonBorder}>
          <LinearGradient
            colors={[COLORS.darkSurface.card, COLORS.darkBg.primary]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.buttonContent}>
              <View style={[styles.iconContainer, styles.googleIconContainer]}>
                <Icons.Google width={20} height={20} />
              </View>
              <Text style={styles.buttonText}>Continue with Google</Text>
            </View>
          </LinearGradient>
        </View>
      </TouchableOpacity>

      {/* Apple Button */}
      <TouchableOpacity 
        style={styles.socialButton} 
        onPress={handleAppleLogin}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={[COLORS.darkSurface.card, COLORS.black]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonBorder}
        >
          <LinearGradient
            colors={[COLORS.darkBg.tertiary, COLORS.black]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.buttonContent}>
              <View style={styles.iconContainer}>
                <Icons.Apple width={20} height={20} />
              </View>
              <Text style={[styles.buttonText, styles.whiteText]}>Continue with Apple</Text>
            </View>
          </LinearGradient>
        </LinearGradient>
      </TouchableOpacity>

      {/* Email Button */}
      <TouchableOpacity 
        style={styles.socialButton} 
        onPress={handleEmailLogin}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={[COLORS.brandPrimary, COLORS.cyan, '#2AABB3']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonBorder}
        >
          <LinearGradient
            colors={[COLORS.darkBg.tertiary, COLORS.black]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.buttonContent}>
              <View style={[styles.iconContainer, styles.emailIconContainer]}>
                <Icons.Device width={20} height={20} />
              </View>
              <Text style={[styles.buttonText, styles.whiteText]}>Continue with Email</Text>
            </View>
          </LinearGradient>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 10 : 0,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.darkText.primary,
    fontWeight: '500',
  },
  socialButton: {
    width: width * 0.85,
    height: 56,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonBorder: {
    flex: 1,
    padding: 1.5,
    borderRadius: 14,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  googleIconContainer: {
    backgroundColor: '#FFFFFF',
  },
  emailIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
    color: COLORS.darkText.primary,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  whiteText: {
    color: COLORS.white,
  },
});

export default EmbeddedWalletAuth;
