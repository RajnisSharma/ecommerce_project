import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import { COLORS } from '../utils/constants';

const GENDER_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Men', value: 'men' },
  { label: 'Women', value: 'women' },
  { label: 'Kids', value: 'kids' },
  { label: 'Unisex', value: 'unisex' },
];

const SORT_OPTIONS = [
  { label: 'Newest', value: '-created_at' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
  { label: 'Name A-Z', value: 'name' },
];

export default function ProductListScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.products);

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    category_slug: route.params?.categorySlug || '',
    gender: '',
    min_price: '',
    max_price: '',
    in_stock: false,
    is_featured: false,
    fast_delivery: false,
    discount_percentage__gte: '',
    min_rating: '',
    brand: '',
    color: '',
    size: '',
    fabric: '',
    pattern: '',
    fit: '',
    occasion: '',
    ordering: '-created_at',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  useEffect(() => {
    applyFilters();
  }, []);

  useEffect(() => {
    // Count active filters
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && key !== 'search' && key !== 'ordering') {
        count++;
      }
    });
    setActiveFiltersCount(count);
  }, [filters]);

  const applyFilters = useCallback(() => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        params[key] = value;
      }
    });
    dispatch(fetchProducts(params));
    setShowFilters(false);
  }, [filters, dispatch]);

  const clearFilters = () => {
    setFilters({
      search: '',
      category_slug: '',
      gender: '',
      min_price: '',
      max_price: '',
      in_stock: false,
      is_featured: false,
      fast_delivery: false,
      discount_percentage__gte: '',
      min_rating: '',
      brand: '',
      color: '',
      size: '',
      fabric: '',
      pattern: '',
      fit: '',
      occasion: '',
      ordering: '-created_at',
    });
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    applyFilters();
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { slug: item.slug })}
    >
      <Image
        source={{ uri: item.primary_image?.image || 'https://via.placeholder.com/150' }}
        style={styles.productImage}
      />
      {item.discount_percentage > 0 && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-{item.discount_percentage}%</Text>
        </View>
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category_name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>${item.price}</Text>
          {item.compare_at_price && (
            <Text style={styles.comparePrice}>${item.compare_at_price}</Text>
          )}
        </View>
        <View style={styles.tagsRow}>
          {item.fast_delivery && (
            <Text style={styles.tag}>Fast</Text>
          )}
          {item.stock_quantity === 0 && (
            <Text style={styles.outOfStockTag}>Out of Stock</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const FilterSection = ({ title, children }) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterSectionTitle}>{title}</Text>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={filters.search}
          onChangeText={(text) => updateFilter('search', text)}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Ionicons name="search" size={20} color={COLORS.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilters(true)}>
          <Ionicons name="options-outline" size={20} color={COLORS.primary} />
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Sort Bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortBar}>
        {SORT_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.sortChip,
              filters.ordering === option.value && styles.sortChipActive
            ]}
            onPress={() => {
              updateFilter('ordering', option.value);
              setTimeout(applyFilters, 100);
            }}
          >
            <Text style={[
              styles.sortChipText,
              filters.ordering === option.value && styles.sortChipTextActive
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products List */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        numColumns={2}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="basket-outline" size={64} color={COLORS.gray} />
            <Text style={styles.emptyText}>No products found</Text>
            <TouchableOpacity style={styles.clearBtn} onPress={clearFilters}>
              <Text style={styles.clearBtnText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilters(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={clearFilters}>
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color={COLORS.dark} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Gender Filter */}
            <FilterSection title="Gender">
              <View style={styles.chipGroup}>
                {GENDER_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.chip,
                      filters.gender === option.value && styles.chipActive
                    ]}
                    onPress={() => updateFilter('gender', option.value)}
                  >
                    <Text style={[
                      styles.chipText,
                      filters.gender === option.value && styles.chipTextActive
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </FilterSection>

            {/* Price Range */}
            <FilterSection title="Price Range">
              <View style={styles.priceInputs}>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Min"
                  value={filters.min_price}
                  onChangeText={(text) => updateFilter('min_price', text)}
                  keyboardType="numeric"
                />
                <Text style={styles.priceSeparator}>-</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Max"
                  value={filters.max_price}
                  onChangeText={(text) => updateFilter('max_price', text)}
                  keyboardType="numeric"
                />
              </View>
            </FilterSection>

            {/* Quick Filters */}
            <FilterSection title="Quick Filters">
              <View style={styles.toggleGroup}>
                {[
                  { key: 'in_stock', label: 'In Stock' },
                  { key: 'is_featured', label: 'Featured' },
                  { key: 'fast_delivery', label: 'Fast Delivery' },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    style={[
                      styles.toggleBtn,
                      filters[item.key] && styles.toggleBtnActive
                    ]}
                    onPress={() => updateFilter(item.key, !filters[item.key])}
                  >
                    <Ionicons
                      name={filters[item.key] ? "checkbox" : "square-outline"}
                      size={20}
                      color={filters[item.key] ? COLORS.primary : COLORS.gray}
                    />
                    <Text style={[
                      styles.toggleText,
                      filters[item.key] && styles.toggleTextActive
                    ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </FilterSection>

            {/* Discount */}
            <FilterSection title="Minimum Discount">
              <View style={styles.chipGroup}>
                {['10', '20', '30', '50'].map((discount) => (
                  <TouchableOpacity
                    key={discount}
                    style={[
                      styles.chip,
                      filters.discount_percentage__gte === discount && styles.chipActive
                    ]}
                    onPress={() => updateFilter('discount_percentage__gte',
                      filters.discount_percentage__gte === discount ? '' : discount
                    )}
                  >
                    <Text style={[
                      styles.chipText,
                      filters.discount_percentage__gte === discount && styles.chipTextActive
                    ]}>
                      {discount}%+
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </FilterSection>

            {/* Rating */}
            <FilterSection title="Minimum Rating">
              <View style={styles.ratingGroup}>
                {[4, 3, 2, 1].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingBtn,
                      filters.min_rating === rating.toString() && styles.ratingBtnActive
                    ]}
                    onPress={() => updateFilter('min_rating',
                      filters.min_rating === rating.toString() ? '' : rating.toString()
                    )}
                  >
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{rating}+</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </FilterSection>

            {/* Brand */}
            <FilterSection title="Brand">
              <TextInput
                style={styles.textInput}
                placeholder="Enter brand name"
                value={filters.brand}
                onChangeText={(text) => updateFilter('brand', text)}
              />
            </FilterSection>

            {/* Color */}
            <FilterSection title="Color">
              <TextInput
                style={styles.textInput}
                placeholder="Enter color"
                value={filters.color}
                onChangeText={(text) => updateFilter('color', text)}
              />
            </FilterSection>

            {/* Size */}
            <FilterSection title="Size">
              <TextInput
                style={styles.textInput}
                placeholder="Enter size (S, M, L, XL, etc.)"
                value={filters.size}
                onChangeText={(text) => updateFilter('size', text)}
              />
            </FilterSection>

            {/* Fabric */}
            <FilterSection title="Fabric">
              <TextInput
                style={styles.textInput}
                placeholder="Enter fabric type"
                value={filters.fabric}
                onChangeText={(text) => updateFilter('fabric', text)}
              />
            </FilterSection>

            {/* Pattern */}
            <FilterSection title="Pattern">
              <TextInput
                style={styles.textInput}
                placeholder="Enter pattern"
                value={filters.pattern}
                onChangeText={(text) => updateFilter('pattern', text)}
              />
            </FilterSection>

            {/* Fit */}
            <FilterSection title="Fit">
              <TextInput
                style={styles.textInput}
                placeholder="Enter fit type"
                value={filters.fit}
                onChangeText={(text) => updateFilter('fit', text)}
              />
            </FilterSection>

            {/* Occasion */}
            <FilterSection title="Occasion">
              <TextInput
                style={styles.textInput}
                placeholder="Enter occasion"
                value={filters.occasion}
                onChangeText={(text) => updateFilter('occasion', text)}
              />
            </FilterSection>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.applyBtn} onPress={applyFilters}>
              <Text style={styles.applyBtnText}>
                Apply Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  // Search Bar
  searchBar: {
    flexDirection: 'row',
    padding: 10,
    gap: 8,
    backgroundColor: COLORS.white,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  searchBtn: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  filterBtn: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Sort Bar
  sortBar: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingBottom: 10,
    maxHeight: 50,
  },
  sortChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sortChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sortChipText: {
    fontSize: 12,
    color: '#666',
  },
  sortChipTextActive: {
    color: COLORS.white,
  },

  // Products
  list: { padding: 10 },
  productCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    margin: 5,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: { width: '100%', height: 150, resizeMode: 'cover' },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'red',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productInfo: { padding: 12 },
  productName: { fontSize: 14, fontWeight: '600', color: '#333' },
  productCategory: { fontSize: 12, color: COLORS.gray, marginTop: 4 },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  comparePrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  tag: {
    fontSize: 10,
    color: '#22C55E',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  outOfStockTag: {
    fontSize: 10,
    color: '#EF4444',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 16,
  },
  clearBtn: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  clearBtnText: {
    color: COLORS.white,
    fontWeight: '600',
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  clearAllText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalFooter: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  applyBtn: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Filter Sections
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },

  // Chips
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 14,
    color: '#666',
  },
  chipTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },

  // Price Inputs
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  priceSeparator: {
    fontSize: 16,
    color: '#666',
  },

  // Toggle Group
  toggleGroup: {
    gap: 12,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  toggleBtnActive: {
    backgroundColor: '#EEF2FF',
  },
  toggleText: {
    fontSize: 14,
    color: '#666',
  },
  toggleTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Rating
  ratingGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  ratingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  ratingBtnActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
  },

  // Text Input
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: COLORS.white,
  },
});
