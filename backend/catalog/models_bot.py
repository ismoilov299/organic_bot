from django.db import models


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
