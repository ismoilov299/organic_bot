#!/usr/bin/env python3
"""Generate a random SECRET_KEY for Django"""
from django.core.management.utils import get_random_secret_key

print("Yangi SECRET_KEY:")
print(get_random_secret_key())
print("\nBu qiymatni serverda Environment variable sifatida ishlating:")
print("Environment=\"SECRET_KEY=<yuqoridagi qiymat>\"")
