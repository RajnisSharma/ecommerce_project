from rest_framework import generics, permissions
from rest_framework.pagination import PageNumberPagination
from .models import ChatMessage
from .serializers import ChatMessageSerializer


class ChatHistoryView(generics.ListAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PageNumberPagination

    def get_queryset(self):
        return ChatMessage.objects.filter(user=self.request.user).order_by('-created_at')


class ChatMessageCreateView(generics.CreateAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, is_from_user=True)
