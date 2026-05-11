from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.products.models import Product
from apps.products.serializers import ProductListSerializer
from apps.orders.models import Order, OrderItem
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta


class PersonalizedRecommendationsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # Get categories from user's order history
        user_categories = OrderItem.objects.filter(
            order__user=user
        ).values_list('product__category', flat=True).distinct()
        
        # Get products from those categories, excluding already purchased
        purchased_products = OrderItem.objects.filter(
            order__user=user
        ).values_list('product', flat=True)
        
        recommendations = Product.objects.filter(
            category__in=user_categories,
            is_active=True
        ).exclude(
            id__in=purchased_products
        ).annotate(
            order_count=Count('orderitem')
        ).order_by('-order_count', '-is_featured')[:10]
        
        if not recommendations.exists():
            # Fallback to featured products
            recommendations = Product.objects.filter(
                is_active=True, is_featured=True
            )[:10]
        
        serializer = ProductListSerializer(recommendations, many=True, context={'request': request})
        return Response(serializer.data)


class SimilarProductsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, product_id):
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=404)
        
        # Get products in same category
        similar = Product.objects.filter(
            category=product.category,
            is_active=True
        ).exclude(id=product_id).annotate(
            order_count=Count('orderitem')
        ).order_by('-order_count')[:6]
        
        serializer = ProductListSerializer(similar, many=True, context={'request': request})
        return Response(serializer.data)


class TrendingProductsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        since = timezone.now() - timedelta(days=30)
        trending = Product.objects.filter(
            is_active=True,
            orderitem__order__created_at__gte=since
        ).annotate(
            order_count=Count('orderitem')
        ).order_by('-order_count')[:10]

        if not trending.exists():
            trending = Product.objects.filter(is_active=True).order_by('-is_featured', '-created_at')[:10]
        
        serializer = ProductListSerializer(trending, many=True, context={'request': request})
        return Response(serializer.data)


class FrequentlyBoughtTogetherView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, product_id):
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=404)
        
        # Find orders containing this product
        orders_with_product = Order.objects.filter(
            items__product=product
        )
        
        # Get other products frequently bought together
        frequently_bought = OrderItem.objects.filter(
            order__in=orders_with_product
        ).exclude(
            product=product
        ).values('product').annotate(
            count=Count('id')
        ).order_by('-count')[:5]
        
        product_ids = [item['product'] for item in frequently_bought]
        products = Product.objects.filter(id__in=product_ids, is_active=True)
        
        serializer = ProductListSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)
