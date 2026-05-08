from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from PIL import Image
import os

User = get_user_model()


class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='children')
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'categories'
        ordering = ['name']

    def __str__(self):
        return self.name


class Product(models.Model):
    # Basic fields
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    sku = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    short_description = models.TextField(blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    compare_at_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock_quantity = models.PositiveIntegerField(default=0)
    weight = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    tags = models.CharField(max_length=500, blank=True)
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Filter fields
    GENDER_CHOICES = [
        ('men', 'Men'),
        ('women', 'Women'),
        ('unisex', 'Unisex'),
        ('kids', 'Kids'),
    ]
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, null=True)

    brand = models.CharField(max_length=100, blank=True, null=True)
    size = models.CharField(max_length=50, blank=True, null=True)
    color = models.CharField(max_length=100, blank=True, null=True)
    fabric = models.CharField(max_length=100, blank=True, null=True)
    pattern = models.CharField(max_length=100, blank=True, null=True)
    fit = models.CharField(max_length=50, blank=True, null=True)
    occasion = models.CharField(max_length=100, blank=True, null=True)
    sleeve_type = models.CharField(max_length=50, blank=True, null=True)
    age_group = models.CharField(max_length=50, blank=True, null=True)
    product_type = models.CharField(max_length=100, blank=True, null=True)
    discount_percentage = models.PositiveIntegerField(default=0)
    min_rating = models.DecimalField(max_digits=2, decimal_places=1, default=0)
    fast_delivery = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    @property
    def average_rating(self):
        reviews = self.reviews.all()
        if reviews.exists():
            return sum(r.rating for r in reviews) / reviews.count()
        return 0


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    alt_text = models.CharField(max_length=255, blank=True)
    is_primary = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['sort_order']

    def __str__(self):
        return f"Image for {self.product.name}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.resize_image()

    def resize_image(self, max_size=(800, 800)):
        """Resize image to max dimensions while maintaining aspect ratio"""
        if self.image and os.path.exists(self.image.path):
            with Image.open(self.image.path) as img:
                # Convert to RGB if necessary
                if img.mode in ('RGBA', 'P'):
                    img = img.convert('RGB')

                # Resize if larger than max_size
                if img.width > max_size[0] or img.height > max_size[1]:
                    img.thumbnail(max_size, Image.Resampling.LANCZOS)
                    img.save(self.image.path, quality=85, optimize=True)
                    print(f"Resized {self.image.name} to {img.size}")


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()
    is_approved = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('product', 'user')
        ordering = ['-created_at']

    def __str__(self):
        return f"Review by {self.user.email} for {self.product.name}"


class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='wishlisted_by')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')
        ordering = ['-added_at']

    def __str__(self):
        return f"{self.user.email} - {self.product.name}"
