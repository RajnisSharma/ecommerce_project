import django_filters
from django.db.models import Q
from .models import Product


class CharInFilter(django_filters.BaseInFilter, django_filters.CharFilter):
    """Filter for comma-separated char values"""
    pass


class ProductFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    category_slug = CharInFilter(field_name='category__slug', lookup_expr='in')
    in_stock = django_filters.BooleanFilter(method='filter_in_stock')
    discount_percentage__gte = django_filters.NumberFilter(field_name='discount_percentage', lookup_expr='gte')
    min_rating = django_filters.NumberFilter(field_name='min_rating', lookup_expr='gte')
    
    # Multi-value filters for array fields
    gender = CharInFilter(field_name='gender', lookup_expr='in')
    brand = CharInFilter(field_name='brand', lookup_expr='in')
    size = CharInFilter(field_name='size', lookup_expr='in')
    fabric = CharInFilter(field_name='fabric', lookup_expr='in')
    product_type = CharInFilter(field_name='product_type', lookup_expr='in')
    color = CharInFilter(field_name='color', lookup_expr='in')
    pattern = CharInFilter(field_name='pattern', lookup_expr='in')
    fit = CharInFilter(field_name='fit', lookup_expr='in')
    occasion = CharInFilter(field_name='occasion', lookup_expr='in')
    age_group = CharInFilter(field_name='age_group', lookup_expr='in')
    sleeve_type = CharInFilter(field_name='sleeve_type', lookup_expr='in')
    fast_delivery = django_filters.BooleanFilter(field_name='fast_delivery')

    class Meta:
        model = Product
        fields = [
            'category', 'is_featured', 'tags',
            'gender', 'brand', 'size', 'fabric', 'product_type',
            'color', 'pattern', 'fit', 'occasion', 'age_group',
            'sleeve_type', 'fast_delivery'
        ]

    def filter_in_stock(self, queryset, name, value):
        if value:
            return queryset.filter(stock_quantity__gt=0)
        return queryset
