from rest_framework import serializers
from .models import Category, Product, ProductImage, Review, Wishlist


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'sort_order', 'created_at']

    def get_image(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'user_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['user']


class ProductListSerializer(serializers.ModelSerializer):
    primary_image = serializers.SerializerMethodField()
    average_rating = serializers.ReadOnlyField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    discount_percentage = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'sku', 'price', 'compare_at_price',
                  'category_name', 'primary_image', 'average_rating', 'is_featured',
                  'stock_quantity', 'is_active',
                  'gender', 'brand', 'size', 'color', 'fabric', 'pattern', 'fit',
                  'occasion', 'discount_percentage', 'fast_delivery', 'created_at']

    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            return ProductImageSerializer(primary, context=self.context).data
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    average_rating = serializers.ReadOnlyField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_review_count(self, obj):
        return obj.reviews.count()


class WishlistSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'product_id', 'added_at']

    def validate_product_id(self, product):
        if not product.is_active:
            raise serializers.ValidationError('This product is not available.')

        request = self.context.get('request')
        if request and Wishlist.objects.filter(user=request.user, product=product).exists():
            raise serializers.ValidationError('This product is already in your wishlist.')
        return product
