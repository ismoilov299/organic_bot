from django.db import models


class Category(models.Model):
    """Maxsulot kategoriyasi"""
    name = models.CharField(max_length=200, verbose_name="Kategoriya nomi")
    description = models.TextField(blank=True, verbose_name="Tavsif")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Yaratilgan vaqt")
    
    class Meta:
        verbose_name = "Kategoriya"
        verbose_name_plural = "Kategoriyalar"
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Product(models.Model):
    """Maxsulot"""
    name = models.CharField(max_length=200, verbose_name="Maxsulot nomi")
    category = models.ForeignKey(
        Category, 
        on_delete=models.CASCADE, 
        related_name='products',
        verbose_name="Kategoriya"
    )
    description = models.TextField(verbose_name="Tavsif")
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        verbose_name="Narxi"
    )
    image = models.ImageField(
        upload_to='products/', 
        verbose_name="Rasm",
        blank=True,
        null=True
    )
    is_available = models.BooleanField(
        default=True, 
        verbose_name="Mavjudligi"
    )
    created_at = models.DateTimeField(
        auto_now_add=True, 
        verbose_name="Yaratilgan vaqt"
    )
    updated_at = models.DateTimeField(
        auto_now=True, 
        verbose_name="O'zgartirilgan vaqt"
    )
    
    class Meta:
        verbose_name = "Maxsulot"
        verbose_name_plural = "Maxsulotlar"
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
