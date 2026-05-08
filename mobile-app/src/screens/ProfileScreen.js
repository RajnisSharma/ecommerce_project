import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, logout } from '../store/slices/authSlice';
import { COLORS } from '../utils/constants';

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    // Navigate to Home after logout
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={COLORS.primary} />
        </View>
        <Text style={styles.name}>{user?.first_name} {user?.last_name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="list-outline" size={24} color={COLORS.gray} />
          <Text style={styles.menuText}>My Orders</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="heart-outline" size={24} color={COLORS.gray} />
          <Text style={styles.menuText}>Wishlist</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="location-outline" size={24} color={COLORS.gray} />
          <Text style={styles.menuText}>Addresses</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: COLORS.primary, padding: 30, alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center' },
  name: { fontSize: 20, fontWeight: 'bold', color: COLORS.white, marginTop: 15 },
  email: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 5 },
  menu: { backgroundColor: COLORS.white, marginTop: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  menuText: { flex: 1, marginLeft: 15, fontSize: 16 },
  logoutButton: { backgroundColor: COLORS.white, marginTop: 20, padding: 20, alignItems: 'center' },
  logoutText: { color: COLORS.danger, fontSize: 16, fontWeight: '600' },
});
