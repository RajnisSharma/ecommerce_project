import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import AuthNavigator from './AuthNavigator';
import PublicTabNavigator from './PublicTabNavigator';
import MainTabNavigator from './MainTabNavigator';
import ProductDetailScreen from '../screens/ProductDetailScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Always show public tabs (Home/Products accessible without login) */}
      <Stack.Screen name="Main" component={PublicTabNavigator} />

      {/* Product Detail - accessible to all */}
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          headerShown: true,
          headerTitle: 'Product Details',
          headerBackTitle: 'Back',
        }}
      />

      {/* Auth screens accessible when needed */}
      <Stack.Screen
        name="Auth"
        component={AuthNavigator}
        options={{
          presentation: 'modal',
          animationEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
}
