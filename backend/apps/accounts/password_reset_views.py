"""Password reset views for email-based password recovery"""
import logging
import secrets
import string
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from django.core.cache import cache

User = get_user_model()
logger = logging.getLogger(__name__)


class PasswordResetRequestView(APIView):
    """Request password reset - send OTP to email"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response(
                {'error': 'Email is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Don't reveal if email exists for security
            return Response(
                {'message': 'If this email exists, a reset code has been sent.'},
                status=status.HTTP_200_OK
            )
        
        # Generate 6-digit OTP
        otp = ''.join(secrets.choice(string.digits) for _ in range(6))
        
        # Store OTP in cache for 15 minutes
        cache_key = f'password_reset_{email}'
        cache.set(cache_key, otp, timeout=900)
        
        # Send email
        try:
            send_mail(
                subject='Password Reset Code',
                message=f'Your password reset code is: {otp}\n\nThis code expires in 15 minutes.',
                from_email=settings.DEFAULT_FROM_EMAIL or 'noreply@example.com',
                recipient_list=[email],
                fail_silently=False,
            )
        except Exception:
            logger.exception('Password reset email could not be sent')
        
        return Response(
            {'message': 'If this email exists, a reset code has been sent.'},
            status=status.HTTP_200_OK
        )


class PasswordResetVerifyView(APIView):
    """Verify OTP and reset password"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')
        
        if not all([email, otp, new_password]):
            return Response(
                {'error': 'Email, OTP, and new password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            validate_password(new_password)
        except DjangoValidationError as exc:
            return Response({'error': list(exc.messages)}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify OTP from cache
        cache_key = f'password_reset_{email}'
        stored_otp = cache.get(cache_key)
        
        if not stored_otp or stored_otp != otp:
            return Response(
                {'error': 'Invalid or expired code'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Set new password
        user.set_password(new_password)
        user.save()
        
        # Clear the OTP from cache
        cache.delete(cache_key)
        
        return Response(
            {'message': 'Password reset successful. Please login with your new password.'},
            status=status.HTTP_200_OK
        )
