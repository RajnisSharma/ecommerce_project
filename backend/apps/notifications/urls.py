from django.urls import path
from .views import (
    NotificationListView, NotificationMarkReadView,
    NotificationMarkAllReadView, NotificationDeleteView
)

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification_list'),
    path('<int:pk>/read/', NotificationMarkReadView.as_view(), name='notification_mark_read'),
    path('read-all/', NotificationMarkAllReadView.as_view(), name='notification_mark_all_read'),
    path('<int:pk>/', NotificationDeleteView.as_view(), name='notification_delete'),
]
