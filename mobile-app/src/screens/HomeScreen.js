import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedProducts } from '../store/slices/productSlice';
import { COLORS } from '../utils/constants';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { featuredProducts } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Welcome!</Text>
              <Text style={styles.subtitle}>Find the best products</Text>
            </View>
            {!isAuthenticated && (
              <View style={styles.authButtons}>
                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
                >
                  <Text style={styles.loginBtnText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.registerBtn}
                  onPress={() => navigation.navigate('Auth', { screen: 'Register' })}
                >
                  <Text style={styles.registerBtnText}>Register</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categories}>
            {['Electronics', 'Clothing', 'Home', 'Sports'].map((cat) => (
              <TouchableOpacity key={cat} style={styles.category}>
                <Ionicons name="grid-outline" size={24} color={COLORS.primary} />
                <Text style={styles.categoryText}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          {featuredProducts.slice(0, 4).map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.productCard}
              onPress={() => navigation.navigate('ProductDetail', { slug: product.slug })}
            >
              <Image
                source={{ uri: product.primary_image?.image || 'https://via.placeholder.com/100' }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>${product.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, backgroundColor: COLORS.primary },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 28, fontWeight: 'bold', color: COLORS.white },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  authButtons: { flexDirection: 'row', gap: 8 },
  loginBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  loginBtnText: { color: COLORS.white, fontSize: 12, fontWeight: '600' },
  registerBtn: { backgroundColor: COLORS.white, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  registerBtnText: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },
  section: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  categories: { flexDirection: 'row', justifyContent: 'space-between' },
  category: { alignItems: 'center', backgroundColor: COLORS.white, padding: 15, borderRadius: 10, width: '22%' },
  categoryText: { marginTop: 5, fontSize: 12 },
  productCard: { flexDirection: 'row', backgroundColor: COLORS.white, padding: 15, borderRadius: 10, marginBottom: 10 },
  productImage: { width: 80, height: 80, borderRadius: 8 },
  productInfo: { marginLeft: 15, justifyContent: 'center' },
  productName: { fontSize: 16, fontWeight: '600' },
  productPrice: { fontSize: 14, color: COLORS.primary, marginTop: 5 },
});
