"""
ASGI config for ecommerce project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os
from urllib.parse import parse_qs

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
import apps.chat.routing
import apps.notifications.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')


@database_sync_to_async
def get_user_from_token(token):
    from django.contrib.auth import get_user_model

    if not token:
        return AnonymousUser()

    try:
        access_token = AccessToken(token)
        user_id = access_token.get('user_id')
        return get_user_model().objects.get(id=user_id, is_active=True)
    except Exception:
        return AnonymousUser()


class JWTAuthMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        query_params = parse_qs(scope.get('query_string', b'').decode())
        token = (query_params.get('token') or [None])[0]
        scope['user'] = await get_user_from_token(token)
        return await self.app(scope, receive, send)


application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JWTAuthMiddleware(AuthMiddlewareStack(
        URLRouter(
            apps.chat.routing.websocket_urlpatterns +
            apps.notifications.routing.websocket_urlpatterns
        )
    )),
})
