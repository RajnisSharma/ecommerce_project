from decimal import Decimal

from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction
from django.shortcuts import get_object_or_404
from .models import Order, OrderItem, Cart, CartItem
from apps.products.models import Product
from .serializers import (
    OrderSerializer, OrderCreateSerializer, CartSerializer, CartItemSerializer
)


FREE_SHIPPING_THRESHOLD = Decimal('100.00')
STANDARD_SHIPPING_COST = Decimal('10.00')
TAX_RATE = Decimal('0.08')


def calculate_totals(cart):
    subtotal = sum((item.subtotal for item in cart.items.select_related('product').all()), Decimal('0.00'))
    shipping_cost = Decimal('0.00') if subtotal >= FREE_SHIPPING_THRESHOLD else STANDARD_SHIPPING_COST
    tax_amount = (subtotal * TAX_RATE).quantize(Decimal('0.01'))
    total = subtotal + shipping_cost + tax_amount
    return subtotal, shipping_cost, tax_amount, total


class OrderListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return OrderCreateSerializer
        return OrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            cart = Cart.objects.select_for_update().filter(user=request.user).first()
            if not cart or not cart.items.exists():
                raise ValidationError('Cart is empty')

            cart_items = list(cart.items.select_related('product').select_for_update())
            for cart_item in cart_items:
                product = cart_item.product
                if not product.is_active:
                    raise ValidationError(f'{product.name} is no longer available.')
                if cart_item.quantity > product.stock_quantity:
                    raise ValidationError(f'Only {product.stock_quantity} item(s) are available for {product.name}.')

            subtotal, shipping_cost, tax_amount, total = calculate_totals(cart)
            order = serializer.save(
                user=request.user,
                subtotal=subtotal,
                shipping_cost=shipping_cost,
                tax_amount=tax_amount,
                total_amount=total,
            )

            # Create order items from cart
            for cart_item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=cart_item.product,
                    product_name=cart_item.product.name,
                    product_sku=cart_item.product.sku,
                    quantity=cart_item.quantity,
                    price_at_time=cart_item.product.price
                )

                # Reduce stock
                cart_item.product.stock_quantity -= cart_item.quantity
                cart_item.product.save()

            # Clear cart
            cart.items.all().delete()

        return Response(OrderSerializer(order, context=self.get_serializer_context()).data, status=status.HTTP_201_CREATED)


class StaffOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return Order.objects.select_related('user').prefetch_related('items').order_by('-created_at')


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')


class OrderCancelView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        order = get_object_or_404(Order, pk=pk, user=request.user)
        
        if order.status in ['delivered', 'cancelled', 'refunded']:
            return Response(
                {'error': 'This order cannot be cancelled'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        with transaction.atomic():
            # Restore stock
            for item in order.items.all():
                if item.product:
                    item.product.stock_quantity += item.quantity
                    item.product.save()
            
            order.status = 'cancelled'
            order.save()
        
        return Response({'message': 'Order cancelled successfully'})


class CartView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart


class CartItemAddView(generics.CreateAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        product = serializer.validated_data['product']
        quantity = serializer.validated_data.get('quantity', 1)

        with transaction.atomic():
            existing_item = CartItem.objects.select_for_update().filter(cart=cart, product=product).first()
            new_quantity = quantity + (existing_item.quantity if existing_item else 0)
            if new_quantity > product.stock_quantity:
                raise ValidationError({'quantity': f'Only {product.stock_quantity} item(s) are available.'})

            if existing_item:
                existing_item.quantity = new_quantity
                existing_item.save(update_fields=['quantity', 'updated_at'])
            else:
                serializer.save(cart=cart, quantity=quantity)

        cart.refresh_from_db()
        return Response(CartSerializer(cart, context=self.get_serializer_context()).data, status=status.HTTP_201_CREATED)


class CartItemUpdateView(generics.UpdateAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        cart = get_object_or_404(Cart, user=self.request.user)
        return CartItem.objects.filter(cart=cart)

    def update(self, request, *args, **kwargs):
        super().update(request, *args, **kwargs)
        cart = get_object_or_404(Cart, user=request.user)
        return Response(CartSerializer(cart, context=self.get_serializer_context()).data)


class CartItemRemoveView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        cart = get_object_or_404(Cart, user=self.request.user)
        return CartItem.objects.filter(cart=cart)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        cart = instance.cart
        self.perform_destroy(instance)
        return Response(CartSerializer(cart, context=self.get_serializer_context()).data, status=status.HTTP_200_OK)


class CheckoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        
        if not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        
        subtotal, shipping_cost, tax_amount, total = calculate_totals(cart)
        cart_data = CartSerializer(cart, context={'request': request}).data
        
        return Response({
            'cart': cart_data,
            'subtotal': subtotal,
            'shipping_cost': shipping_cost,
            'tax_amount': round(tax_amount, 2),
            'total': round(total, 2)
        })
