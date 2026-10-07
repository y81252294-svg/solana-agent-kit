import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import COLORS from '../assets/colors';

type ThemedTabIconProps = {
  focused: boolean;
  iconType: 'home' | 'search' | 'profile';
  size: number;
  style?: object;
};

// SVG path data for each icon type
const iconPaths = {
  home: {
    background: "M4.36355 15.2834C3.87247 15.4222 3.32367 15.2711 2.97588 14.8538C2.50446 14.2881 2.58089 13.4473 3.1466 12.9759L12.586 5.10971C14.5639 3.46148 17.4368 3.46148 19.4147 5.1097L28.8541 12.9759C29.4198 13.4473 29.4962 14.2881 29.0248 14.8538C28.6769 15.2712 28.1279 15.4222 27.6367 15.2833L25.9508 23.7129C25.4522 26.2059 23.2633 28.0004 20.721 28.0004H11.2793C8.73695 28.0004 6.54805 26.2059 6.04945 23.7129L4.36355 15.2834Z",
    foreground: "M20.0002 18.6669C19.3335 20.0003 18.2093 21.3336 16.0001 21.3336C13.7909 21.3336 12.6667 20.0003 12.0001 18.6669"
  },
  search: {
    background: "M24.0362 22.6956L28.6906 27.35C29.1302 27.7896 29.1302 28.5104 28.6906 28.95C28.251 29.3896 27.5302 29.3896 27.0906 28.95L22.4362 24.2956C20.5344 25.8344 18.13 26.6667 15.5556 26.6667C9.84 26.6667 5.33337 22.16 5.33337 16.4444C5.33337 10.7289 9.84 6.22223 15.5556 6.22223C21.2711 6.22223 25.7778 10.7289 25.7778 16.4444C25.7778 19.0189 24.9456 21.4233 23.4067 23.3251L24.0362 22.6956Z",
    foreground: ""
  },
  profile: {
    background: "M15.9999 26.6667C9.55548 26.6667 4.33325 21.4444 4.33325 15C4.33325 8.55558 9.55548 3.33334 15.9999 3.33334C22.4443 3.33334 27.6666 8.55558 27.6666 15C27.6666 21.4444 22.4443 26.6667 15.9999 26.6667Z",
    foreground: "M15.9999 17.6667C13.4221 17.6667 11.3333 15.5779 11.3333 13C11.3333 10.4222 13.4221 8.33334 15.9999 8.33334C18.5777 8.33334 20.6666 10.4222 20.6666 13C20.6666 15.5779 18.5777 17.6667 15.9999 17.6667ZM8.94214 23.5556C9.59992 21.5222 12.5888 20 15.9999 20C19.411 20 22.3999 21.5222 23.0577 23.5556"
  }
};

function ThemedTabIcon({
  focused,
  iconType,
  size,
  style,
}: ThemedTabIconProps) {
  const animation = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: focused ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [focused, animation]);

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  // Icon colors
  const activeBackgroundColor = COLORS.brandPrimary;
  const inactiveBackgroundColor = focused ? COLORS.darkBg.tertiary : COLORS.darkText.tertiary;
  const foregroundColor = COLORS.white;

  return (
    <Animated.View style={[focused ? style : null, { transform: [{ scale }] }]}>
      <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <Path
          d={iconPaths[iconType].background}
          fill={focused ? activeBackgroundColor : inactiveBackgroundColor}
        />
        {iconPaths[iconType].foreground && (
          <Path
            d={iconPaths[iconType].foreground}
            stroke={foregroundColor}
            strokeWidth="2.6667"
            strokeLinecap="round"
          />
        )}
      </Svg>
    </Animated.View>
  );
}

export default ThemedTabIcon; 