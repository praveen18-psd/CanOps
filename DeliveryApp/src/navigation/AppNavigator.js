import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { colors } from '../theme';

import LoginScreen        from '../screens/LoginScreen';
import DeliveryListScreen from '../screens/DeliveryListScreen';
import DeliveryDetailScreen from '../screens/DeliveryDetailScreen';
import RouteMapScreen     from '../screens/RouteMapScreen';
import FailedDeliveryScreen from '../screens/FailedDeliveryScreen';
import CashCollectionScreen from '../screens/CashCollectionScreen';
import ShiftSummaryScreen from '../screens/ShiftSummaryScreen';

const Stack = createStackNavigator();
const Tab   = createBottomTabNavigator();

function TabIcon({ emoji, label, focused }) {
  return (
    <View style={[ti.wrap, focused && ti.wrapActive]}>
      <Text style={ti.emoji}>{emoji}</Text>
      <Text style={[ti.label, focused && ti.labelActive]}>{label}</Text>
    </View>
  );
}

const ti = StyleSheet.create({
  wrap:       { alignItems: 'center', paddingTop: 6, paddingBottom: 2, paddingHorizontal: 10, borderRadius: 10 },
  wrapActive: { backgroundColor: colors.primaryLight },
  emoji:      { fontSize: 20 },
  label:      { fontSize: 10, fontWeight: '600', color: colors.textMuted, marginTop: 2 },
  labelActive:{ color: colors.primary },
});

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 4,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="DeliveryList"
        component={DeliveryListScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🚴" label="Deliveries" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="RouteMap"
        component={RouteMapScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🗺" label="Route" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="CashCollection"
        component={CashCollectionScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="💰" label="Cash" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ShiftSummary"
        component={ShiftSummaryScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="📋" label="Summary" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login"          component={LoginScreen} />
        <Stack.Screen name="Main"           component={MainTabs} />
        <Stack.Screen name="DeliveryDetail" component={DeliveryDetailScreen} />
        <Stack.Screen name="FailedDelivery" component={FailedDeliveryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
