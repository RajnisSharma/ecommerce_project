"""Custom authentication backend for email-based login"""
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

User = get_user_model()


class EmailBackend(ModelBackend):
    """
    Custom authentication backend that allows login with email
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        # The User model uses email as USERNAME_FIELD
        # So we always query by email
        if not username:
            return None
            
        try:
            user = User.objects.get(email=username)
        except User.DoesNotExist:
            return None
        
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
