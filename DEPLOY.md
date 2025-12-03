# Ubuntu Server ga Deploy qilish yo'riqnomasi

## 1. Server tayyorlash

```bash
# Sistema yangilash
sudo apt update && sudo apt upgrade -y

# Kerakli paketlar
sudo apt install -y python3-pip python3-venv nginx git

# Ish papkasi yaratish
sudo mkdir -p /var/www/catalog
sudo chown $USER:$USER /var/www/catalog
```

## 2. Loyihani serverga yuklash

```bash
cd /var/www/catalog

# Git orqali (tavsiya)
git clone https://github.com/your-username/your-repo.git .

# yoki rsync/scp orqali fayllarni ko'chiring
```

## 3. Backend sozlash

```bash
cd /var/www/catalog/backend

# Virtual environment
python3 -m venv venv
source venv/bin/activate

# Dependencies o'rnatish
pip install -r requirements.txt
pip install -r requirements-prod.txt

# Environment o'zgaruvchilarini sozlash
export DJANGO_SETTINGS_MODULE=config.settings_prod
export SECRET_KEY="your-super-secret-production-key"
export ALLOWED_HOSTS="your-domain.com,www.your-domain.com"

# Database migrations
python manage.py migrate

# Static fayllar to'plash
python manage.py collectstatic --noinput

# Superuser yaratish
python manage.py createsuperuser

# Media papka ruxsatlarini sozlash
sudo chown -R www-data:www-data media/
sudo chmod -R 755 media/
```

## 4. Frontend build qilish

```bash
cd /var/www/catalog/frontend

# Node.js o'rnatish (agar yo'q bo'lsa)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# .env.production sozlash
nano .env.production
# VITE_API_BASE=https://your-domain.com yozing

# Dependencies va build
npm install
npm run build

# Build fayllar /var/www/catalog/frontend/dist da paydo bo'ladi
```

## 5. Systemd service sozlash

```bash
# Service faylini ko'chirish
sudo cp /var/www/catalog/deploy/catalog-backend.service /etc/systemd/system/

# Service faylini tahrirlash (SECRET_KEY, ALLOWED_HOSTS)
sudo nano /etc/systemd/system/catalog-backend.service

# Service yoqish
sudo systemctl daemon-reload
sudo systemctl enable catalog-backend
sudo systemctl start catalog-backend

# Statusni tekshirish
sudo systemctl status catalog-backend
```

## 6. Nginx sozlash

```bash
# Nginx config ko'chirish
sudo cp /var/www/catalog/deploy/nginx-catalog.conf /etc/nginx/sites-available/catalog

# Config tahrirlash (server_name)
sudo nano /etc/nginx/sites-available/catalog

# Symlink yaratish
sudo ln -s /etc/nginx/sites-available/catalog /etc/nginx/sites-enabled/

# Default configni o'chirish (ixtiyoriy)
sudo rm /etc/nginx/sites-enabled/default

# Nginx test va restart
sudo nginx -t
sudo systemctl restart nginx
```

## 7. SSL sertifikat (Let's Encrypt)

```bash
# Certbot o'rnatish
sudo apt install -y certbot python3-certbot-nginx

# SSL sertifikat olish
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Avtomatik yangilash test
sudo certbot renew --dry-run
```

## 8. Firewall sozlash

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

## 9. Yangilash (keyinchalik)

```bash
# Git orqali yangi kod olish
cd /var/www/catalog
git pull

# Backend yangilash
cd backend
source venv/bin/activate
pip install -r requirements.txt -r requirements-prod.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart catalog-backend

# Frontend yangilash
cd ../frontend
npm install
npm run build
sudo systemctl reload nginx
```

## Troubleshooting

### Backend loglarni ko'rish
```bash
sudo journalctl -u catalog-backend -f
```

### Nginx loglarni ko'rish
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Ruxsatlar muammosi (media/static)
```bash
sudo chown -R www-data:www-data /var/www/catalog/backend/media/
sudo chown -R www-data:www-data /var/www/catalog/backend/staticfiles/
```

### Database backup
```bash
cd /var/www/catalog/backend
source venv/bin/activate
python manage.py dumpdata > backup_$(date +%Y%m%d).json
```

## Environment o'zgaruvchilar (muhim!)

`/etc/systemd/system/catalog-backend.service` da:
- `SECRET_KEY` - uzun, tasodifiy string
- `ALLOWED_HOSTS` - domenlaringiz
- `CORS_ALLOWED_ORIGINS` - frontend domenlari (agar alohida bo'lsa)

Production uchun `DEBUG=False` va `SECRET_KEY` ni maxfiy saqlang!
