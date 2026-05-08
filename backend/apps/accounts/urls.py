from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, UserProfileView, AddressListCreateView,
    AddressDetailView, PasswordChangeView, AdminStatsView, AdminUserListView
)
from .auth_views import CustomTokenObtainPairView
from .password_reset_views import PasswordResetRequestView, PasswordResetVerifyView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('password/change/', PasswordChangeView.as_view(), name='password_change'),
    path('password/reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password/reset/verify/', PasswordResetVerifyView.as_view(), name='password_reset_verify'),
    path('addresses/', AddressListCreateView.as_view(), name='address_list_create'),
    path('addresses/<int:pk>/', AddressDetailView.as_view(), name='address_detail'),
    path('admin/stats/', AdminStatsView.as_view(), name='admin_stats'),
    path('admin/users/', AdminUserListView.as_view(), name='admin_users'),
]
