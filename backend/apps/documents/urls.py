from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DocumentViewSet, DocumentFolderViewSet

app_name = 'documents'

router = DefaultRouter()
router.register(r'folders', DocumentFolderViewSet, basename='folder')
router.register(r'', DocumentViewSet, basename='document')

urlpatterns = [
    path('', include(router.urls)),
]
