from django.urls import path
from .views import (
    PersonalizedRecommendationsView, SimilarProductsView,
    TrendingProductsView, FrequentlyBoughtTogetherView
)

urlpatterns = [
    path('personalized/', PersonalizedRecommendationsView.as_view(), name='personalized_recommendations'),
    path('similar/<int:product_id>/', SimilarProductsView.as_view(), name='similar_products'),
    path('trending/', TrendingProductsView.as_view(), name='trending_products'),
    path('frequently-bought/<int:product_id>/', FrequentlyBoughtTogetherView.as_view(), name='frequently_bought'),
]
