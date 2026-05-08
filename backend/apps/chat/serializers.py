from rest_framework import serializers
from .models import ChatMessage


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'message', 'response', 'is_from_user', 'is_ai', 'created_at']
        read_only_fields = ['id', 'response', 'created_at']
