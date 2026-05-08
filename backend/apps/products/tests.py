from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from apps.products.models import Category, Product


class WishlistRoutingTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            email='customer@example.com',
            password='password123',
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

    def test_wishlist_route_is_not_captured_as_product_slug(self):
        response = self.client.get('/api/products/wishlist/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['results'], [])

    def test_duplicate_wishlist_item_is_rejected_cleanly(self):
        first = self.client.post('/api/products/wishlist/', {'product_id': self.product.id}, format='json')
        second = self.client.post('/api/products/wishlist/', {'product_id': self.product.id}, format='json')

        self.assertEqual(first.status_code, 201)
        self.assertEqual(second.status_code, 400)
