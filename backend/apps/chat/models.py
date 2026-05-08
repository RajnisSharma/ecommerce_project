from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class ChatMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_messages')
    message = models.TextField()
    response = models.TextField(blank=True)
    is_from_user = models.BooleanField(default=True)
    is_ai = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{'User' if self.is_from_user else 'AI'}: {self.message[:50]}"
