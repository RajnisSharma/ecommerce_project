import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { TouchableOpacity, Alert } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ProductListScreen from '../screens/ProductListScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { COLORS } from '../utils/constants';

const Tab = createBottomTabNavigator();

// Wrapper component that checks auth before showing screen
function AuthWrapper({ children, navigation, isAuthenticated, screenName }) {
  if (!isAuthenticated) {
    // Show alert and navigate to auth
    Alert.alert(
      'Login Required',
      `Please login to access ${screenName}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Login', 
          onPress: () => navigation.navigate('Auth', { screen: 'Login' })
        }
      ]
    );
    // Return empty view or redirect
    return null;
  }
  return children;
}

export default function PublicTabNavigator({ navigation }) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Products':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'Cart':
              iconName = focused ? 'cart' : 'cart-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'home';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
      })}
    >
      {/* Public screens - always accessible */}
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Products" component={ProductListScreen} />
      
      {/* Protected screens - require auth */}
      <Tab.Screen 
        name="Cart" 
        component={CartScreen}
        listeners={{
          tabPress: (e) => {
            if (!isAuthenticated) {
              e.preventDefault();
              Alert.alert(
                'Login Required',
                'Please login to view your cart',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Login', 
                    onPress: () => navigation.navigate('Auth', { screen: 'Login' })
                  }
                ]
              );
            }
          },
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        listeners={{
          tabPress: (e) => {
            if (!isAuthenticated) {
              e.preventDefault();
              Alert.alert(
                'Login Required',
                'Please login to view your profile',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Login', 
                    onPress: () => navigation.navigate('Auth', { screen: 'Login' })
                  }
                ]
              );
            }
          },
        }}
      />
    </Tab.Navigator>
  );
}
