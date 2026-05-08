from django.urls import path
from .views import ChatHistoryView, ChatMessageCreateView

urlpatterns = [
    path('history/', ChatHistoryView.as_view(), name='chat_history'),
    path('send/', ChatMessageCreateView.as_view(), name='chat_send'),
]
