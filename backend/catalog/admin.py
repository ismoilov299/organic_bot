from django.contrib import admin
from .models import Category, Product, TelegramUser


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Category admin panel"""
    list_display = ['name', 'created_at']
    search_fields = ['name']
    list_filter = ['created_at']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Product admin panel"""
    list_display = ['name', 'category', 'price', 'is_available', 'created_at']
    list_filter = ['category', 'is_available', 'created_at']
    search_fields = ['name', 'description']
    list_editable = ['is_available']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('name', 'category', 'price', 'is_available')
        }),
        ('Media', {
            'fields': ('image', 'video_url')
        }),
        ('Batafsil', {
            'fields': ('description',)
        }),
        ('Vaqt ma\'lumotlari', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(TelegramUser)
class TelegramUserAdmin(admin.ModelAdmin):
    """Telegram foydalanuvchilar admin panel"""
    list_display = ['user_id', 'username', 'full_name', 'is_active', 'created_at', 'last_activity']
    search_fields = ['user_id', 'username', 'first_name', 'last_name']
    list_filter = ['is_active', 'created_at', 'last_activity']
    readonly_fields = ['user_id', 'username', 'first_name', 'last_name', 'language_code', 'created_at', 'last_activity']
    list_editable = ['is_active']
    
    fieldsets = (
        ('Telegram ma\'lumotlari', {
            'fields': ('user_id', 'username', 'first_name', 'last_name', 'language_code')
        }),
        ('Holat', {
            'fields': ('is_active',)
        }),
        ('Vaqt ma\'lumotlari', {
            'fields': ('created_at', 'last_activity'),
            'classes': ('collapse',)
        }),
    )
