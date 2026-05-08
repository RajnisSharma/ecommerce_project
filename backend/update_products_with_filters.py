#!/usr/bin/env python
"""
Script to update existing products with filter field values
Run with: python update_products_with_filters.py
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from apps.products.models import Product

# Update Men's Shirts with gender='men'
men_products = [
    {"sku": "MEN-SHIRT-GOLD-001", "gender": "men", "size": "M", "color": "Gold", "fabric": "Cotton", "brand": "Levi's"},
    {"sku": "MEN-SHIRT-BLK-001", "gender": "men", "size": "L", "color": "Black", "fabric": "Cotton", "brand": "Levi's"},
    {"sku": "MEN-SHIRT-BLU-001", "gender": "men", "size": "M", "color": "Blue", "fabric": "Cotton", "brand": "Zara"},
    {"sku": "MEN-SHIRT-BLU-002", "gender": "men", "size": "L", "color": "Blue", "fabric": "Cotton", "brand": "H&M"},
    {"sku": "MEN-SHIRT-GLD-001", "gender": "men", "size": "XL", "color": "Gold", "fabric": "Silk", "brand": "Calvin Klein"},
    {"sku": "MEN-SHIRT-GLD-002", "gender": "men", "size": "M", "color": "Gold", "fabric": "Silk", "brand": "Calvin Klein"},
    {"sku": "MEN-SHIRT-GRN-001", "gender": "men", "size": "S", "color": "Green", "fabric": "Cotton", "brand": "Uniqlo"},
    {"sku": "MEN-SHIRT-GRN-002", "gender": "men", "size": "M", "color": "Green", "fabric": "Linen", "brand": "Uniqlo"},
    {"sku": "MEN-SHIRT-PNK-001", "gender": "men", "size": "M", "color": "Pink", "fabric": "Cotton", "brand": "Mango"},
    {"sku": "MEN-SHIRT-WHT-001", "gender": "men", "size": "L", "color": "White", "fabric": "Cotton", "brand": "Zara"},
    {"sku": "MEN-SHIRT-WHT-002", "gender": "men", "size": "XL", "color": "White", "fabric": "Cotton", "brand": "H&M"},
    {"sku": "MEN-SHIRT-RED-001", "gender": "men", "size": "M", "color": "Red", "fabric": "Cotton", "brand": "Levi's"},
]

# Update Women's Dresses with gender='women'
women_products = [
    {"sku": "WOM-DRES-FLR-001", "gender": "women", "size": "S", "color": "Floral", "fabric": "Polyester", "brand": "Zara", "pattern": "Floral", "occasion": "Party"},
    {"sku": "WOM-DRES-FLR-002", "gender": "women", "size": "M", "color": "Floral", "fabric": "Cotton", "brand": "H&M", "pattern": "Floral", "occasion": "Casual"},
    {"sku": "WOM-DRES-SUM-001", "gender": "women", "size": "L", "color": "Yellow", "fabric": "Cotton", "brand": "Forever 21", "pattern": "Solid", "occasion": "Casual"},
    {"sku": "WOM-DRES-SUM-002", "gender": "women", "size": "S", "color": "Blue", "fabric": "Polyester", "brand": "Mango", "pattern": "Solid", "occasion": "Formal"},
    {"sku": "WOM-DRES-SUM-003", "gender": "women", "size": "M", "color": "Green", "fabric": "Linen", "brand": "Uniqlo", "pattern": "Solid", "occasion": "Casual"},
    {"sku": "WOM-DRES-SUM-004", "gender": "women", "size": "L", "color": "Pink", "fabric": "Cotton", "brand": "Forever 21", "pattern": "Solid", "occasion": "Casual"},
    {"sku": "WOM-DRES-SUM-005", "gender": "women", "size": "S", "color": "Floral", "fabric": "Polyester", "brand": "Zara", "pattern": "Floral", "occasion": "Party"},
    {"sku": "WOM-DRES-SUM-006", "gender": "women", "size": "M", "color": "Purple", "fabric": "Satin", "brand": "Calvin Klein", "pattern": "Solid", "occasion": "Party"},
    {"sku": "WOM-DRES-SUM-007", "gender": "women", "size": "L", "color": "Navy", "fabric": "Silk", "brand": "Mango", "pattern": "Solid", "occasion": "Wedding"},
    {"sku": "WOM-DRES-WST-001", "gender": "women", "size": "M", "color": "Blue", "fabric": "Denim", "brand": "Levi's", "pattern": "Solid", "occasion": "Casual"},
    {"sku": "WOM-DRES-WST-002", "gender": "women", "size": "S", "color": "Black", "fabric": "Denim", "brand": "Levi's", "pattern": "Solid", "occasion": "Party"},
]

def update_products():
    print("=" * 60)
    print("Updating Products with Filter Fields")
    print("=" * 60)
    
    updated_count = 0
    not_found_count = 0
    
    # Update men's products
    print("\n--- Updating Men's Products ---")
    for data in men_products:
        try:
            product = Product.objects.get(sku=data['sku'])
            for key, value in data.items():
                if key != 'sku':
                    setattr(product, key, value)
            product.save()
            print(f"✓ Updated: {product.name}")
            updated_count += 1
        except Product.DoesNotExist:
            print(f"⚠ Not found: {data['sku']}")
            not_found_count += 1
    
    # Update women's products
    print("\n--- Updating Women's Products ---")
    for data in women_products:
        try:
            product = Product.objects.get(sku=data['sku'])
            for key, value in data.items():
                if key != 'sku':
                    setattr(product, key, value)
            product.save()
            print(f"✓ Updated: {product.name}")
            updated_count += 1
        except Product.DoesNotExist:
            print(f"⚠ Not found: {data['sku']}")
            not_found_count += 1
    
    print("\n" + "=" * 60)
    print(f"Update Complete!")
    print(f"  Updated: {updated_count} products")
    print(f"  Not found: {not_found_count} products")
    print("=" * 60)

if __name__ == '__main__':
    update_products()
