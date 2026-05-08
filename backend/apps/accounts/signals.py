from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User


@receiver(post_save, sender=User)
def create_user_cart(sender, instance, created, **kwargs):
    if created:
        from apps.orders.models import Cart
        Cart.objects.create(user=instance)
