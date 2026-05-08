from django.urls import path
from .views import (
    OrderListCreateView, StaffOrderListView, OrderDetailView, OrderCancelView,
    CartView, CartItemAddView, CartItemUpdateView, CartItemRemoveView,
    CheckoutView
)

urlpatterns = [
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/items/', CartItemAddView.as_view(), name='cart_item_add'),
    path('cart/items/<int:pk>/', CartItemUpdateView.as_view(), name='cart_item_update'),
    path('cart/items/<int:pk>/remove/', CartItemRemoveView.as_view(), name='cart_item_remove'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('admin/', StaffOrderListView.as_view(), name='staff_order_list'),
    path('', OrderListCreateView.as_view(), name='order_list_create'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order_detail'),
    path('<int:pk>/cancel/', OrderCancelView.as_view(), name='order_cancel'),
]
