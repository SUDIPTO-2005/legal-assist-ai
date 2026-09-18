from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatSessionViewSet, SendChatMessageView

app_name = 'chat'

router = DefaultRouter()
router.register(r'sessions', ChatSessionViewSet, basename='chat_session')

urlpatterns = [
    path('sessions/<uuid:session_id>/message/', SendChatMessageView.as_view(), name='send_message'),
    path('', include(router.urls)),
]
