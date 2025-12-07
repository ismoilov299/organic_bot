"""
Production settings
"""
from .settings import *
import os

DEBUG = os.environ.get('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# Security
SECRET_KEY = os.environ.get('SECRET_KEY', SECRET_KEY)

# HTTPS settings (only enable after SSL certificate is installed)
SECURE_SSL_REDIRECT = os.environ.get('SECURE_SSL_REDIRECT', 'False') == 'True'
SESSION_COOKIE_SECURE = os.environ.get('SESSION_COOKIE_SECURE', 'False') == 'True'
CSRF_COOKIE_SECURE = os.environ.get('CSRF_COOKIE_SECURE', 'False') == 'True'
SECURE_HSTS_SECONDS = int(os.environ.get('SECURE_HSTS_SECONDS', '0'))
SECURE_HSTS_INCLUDE_SUBDOMAINS = os.environ.get('SECURE_HSTS_INCLUDE_SUBDOMAINS', 'False') == 'True'
SECURE_HSTS_PRELOAD = os.environ.get('SECURE_HSTS_PRELOAD', 'False') == 'True'

# CSRF trusted origins (HTTP for IP, HTTPS for domain via Cloudflare)
CSRF_TRUSTED_ORIGINS = [
    'http://45.138.159.52',
    'http://organikbuyurtma.uz',
    'http://www.organikbuyurtma.uz',
    'https://organikbuyurtma.uz',
    'https://www.organikbuyurtma.uz',
]

# Static files
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'

# Database - PostgreSQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'organic_catalog'),
        'USER': os.environ.get('DB_USER', 'organic_user'),
        'PASSWORD': os.environ.get('DB_PASSWORD', 'Org@n1c_C@t@log_2025!'),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}

# CORS for production
cors_origins = os.environ.get('CORS_ALLOWED_ORIGINS', '')
if cors_origins:
    CORS_ALLOWED_ORIGINS = cors_origins.split(',')
else:
    CORS_ALLOW_ALL_ORIGINS = True

# Media files
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'
