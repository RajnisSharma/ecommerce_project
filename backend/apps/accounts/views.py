from rest_framework import generics, permissions, status, parsers
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db.models import Count, Sum
from .models import Address
from .serializers import UserSerializer, UserRegisterSerializer, AddressSerializer
from apps.orders.models import Order
from apps.products.models import Product

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.JSONParser, parsers.MultiPartParser, parsers.FormParser]

    def get_object(self):
        return self.request.user

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


class AddressListCreateView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)


class PasswordChangeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not old_password or not new_password:
            return Response({'error': 'Old password and new password are required'}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(old_password):
            return Response({'error': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(new_password, user)
        except DjangoValidationError as exc:
            return Response({'error': list(exc.messages)}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password changed successfully'})


class IsStaffUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [IsStaffUser]


class AdminStatsView(APIView):
    permission_classes = [IsStaffUser]

    def get(self, request):
        revenue = Order.objects.exclude(status='cancelled').aggregate(total=Sum('total_amount'))['total'] or 0
        recent_orders = Order.objects.select_related('user').prefetch_related('items').order_by('-created_at')[:5]

        return Response({
            'totalOrders': Order.objects.count(),
            'totalRevenue': revenue,
            'totalUsers': User.objects.count(),
            'totalProducts': Product.objects.count(),
            'ordersByStatus': dict(Order.objects.values_list('status').annotate(count=Count('id'))),
            'recentOrders': [
                {
                    'id': order.id,
                    'order_number': order.order_number,
                    'status': order.status,
                    'total_amount': order.total_amount,
                    'customer_email': order.user.email,
                    'created_at': order.created_at,
                }
                for order in recent_orders
            ],
        })
