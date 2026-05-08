from django.urls import path
from .views import (
    CategoryListView, ProductListView, ProductDetailView, StaffProductListView,
    ReviewListCreateView, WishlistListCreateView, WishlistDetailView,
    FeaturedProductsView
)

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category_list'),
    path('featured/', FeaturedProductsView.as_view(), name='featured_products'),
    path('admin/', StaffProductListView.as_view(), name='staff_product_list'),
    path('wishlist/', WishlistListCreateView.as_view(), name='wishlist_list_create'),
    path('wishlist/<int:pk>/', WishlistDetailView.as_view(), name='wishlist_detail'),
    path('<int:product_id>/reviews/', ReviewListCreateView.as_view(), name='product_reviews'),
    path('<slug:slug>/', ProductDetailView.as_view(), name='product_detail'),
    path('', ProductListView.as_view(), name='product_list'),
]
