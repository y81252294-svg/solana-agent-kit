import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import COLORS from '../assets/colors';

interface ErrorHandlerProps {
  error: string | null;
  onDismiss?: () => void;
  autoDismiss?: boolean;
  dismissDuration?: number;
}

export default function ErrorHandler({ 
  error, 
  onDismiss, 
  autoDismiss = true,
  dismissDuration = 5000 
}: ErrorHandlerProps) {
  const [visible, setVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    if (error) {
      setVisible(true);
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss if enabled
      if (autoDismiss) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, dismissDuration);
        return () => clearTimeout(timer);
      }
    }
  }, [error]);

  const handleDismiss = () => {
    // Animate out
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      if (onDismiss) onDismiss();
    });
  };

  if (!error || !visible) return null;

  return (
    <Animated.View 
      style={[
        styles.container, 
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.errorContent}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
      <TouchableOpacity 
        style={styles.dismissButton}
        onPress={handleDismiss}
      >
        <Text style={styles.dismissText}>Dismiss</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 80, 80, 0.9)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  errorContent: {
    flex: 1,
    marginRight: 10,
  },
  errorText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
  dismissButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  dismissText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
}); 