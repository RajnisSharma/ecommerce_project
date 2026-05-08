import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        
        if self.user.is_anonymous:
            await self.close()
            return
        
        self.room_group_name = f"user_{self.user.id}"
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')
        
        if message_type == 'chat_message':
            message = data.get('message')
            # Store message in database
            await self.save_message(message)
            
            # Send message to AI or support
            await self.channel_layer.group_send(
                'support_group',
                {
                    'type': 'chat_message',
                    'message': message,
                    'user_id': self.user.id,
                    'user_name': self.user.get_full_name() or self.user.email
                }
            )
            
            # Send AI response (simplified)
            ai_response = await self.get_ai_response(message)
            
            await self.send(text_data=json.dumps({
                'type': 'ai_response',
                'message': ai_response
            }))
    
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'message',
            'message': event['message'],
            'sender': event.get('user_name', 'Support')
        }))
    
    @database_sync_to_async
    def save_message(self, message):
        from .models import ChatMessage
        ChatMessage.objects.create(
            user=self.user,
            message=message,
            is_from_user=True
        )
    
    async def get_ai_response(self, message):
        # Placeholder for AI integration
        responses = {
            'hello': 'Hi there! How can I help you today?',
            'help': 'I can help you with product information, orders, and general questions.',
            'order': 'You can view your orders in the Orders section of your profile.',
            'shipping': 'We offer free shipping on orders over $100. Standard shipping takes 3-5 business days.',
        }
        
        message_lower = message.lower()
        for key, response in responses.items():
            if key in message_lower:
                return response
        
        return "I'm not sure about that. Would you like to speak with a human agent?"
