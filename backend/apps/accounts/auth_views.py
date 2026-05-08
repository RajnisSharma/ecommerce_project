"""Custom authentication views for email-based login"""
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Serializer that accepts email instead of username"""
    # Tell DRF to use 'email' as the username field
    username_field = 'email'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Replace username field with email field
        self.fields.pop('username', None)
        self.fields['email'] = serializers.EmailField()
    
    def validate(self, attrs):
        # Map email to username for the parent validator
        attrs['username'] = attrs.get('email', '')
        return super().validate(attrs)
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['email'] = user.email
        token['first_name'] = user.first_name
        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    """View that accepts email for login"""
    serializer_class = CustomTokenObtainPairSerializer
