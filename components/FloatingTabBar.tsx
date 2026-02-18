
import React from 'react';
import { useRouter, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BlurView } from 'expo-blur';
import { Href } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';

interface TabBarItem {
  route: Href;
  label: string;
  ios_icon_name: string;
  android_material_icon_name: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = Dimensions.get('window').width - 48,
  borderRadius = 28,
  bottomMargin = 24,
}: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabPress = (route: Href) => {
    router.push(route);
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={[styles.container, { width: containerWidth, borderRadius, marginBottom: bottomMargin }]}>
        <BlurView intensity={80} tint="dark" style={[styles.blurContainer, { borderRadius }]}>
          <View style={styles.tabBar}>
            {tabs.map((tab, index) => {
              const isActive = pathname === tab.route || pathname.startsWith(tab.route as string);
              const activeColor = colors.primary;
              const inactiveColor = colors.textSecondary;
              const tabColor = isActive ? activeColor : inactiveColor;

              return (
                <React.Fragment key={tab.route as string}>
                  <TouchableOpacity
                    style={styles.tab}
                    onPress={() => handleTabPress(tab.route)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
                      <IconSymbol
                        ios_icon_name={tab.ios_icon_name}
                        android_material_icon_name={tab.android_material_icon_name}
                        size={24}
                        color={tabColor}
                      />
                    </View>
                    <Text style={[styles.label, { color: tabColor }]}>{tab.label}</Text>
                  </TouchableOpacity>
                </React.Fragment>
              );
            })}
          </View>
        </BlurView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  container: {
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  blurContainer: {
    overflow: 'hidden',
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.5)',
  },
  tabBar: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    marginBottom: 4,
    padding: 6,
    borderRadius: 12,
  },
  iconContainerActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
