from rest_framework import serializers
from django.conf import settings
from urllib.parse import quote
from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    """Category serializer"""
    products_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'products_count', 'created_at']
    
    def get_products_count(self, obj):
        return obj.products.filter(is_available=True).count()


class ProductSerializer(serializers.ModelSerializer):
    """Product serializer"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    telegram_order_link = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 
            'name', 
            'category', 
            'category_name',
            'description', 
            'price', 
            'image', 
            'is_available',
            'created_at',
            'updated_at',
            'telegram_order_link'
        ]
    
    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    def get_telegram_order_link(self, obj):
        admin_username = getattr(settings, 'TELEGRAM_ADMIN_USERNAME', None)
        bot_username = getattr(settings, 'TELEGRAM_BOT_USERNAME', None)
        text = quote(f"Buyurtma: {obj.name} (ID: {obj.id}) narxi: {obj.price} UZS")
        if admin_username:
            return f"https://t.me/{admin_username}?text={text}"
        if bot_username:
            payload = quote(f"buy_{obj.id}")
            return f"https://t.me/{bot_username}?start={payload}"
        return None
