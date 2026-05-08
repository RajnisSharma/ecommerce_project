from rest_framework import serializers
from .models import Order, OrderItem, Cart, CartItem
from apps.products.models import Product
from apps.products.serializers import ProductListSerializer
from apps.accounts.serializers import UserSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'product_sku', 'quantity', 'price_at_time', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user', 'status', 'status_display', 'payment_status',
            'payment_method', 'shipping_name', 'shipping_phone', 'shipping_address',
            'shipping_city', 'shipping_state', 'shipping_postal_code', 'shipping_country',
            'subtotal', 'shipping_cost', 'tax_amount', 'discount_amount', 'total_amount',
            'tracking_number', 'notes', 'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'order_number', 'total_amount']


class OrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            'shipping_name', 'shipping_phone', 'shipping_address',
            'shipping_city', 'shipping_state', 'shipping_postal_code', 'shipping_country',
            'payment_method', 'notes'
        ]


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        source='product', write_only=True, queryset=Product.objects.all()
    )
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'subtotal', 'created_at']

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1")
        return value

    def validate_product(self, product):
        if not product.is_active:
            raise serializers.ValidationError("This product is not available.")
        if product.stock_quantity < 1:
            raise serializers.ValidationError("This product is out of stock.")
        return product

    def validate(self, attrs):
        attrs = super().validate(attrs)
        product = attrs.get('product') or getattr(self.instance, 'product', None)
        quantity = attrs.get('quantity') or getattr(self.instance, 'quantity', 1)

        if product and quantity > product.stock_quantity:
            raise serializers.ValidationError({'quantity': f'Only {product.stock_quantity} item(s) are available.'})
        return attrs


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.ReadOnlyField()
    item_count = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total', 'item_count', 'created_at', 'updated_at']
