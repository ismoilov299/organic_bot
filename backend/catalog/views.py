from rest_framework import viewsets, filters
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, TelegramUser
from .serializers import CategorySerializer, ProductSerializer, TelegramUserSerializer
from django.conf import settings


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Category API ViewSet"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """Product API ViewSet"""
    queryset = Product.objects.filter(is_available=True)
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at']
    ordering = ['-created_at']


class TelegramUserViewSet(viewsets.ModelViewSet):
    """Telegram Users API ViewSet"""
    queryset = TelegramUser.objects.all()
    serializer_class = TelegramUserSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user_id', 'username', 'first_name', 'last_name']
    ordering_fields = ['created_at', 'last_activity']
    ordering = ['-created_at']


@api_view(['GET'])
def telegram_config(request):
    """Telegram konfiguratsiyasi"""
    return Response({
        'bot_username': getattr(settings, 'TELEGRAM_BOT_USERNAME', None),
        'admin_username': getattr(settings, 'TELEGRAM_ADMIN_USERNAME', None),
    })
