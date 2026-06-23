import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen        from '../screens/LoginScreen';
import HomeScreen         from '../screens/HomeScreen';
import TrackingScreen     from '../screens/TrackingScreen';
import WalletScreen       from '../screens/WalletScreen';
import HistoryScreen      from '../screens/HistoryScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import ProfileScreen      from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

import { colors } from '../theme';

const Stack = createStackNavigator();
const Tab   = createBottomTabNavigator();

const TAB_ICONS = {
  Home:         { active: '🏠', inactive: '🏠' },
  Tracking:     { active: '📍', inactive: '📍' },
  Wallet:       { active: '💳', inactive: '💳' },
  History:      { active: '📋', inactive: '📋' },
  Profile:      { active: '👤', inactive: '👤' },
};

function TabIcon({ name, focused }) {
  const icons = TAB_ICONS[name] || { active: '●', inactive: '○' };
  return (
    <View style={[tabStyles.iconWrap, focused && tabStyles.iconWrapActive]}>
      <Text style={{ fontSize: 20 }}>{focused ? icons.active : icons.inactive}</Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarLabel: ({ focused, children }) => (
          <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>{children}</Text>
        ),
        tabBarStyle: tabStyles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
      })}
    >
      <Tab.Screen name="Home"     component={HomeScreen}    options={{ title: 'Home' }} />
      <Tab.Screen name="Tracking" component={TrackingScreen} options={{ title: 'Track' }} />
      <Tab.Screen name="Wallet"   component={WalletScreen}  options={{ title: 'Wallet' }} />
      <Tab.Screen name="History"  component={HistoryScreen} options={{ title: 'History' }} />
      <Tab.Screen name="Profile"  component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <Stack.Screen name="Login"        component={LoginScreen} />
        <Stack.Screen name="Main"         component={MainTabs} />
        <Stack.Screen name="Subscription" component={SubscriptionScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const tabStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    height: 64,
    paddingBottom: 8,
    paddingTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 10,
  },
  iconWrap: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 18 },
  iconWrapActive: { backgroundColor: '#e8f4fd' },
  label: { fontSize: 10, fontWeight: '500', color: colors.textLight },
  labelActive: { color: colors.primary, fontWeight: '700' },
});
