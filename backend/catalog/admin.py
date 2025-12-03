from django.contrib import admin
from .models import Category, Product


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
        ('Batafsil', {
            'fields': ('description', 'image')
        }),
        ('Vaqt ma\'lumotlari', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
