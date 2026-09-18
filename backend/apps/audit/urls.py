from django.urls import path
from .views import AIAuditLogListView, AIAuditLogDetailView

app_name = 'audit'

urlpatterns = [
    path('', AIAuditLogListView.as_view(), name='audit_list'),
    path('<uuid:pk>/', AIAuditLogDetailView.as_view(), name='audit_detail'),
]
