import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { productsAPI, ordersAPI } from '../services/api';
import { COLORS } from '../utils/constants';

export default function ProductDetailScreen({ navigation, route }) {
  const { slug } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getProduct(slug);
      setProduct(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please login to add items to cart',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('Auth', { screen: 'Login' }) }
        ]
      );
      return;
    }

    setAddingToCart(true);
    try {
      await ordersAPI.addToCart({
        product_id: product.id,
        quantity: 1,
      });
      Alert.alert('Success', 'Added to cart!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text>Product not found</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backLink}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{product.name}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Product Image */}
        <Image
          source={{ uri: product.primary_image?.image || 'https://via.placeholder.com/400' }}
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.productName}>{product.name}</Text>
            {product.discount_percentage > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{product.discount_percentage}%</Text>
              </View>
            )}
          </View>

          <Text style={styles.category}>{product.category_name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price}</Text>
            {product.compare_at_price && (
              <Text style={styles.comparePrice}>${product.compare_at_price}</Text>
            )}
          </View>

          {/* Stock Status */}
          <View style={styles.stockRow}>
            <Ionicons
              name={product.stock_quantity > 0 ? "checkmark-circle" : "close-circle"}
              size={20}
              color={product.stock_quantity > 0 ? '#22C55E' : '#EF4444'}
            />
            <Text style={[
              styles.stockText,
              product.stock_quantity > 0 ? styles.inStock : styles.outOfStock
            ]}>
              {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity})` : 'Out of Stock'}
            </Text>
          </View>

          {/* Tags */}
          {(product.fast_delivery || product.is_featured) && (
            <View style={styles.tagsRow}>
              {product.fast_delivery && (
                <View style={styles.tag}>
                  <Ionicons name="flash" size={12} color="#22C55E" />
                  <Text style={styles.tagText}>Fast Delivery</Text>
                </View>
              )}
              {product.is_featured && (
                <View style={[styles.tag, styles.featuredTag]}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={[styles.tagText, styles.featuredTagText]}>Featured</Text>
                </View>
              )}
            </View>
          )}

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Specifications */}
          {product.brand && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Specifications</Text>
              <View style={styles.specsGrid}>
                {product.brand && (
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Brand</Text>
                    <Text style={styles.specValue}>{product.brand}</Text>
                  </View>
                )}
                {product.gender && (
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Gender</Text>
                    <Text style={styles.specValue}>{product.gender}</Text>
                  </View>
                )}
                {product.size && (
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Size</Text>
                    <Text style={styles.specValue}>{product.size}</Text>
                  </View>
                )}
                {product.color && (
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Color</Text>
                    <Text style={styles.specValue}>{product.color}</Text>
                  </View>
                )}
                {product.fabric && (
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Fabric</Text>
                    <Text style={styles.specValue}>{product.fabric}</Text>
                  </View>
                )}
                {product.pattern && (
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Pattern</Text>
                    <Text style={styles.specValue}>{product.pattern}</Text>
                  </View>
                )}
                {product.fit && (
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Fit</Text>
                    <Text style={styles.specValue}>{product.fit}</Text>
                  </View>
                )}
                {product.occasion && (
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Occasion</Text>
                    <Text style={styles.specValue}>{product.occasion}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* SKU */}
          <Text style={styles.sku}>SKU: {product.sku}</Text>
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.addToCartBtn,
            (product.stock_quantity === 0 || addingToCart) && styles.addToCartBtnDisabled
          ]}
          onPress={handleAddToCart}
          disabled={product.stock_quantity === 0 || addingToCart}
        >
          {addingToCart ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Ionicons name="cart-outline" size={24} color={COLORS.white} />
              <Text style={styles.addToCartText}>
                {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  backLink: { color: COLORS.primary, fontSize: 16 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.white,
  },
  backBtn: { padding: 8 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '600', textAlign: 'center', marginHorizontal: 16 },
  placeholder: { width: 40 },

  productImage: { width: '100%', height: 350 },

  infoContainer: { padding: 20, backgroundColor: COLORS.white, marginTop: 8 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  productName: { flex: 1, fontSize: 22, fontWeight: 'bold', color: '#333' },
  discountBadge: {
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  discountText: { color: 'white', fontSize: 12, fontWeight: 'bold' },

  category: { fontSize: 14, color: COLORS.gray, marginTop: 4, textTransform: 'capitalize' },

  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 12 },
  price: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary },
  comparePrice: { fontSize: 16, color: '#999', textDecorationLine: 'line-through' },

  stockRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 6 },
  stockText: { fontSize: 14 },
  inStock: { color: '#22C55E' },
  outOfStock: { color: '#EF4444' },

  tagsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  tagText: { fontSize: 12, color: '#22C55E' },
  featuredTag: { backgroundColor: '#FEF3C7' },
  featuredTagText: { color: '#F59E0B' },

  section: { marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  description: { fontSize: 14, color: '#666', lineHeight: 22 },

  specsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  specItem: { width: '45%' },
  specLabel: { fontSize: 12, color: COLORS.gray, marginBottom: 2 },
  specValue: { fontSize: 14, color: '#333', fontWeight: '500', textTransform: 'capitalize' },

  sku: { fontSize: 12, color: '#999', marginTop: 20 },

  footer: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
  },
  addToCartBtnDisabled: { backgroundColor: '#ccc' },
  addToCartText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
});
