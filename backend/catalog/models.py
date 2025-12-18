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
    video_url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
        verbose_name="Video (YouTube link)",
        help_text="YouTube video havolasi (masalan: https://www.youtube.com/watch?v=xxxxx)"
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


class TelegramUser(models.Model):
    """Telegram bot foydalanuvchilari"""
    user_id = models.BigIntegerField(unique=True, verbose_name="Telegram ID")
    username = models.CharField(max_length=255, blank=True, null=True, verbose_name="Username")
    first_name = models.CharField(max_length=255, blank=True, null=True, verbose_name="Ism")
    last_name = models.CharField(max_length=255, blank=True, null=True, verbose_name="Familiya")
    language_code = models.CharField(max_length=10, blank=True, null=True, verbose_name="Til kodi")
    is_active = models.BooleanField(default=True, verbose_name="Faol")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Qo'shilgan sana")
    last_activity = models.DateTimeField(auto_now=True, verbose_name="Oxirgi faollik")

    class Meta:
        verbose_name = "Telegram foydalanuvchi"
        verbose_name_plural = "Telegram foydalanuvchilar"
        ordering = ['-created_at']

    def __str__(self):
        if self.username:
            return f"@{self.username} ({self.user_id})"
        return f"{self.first_name or 'User'} ({self.user_id})"
    
    @property
    def full_name(self):
        """To'liq ism"""
        parts = [self.first_name, self.last_name]
        return " ".join([p for p in parts if p]) or "Noma'lum"
