from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet, TelegramUserViewSet, telegram_config

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'telegram-users', TelegramUserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('telegram-config/', telegram_config, name='telegram-config'),
]
