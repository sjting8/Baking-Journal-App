from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JournalViewSet, JournalEntryViewSet 

router = DefaultRouter()
router.register(r'journals', JournalViewSet)
router.register(r'entries', JournalEntryViewSet, basename='entry')

urlpatterns = [
    path('', include(router.urls)),
    path('journals/<int:journal_id>/entries/', JournalEntryViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('journals/<int:journal_id>/entries/<int:pk>/', JournalEntryViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),
]