// File: src/screens/LoginScreen/LoginScreen.tsx
import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Animated, 
  Text, 
  Dimensions, 
  Alert, 
  StatusBar,
  StyleSheet
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import COLORS from '../../assets/colors';
import EmbeddedWalletAuth from '../../walletProviders/components/wallet/EmbeddedWallet';
import { loginSuccess } from '../../state/auth/reducer';
import { RootState } from '../../state/store';
import { SERVER_URL } from '@env';
import Icons from '../../assets/svgs/index';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SERVER_BASE_URL = SERVER_URL || 'http://localhost:3000';

export default function LoginScreen() {
  const navigation = useAppNavigation();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Staggered animations for a smoother entry
    Animated.sequence([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeIn, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideUp, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [fadeIn, slideUp, logoScale]);

  useEffect(() => {
    if (isLoggedIn) {
      navigation.navigate('MainTabs');
    }
  }, [isLoggedIn, navigation]);

  const handleWalletConnected = async (info: { provider: 'privy'; address: string }) => {
    console.log('Wallet connected:', info);
    try {
      dispatch(
        loginSuccess({
          address: info.address,
        }),
      );
    } catch (error) {
      console.error('Error handling wallet connection:', error);
      Alert.alert(
        'Connection Error',
        'Successfully connected to wallet but encountered an error proceeding to the app.',
      );
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
      
      <SafeAreaView style={styles.container} edges={['right', 'left', 'top']}>
        <LinearGradient
          colors={['#1A1A1A', '#121212', '#050505']}
          style={styles.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Decorative elements */}
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />
          <View style={styles.decorCircle3} />
          
          <View style={styles.contentContainer}>
            <Animated.View 
              style={[
                styles.logoContainer,
                { 
                  transform: [{ scale: logoScale }],
                }
              ]}
            >
              <Icons.SolanaDot width={60} height={60} />
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.headingContainer,
                {
                  opacity: fadeIn,
                  transform: [{ translateY: slideUp }]
                }
              ]}
            >
              <Text style={styles.title}>Welcome to Privy SAK React Native App</Text>
              <Text style={styles.subtitle}>Your gateway to the Solana ecosystem</Text>
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.walletContainer,
                { 
                  opacity: fadeIn,
                  transform: [{ translateY: slideUp }] 
                }
              ]}
            >
              <EmbeddedWalletAuth onWalletConnected={handleWalletConnected} />
            </Animated.View>
            
            <Animated.Text 
              style={[
                styles.agreementText,
                { 
                  opacity: fadeIn,
                  transform: [{ translateY: slideUp }] 
                }
              ]}
            >
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Animated.Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    </SafeAreaProvider>
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
  decorCircle3: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    top: 200,
    left: -50,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headingContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.darkText.primary,
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: COLORS.brandPrimaryAlpha.a50,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.darkText.secondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  walletContainer: {
    width: '100%',
    alignItems: 'center',
  },
  agreementText: {
    color: COLORS.darkText.tertiary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 30,
  },
});
