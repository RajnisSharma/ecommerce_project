import django_filters
from .models import Product


class ProductFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    category_slug = django_filters.CharFilter(field_name='category__slug')
    in_stock = django_filters.BooleanFilter(method='filter_in_stock')
    discount_percentage__gte = django_filters.NumberFilter(field_name='discount_percentage', lookup_expr='gte')
    min_rating = django_filters.NumberFilter(field_name='min_rating', lookup_expr='gte')

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
