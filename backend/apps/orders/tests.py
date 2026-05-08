from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from apps.orders.models import CartItem, Order
from apps.products.models import Category, Product


class CartAndOrderWorkflowTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            email='customer@example.com',
            password='password123',
            first_name='Customer',
        )
        self.client.force_authenticate(self.user)
        self.category = Category.objects.create(name='Shirts', slug='shirts')
        self.product = Product.objects.create(
            name='Blue Shirt',
            slug='blue-shirt',
            sku='BLUE-001',
            description='A blue shirt',
            category=self.category,
            price=Decimal('25.00'),
            stock_quantity=3,
            is_active=True,
        )

    def test_add_to_cart_returns_full_cart(self):
        response = self.client.post('/api/orders/cart/items/', {
            'product_id': self.product.id,
            'quantity': 2,
        }, format='json')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['item_count'], 2)
        self.assertEqual(len(response.data['items']), 1)

    def test_add_to_cart_rejects_stock_overflow(self):
        response = self.client.post('/api/orders/cart/items/', {
            'product_id': self.product.id,
            'quantity': 4,
        }, format='json')

        self.assertEqual(response.status_code, 400)

    def test_create_order_calculates_totals_and_reduces_stock(self):
        self.client.post('/api/orders/cart/items/', {
            'product_id': self.product.id,
            'quantity': 2,
        }, format='json')

        response = self.client.post('/api/orders/', {
            'shipping_name': 'Customer User',
            'shipping_phone': '555-0100',
            'shipping_address': '123 Market Street',
            'shipping_city': 'Springfield',
            'shipping_state': 'CA',
            'shipping_postal_code': '90210',
            'shipping_country': 'US',
            'payment_method': 'card',
        }, format='json')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Order.objects.count(), 1)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity, 1)
        self.assertFalse(CartItem.objects.exists())
        self.assertEqual(Decimal(response.data['subtotal']), Decimal('50.00'))
        self.assertEqual(Decimal(response.data['shipping_cost']), Decimal('10.00'))
        self.assertEqual(Decimal(response.data['tax_amount']), Decimal('4.00'))
        self.assertEqual(Decimal(response.data['total_amount']), Decimal('64.00'))
