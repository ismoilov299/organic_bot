from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from decimal import Decimal
from catalog.models import Category, Product
from decouple import config
from django.utils import timezone

class Command(BaseCommand):
    """Seed demo data: categories, products, and optional superuser"""
    
    help = "Seed demo categories, products, and optionally create a superuser"

    def handle(self, *args, **options):
        # Create categories
        cat_names = [
            ("Telefonlar", "Smartfon va aksessuarlar"),
            ("Noutbuklar", "Laptoplar va periferiyalar"),
            ("Maishiy texnika", "Uy uchun texnika"),
        ]
        cats = []
        for name, desc in cat_names:
            c, _ = Category.objects.get_or_create(name=name, defaults={"description": desc})
            cats.append(c)
        self.stdout.write(self.style.SUCCESS(f"Categories: {Category.objects.count()}"))

        # Create products (simple demo)
        demo_products = [
            ("iPhone 14", cats[0], Decimal("10990000.00"), "Yangi iPhone 14, 128GB"),
            ("Samsung Galaxy S23", cats[0], Decimal("8990000.00"), "Flagman smartfon"),
            ("Lenovo IdeaPad 3", cats[1], Decimal("6490000.00"), "Talabalar uchun qulay noutbuk"),
            ("Dyson Changyutgich", cats[2], Decimal("3990000.00"), "Kuchli changyutgich"),
        ]
        for name, cat, price, desc in demo_products:
            Product.objects.get_or_create(
                name=name,
                category=cat,
                defaults={
                    "price": price,
                    "description": desc,
                    "is_available": True,
                },
            )
        self.stdout.write(self.style.SUCCESS(f"Products: {Product.objects.count()}"))

        # Optional superuser from env
        username = config("DEMO_SUPERUSER_USERNAME", default="")
        email = config("DEMO_SUPERUSER_EMAIL", default="")
        password = config("DEMO_SUPERuser_PASSWORD", default="")  # note: env key case-sensitive
        if username and password:
            User = get_user_model()
            if not User.objects.filter(username=username).exists():
                User.objects.create_superuser(username=username, email=email or None, password=password)
                self.stdout.write(self.style.SUCCESS(f"Created superuser: {username}"))
            else:
                self.stdout.write("Superuser already exists; skipping.")

        self.stdout.write(self.style.SUCCESS("Demo data seeding complete."))
