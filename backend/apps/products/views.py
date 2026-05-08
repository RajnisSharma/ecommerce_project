from rest_framework import generics, permissions, filters, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from .models import Category, Product, Review, Wishlist
from .serializers import (
    CategorySerializer, ProductListSerializer, ProductDetailSerializer,
    ReviewSerializer, WishlistSerializer
)
from .filters import ProductFilter


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'sku', 'tags']
    ordering_fields = ['price', 'created_at', 'name']


class StaffProductListView(ProductListView):
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return Product.objects.all()


class FeaturedProductsView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True, is_featured=True)
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return Review.objects.filter(product_id=self.kwargs['product_id'], is_approved=True)

    def perform_create(self, serializer):
        product = get_object_or_404(Product, pk=self.kwargs['product_id'], is_active=True)
        if Review.objects.filter(product=product, user=self.request.user).exists():
            raise ValidationError('You have already reviewed this product.')
        serializer.save(user=self.request.user, product=product)


class WishlistListCreateView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response(response.data, status=status.HTTP_201_CREATED)


class WishlistDetailView(generics.DestroyAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)
