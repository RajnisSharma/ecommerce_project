import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '../store/slices/cartSlice';
import { COLORS } from '../utils/constants';

export default function CartScreen() {
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.product?.primary_image?.image || 'https://via.placeholder.com/80' }}
        style={styles.itemImage}
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.product?.name}</Text>
        <Text style={styles.itemPrice}>${item.product?.price}</Text>
        <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Shopping Cart</Text>
      {items.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="cart-outline" size={64} color={COLORS.gray} />
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
          />
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', padding: 20 },
  list: { padding: 15 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: COLORS.gray, marginTop: 10 },
  cartItem: { flexDirection: 'row', backgroundColor: COLORS.white, padding: 15, borderRadius: 10, marginBottom: 10 },
  itemImage: { width: 80, height: 80, borderRadius: 8 },
  itemInfo: { marginLeft: 15, flex: 1 },
  itemName: { fontSize: 16, fontWeight: '600' },
  itemPrice: { fontSize: 14, color: COLORS.primary, marginTop: 4 },
  itemQuantity: { fontSize: 12, color: COLORS.gray, marginTop: 4 },
  footer: { backgroundColor: COLORS.white, padding: 20, borderTopWidth: 1, borderTopColor: COLORS.lightGray },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  totalLabel: { fontSize: 18 },
  totalValue: { fontSize: 18, fontWeight: 'bold' },
  checkoutButton: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 10, alignItems: 'center' },
  checkoutText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
});
