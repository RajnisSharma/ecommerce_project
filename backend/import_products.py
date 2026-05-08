#!/usr/bin/env python
"""
Script to import products from upload/products folder
Run with: python import_products.py
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from apps.products.models import Product, ProductImage, Category
from django.core.files import File
from django.utils.text import slugify

# Configuration
UPLOAD_DIR = r"d:\Advance_Python\ecommerce_project\upload\products"

# Product data mapping images to products
PRODUCTS_DATA = [
    # Men's Shirts
    {"name": "Golden Premium Shirt", "sku": "MEN-SHIRT-GOLD-001", "price": 49.99, "stock_quantity": 50, "category": "Men's Shirts", "image": "Golden_shirt.jpg", "featured": True, "gender": "men", "size": "M", "color": "Gold", "fabric": "Cotton", "brand": "Levi's"},
    {"name": "Black Classic Shirt", "sku": "MEN-SHIRT-BLK-001", "price": 34.99, "stock_quantity": 100, "category": "Men's Shirts", "image": "black_shirt.jpg", "gender": "men", "size": "L", "color": "Black", "fabric": "Cotton", "brand": "Levi's"},
    {"name": "Blue Casual Shirt", "sku": "MEN-SHIRT-BLU-001", "price": 29.99, "stock_quantity": 80, "category": "Men's Shirts", "image": "blue_shirt.jpg", "gender": "men", "size": "M", "color": "Blue", "fabric": "Cotton", "brand": "Zara"},
    {"name": "Blue Formal Shirt", "sku": "MEN-SHIRT-BLU-002", "price": 39.99, "stock_quantity": 60, "category": "Men's Shirts", "image": "blue_shirt1.jpg", "gender": "men", "size": "L", "color": "Blue", "fabric": "Cotton", "brand": "H&M"},
    {"name": "Gold Elegant Shirt", "sku": "MEN-SHIRT-GLD-001", "price": 44.99, "stock_quantity": 40, "category": "Men's Shirts", "image": "gold_shirt.jpg", "gender": "men", "size": "XL", "color": "Gold", "fabric": "Silk", "brand": "Calvin Klein"},
    {"name": "Gold Premium Shirt", "sku": "MEN-SHIRT-GLD-002", "price": 54.99, "stock_quantity": 30, "category": "Men's Shirts", "image": "gold_shirt1.jpg", "featured": True, "gender": "men", "size": "M", "color": "Gold", "fabric": "Silk", "brand": "Calvin Klein"},
    {"name": "Green Casual Shirt", "sku": "MEN-SHIRT-GRN-001", "price": 29.99, "stock_quantity": 70, "category": "Men's Shirts", "image": "green_shirt.jpg", "gender": "men", "size": "S", "color": "Green", "fabric": "Cotton", "brand": "Uniqlo"},
    {"name": "Green Summer Shirt", "sku": "MEN-SHIRT-GRN-002", "price": 32.99, "stock_quantity": 55, "category": "Men's Shirts", "image": "green_shirt1.jpg", "gender": "men", "size": "M", "color": "Green", "fabric": "Linen", "brand": "Uniqlo"},
    {"name": "Pink Fashion Shirt", "sku": "MEN-SHIRT-PNK-001", "price": 36.99, "stock_quantity": 45, "category": "Men's Shirts", "image": "pink_shirt.jpg", "gender": "men", "size": "M", "color": "Pink", "fabric": "Cotton", "brand": "Mango"},
    {"name": "White Classic Shirt", "sku": "MEN-SHIRT-WHT-001", "price": 31.99, "stock_quantity": 90, "category": "Men's Shirts", "image": "white_shirt.jpg", "gender": "men", "size": "L", "color": "White", "fabric": "Cotton", "brand": "Zara"},
    {"name": "White Premium Shirt", "sku": "MEN-SHIRT-WHT-002", "price": 41.99, "stock_quantity": 65, "category": "Men's Shirts", "image": "white_shirt_L5cGGTW.jpg", "gender": "men", "size": "XL", "color": "White", "fabric": "Cotton", "brand": "H&M"},
    {"name": "Wine Red Elegant Shirt", "sku": "MEN-SHIRT-RED-001", "price": 38.99, "stock_quantity": 50, "category": "Men's Shirts", "image": "wine_red_shirt.jpg", "gender": "men", "size": "M", "color": "Red", "fabric": "Cotton", "brand": "Levi's"},

    # Women's Dresses
    {"name": "Floral Fit & Flare Dress", "sku": "WOM-DRES-FLR-001", "price": 59.99, "stock_quantity": 40, "category": "Women's Dresses", "image": "women_floral_fit.jpg", "featured": True, "gender": "women", "size": "S", "color": "Floral", "fabric": "Polyester", "brand": "Zara", "pattern": "Floral", "occasion": "Party"},
    {"name": "Floral Summer Dress", "sku": "WOM-DRES-FLR-002", "price": 64.99, "stock_quantity": 35, "category": "Women's Dresses", "image": "women_floral_fit1.jpg", "featured": True, "gender": "women", "size": "M", "color": "Floral", "fabric": "Cotton", "brand": "H&M", "pattern": "Floral", "occasion": "Casual"},
    {"name": "Summer Casual Dress", "sku": "WOM-DRES-SUM-001", "price": 49.99, "stock_quantity": 60, "category": "Women's Dresses", "image": "women_summer_dress.jpg", "gender": "women", "size": "L", "color": "Yellow", "fabric": "Cotton", "brand": "Forever 21", "pattern": "Solid", "occasion": "Casual"},
    {"name": "Summer Elegant Dress", "sku": "WOM-DRES-SUM-002", "price": 54.99, "stock_quantity": 45, "category": "Women's Dresses", "image": "women_summer_dress1.jpg", "gender": "women", "size": "S", "color": "Blue", "fabric": "Polyester", "brand": "Mango", "pattern": "Solid", "occasion": "Formal"},
    {"name": "Summer Breeze Dress", "sku": "WOM-DRES-SUM-003", "price": 47.99, "stock_quantity": 55, "category": "Women's Dresses", "image": "women_summer_dress2.jpg", "gender": "women", "size": "M", "color": "Green", "fabric": "Linen", "brand": "Uniqlo", "pattern": "Solid", "occasion": "Casual"},
    {"name": "Summer Chic Dress", "sku": "WOM-DRES-SUM-004", "price": 52.99, "stock_quantity": 40, "category": "Women's Dresses", "image": "women_summer_dress3.jpg", "gender": "women", "size": "L", "color": "Pink", "fabric": "Cotton", "brand": "Forever 21", "pattern": "Solid", "occasion": "Casual"},
    {"name": "Summer Floral Dress", "sku": "WOM-DRES-SUM-005", "price": 56.99, "stock_quantity": 38, "category": "Women's Dresses", "image": "women_summer_dress4.jpg", "gender": "women", "size": "S", "color": "Floral", "fabric": "Polyester", "brand": "Zara", "pattern": "Floral", "occasion": "Party"},
    {"name": "Summer Party Dress", "sku": "WOM-DRES-SUM-006", "price": 61.99, "stock_quantity": 30, "category": "Women's Dresses", "image": "women_summer_dress5.jpg", "gender": "women", "size": "M", "color": "Purple", "fabric": "Satin", "brand": "Calvin Klein", "pattern": "Solid", "occasion": "Party"},
    {"name": "Summer Evening Dress", "sku": "WOM-DRES-SUM-007", "price": 58.99, "stock_quantity": 42, "category": "Women's Dresses", "image": "women_summer_dress_5.jpg", "gender": "women", "size": "L", "color": "Navy", "fabric": "Silk", "brand": "Mango", "pattern": "Solid", "occasion": "Wedding"},
    {"name": "Western Style Dress", "sku": "WOM-DRES-WST-001", "price": 69.99, "stock_quantity": 25, "category": "Women's Dresses", "image": "women_westren_dress1.jpg", "featured": True, "gender": "women", "size": "M", "color": "Blue", "fabric": "Denim", "brand": "Levi's", "pattern": "Solid", "occasion": "Casual"},
    {"name": "Western Chic Dress", "sku": "WOM-DRES-WST-002", "price": 74.99, "stock_quantity": 20, "category": "Women's Dresses", "image": "women_westren_dress2.jpg", "featured": True, "gender": "women", "size": "S", "color": "Black", "fabric": "Denim", "brand": "Levi's", "pattern": "Solid", "occasion": "Party"},
]


def get_or_create_category(name):
    """Get or create a category with slug"""
    slug = slugify(name)
    category, created = Category.objects.get_or_create(
        slug=slug,
        defaults={
            'name': name,
            'description': f'Collection of {name}',
            'is_active': True
        }
    )
    if created:
        print(f"  Created category: {name}")
    return category


def import_products():
    """Import all products from the upload directory"""
    print("=" * 60)
    print("Starting Product Import")
    print("=" * 60)
    
    created_count = 0
    skipped_count = 0
    
    for product_data in PRODUCTS_DATA:
        image_filename = product_data.pop('image')
        category_name = product_data.pop('category')
        is_featured = product_data.pop('featured', False)
        
        # Check if image exists
        image_path = os.path.join(UPLOAD_DIR, image_filename)
        if not os.path.exists(image_path):
            print(f"⚠ Skipped: {product_data['name']} - Image not found: {image_filename}")
            skipped_count += 1
            continue
        
        # Check if product already exists
        if Product.objects.filter(sku=product_data['sku']).exists():
            print(f"⚠ Skipped: {product_data['name']} - SKU already exists")
            skipped_count += 1
            continue
        
        # Get or create category
        category = get_or_create_category(category_name)
        
        # Create product
        product = Product.objects.create(
            **product_data,
            category=category,
            slug=slugify(product_data['name']),
            is_featured=is_featured,
            description=f"High quality {product_data['name']}. Perfect for any occasion.",
            short_description=f"Premium {category_name.lower()} with excellent comfort and style."
        )
        
        # Create product image
        with open(image_path, 'rb') as f:
            ProductImage.objects.create(
                product=product,
                image=File(f, name=image_filename),
                is_primary=True,
                alt_text=product_data['name']
            )
        
        print(f"✓ Created: {product.name} (${product.price}) - Category: {category.name}")
        created_count += 1
    
    print("=" * 60)
    print(f"Import Complete!")
    print(f"  Created: {created_count} products")
    print(f"  Skipped: {skipped_count} products")
    print("=" * 60)


if __name__ == '__main__':
    import_products()
