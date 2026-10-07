import React, { useState, useRef, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Platform,
  View,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useIsFocused, CommonActions } from '@react-navigation/native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import COLORS from '@/assets/colors';
import ProfileScreen from '@/screens/ProfileScreen';
import ChatHistoryScreen from '@/screens/ChatHistoryScreen';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

type IconName = React.ComponentProps<typeof Ionicons>['name'];

// Custom animated tab bar component
const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const [translateX] = useState(new Animated.Value(0));
  const totalWidth = width;
  const tabWidth = totalWidth / state.routes.length;
  
  useEffect(() => {
    Animated.spring(translateX, {
      toValue: state.index * tabWidth,
      useNativeDriver: true,
      tension: 70,
      friction: 9,
    }).start();
  }, [state.index, tabWidth, translateX]);
  
  return (
    <View style={styles.customTabContainer}>
      <LinearGradient
        colors={['rgba(15, 15, 15, 0.8)', 'rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <BlurView intensity={90} tint="dark" style={styles.blurView}>
          <View style={styles.tabBarInner}>
            {/* Animated indicator */}
            <Animated.View 
              style={[
                styles.tabIndicator,
                { 
                  transform: [{ translateX }],
                  width: tabWidth,
                }
              ]} 
            />
            
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const isFocused = state.index === index;
              const label = options.tabBarLabel || route.name;
              
              let iconName: IconName = 'help-circle-outline';
              switch (route.name) {
                case 'ChatHistoryTab':
                  iconName = isFocused ? 'chatbubbles' : 'chatbubbles-outline';
                  break;
                case 'ProfileTab':
                  iconName = isFocused ? 'person' : 'person-outline';
                  break;
              }
              
              const onPress = () => {
                if (route.name === 'ChatTab') {
                  navigation.dispatch(
                    CommonActions.navigate({
                      name: 'Chat',
                    })
                  );
                  return;
                }
                
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                
                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };
              
              // Create animated values for icon and text
              const opacity = isFocused ? 1 : 0.7;
              const scale = isFocused ? 1.05 : 1;
              
              return (
                <TouchableOpacity
                  key={index}
                  onPress={onPress}
                  style={styles.tabBarButton}
                  activeOpacity={0.7}
                >
                  <Animated.View 
                    style={[
                      styles.tabItem,
                      { 
                        transform: [{ scale }],
                        opacity
                      }
                    ]}
                  >
                    <Ionicons 
                      name={iconName} 
                      size={24} 
                      color={isFocused ? COLORS.brandPrimary : COLORS.darkText.tertiary} 
                    />
                    <Animated.Text 
                      style={[
                        styles.tabText,
                        { color: isFocused ? COLORS.brandPrimary : COLORS.darkText.tertiary }
                      ]}
                    >
                      {label as string}
                    </Animated.Text>
                  </Animated.View>
                </TouchableOpacity>
              );
            })}
          </View>
        </BlurView>
      </LinearGradient>
    </View>
  );
};

interface AnimatedScreenProps {
  children: React.ReactNode;
  isFocused: boolean;
}

// Animated screens for smooth transitions
const AnimatedScreen: React.FC<AnimatedScreenProps> = ({ children, isFocused }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  
  useEffect(() => {
    if (isFocused) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      fadeAnim.setValue(0);
      translateY.setValue(20);
    }
  }, [isFocused, fadeAnim, translateY]);
  
  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: fadeAnim,
        transform: [{ translateY }],
      }}
    >
      {children}
    </Animated.View>
  );
};

// Wrap each screen component to add bottom padding for the tab bar
const SafeAreaWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Calculate the tab bar height based on platform
  const tabBarHeight = Platform.OS === 'ios' ? 90 : 70;
  
  return (
    <View style={{ flex: 1, paddingBottom: tabBarHeight }}>
      {children}
    </View>
  );
};

// Updated animated screen components with proper bottom spacing
// const AnimatedChatScreen: React.FC<any> = (props) => {
//   const isFocused = useIsFocused();
//   return (
//     <AnimatedScreen isFocused={isFocused}>
//       <SafeAreaWrapper>
//         <ChatScreen {...props} />
//       </SafeAreaWrapper>
//     </AnimatedScreen>
//   );
// };

const AnimatedChatHistoryScreen: React.FC<any> = (props) => {
  const isFocused = useIsFocused();
  return (
    <AnimatedScreen isFocused={isFocused}>
      <SafeAreaWrapper>
        <ChatHistoryScreen {...props} />
      </SafeAreaWrapper>
    </AnimatedScreen>
  );
};

const AnimatedProfileScreen: React.FC<any> = (props) => {
  const isFocused = useIsFocused();
  return (
    <AnimatedScreen isFocused={isFocused}>
      <SafeAreaWrapper>
        <ProfileScreen {...props} />
      </SafeAreaWrapper>
    </AnimatedScreen>
  );
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="ChatHistoryTab"
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.brandPrimary,
        tabBarInactiveTintColor: COLORS.darkText.tertiary,
      }}
    >
      {/* <Tab.Screen
        name="ChatTab"
        component={AnimatedChatScreen}
        options={{
          tabBarLabel: 'Chat',
        }}
      /> */}
      
      <Tab.Screen
        name="ChatHistoryTab"
        component={AnimatedChatHistoryScreen}
        options={{
          tabBarLabel: 'Chat',
        }}
      />
      
      <Tab.Screen
        name="ProfileTab"
        component={AnimatedProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  customTabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 90 : 70,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  backgroundGradient: {
    flex: 1,
    paddingBottom: 0,
  },
  blurView: {
    flex: 1,
    overflow: 'hidden',
  },
  tabBarInner: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    position: 'relative',
  },
  tabBarButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  tabText: {
    fontSize: 12,
    marginTop: 3,
    fontWeight: '500',
  },
  tabIndicator: {
    position: 'absolute',
    top: 0,
    height: 3,
    backgroundColor: COLORS.brandPrimary,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    shadowColor: COLORS.brandPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
});
