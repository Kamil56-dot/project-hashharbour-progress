import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hashharbour_backend.settings')
django.setup()

from api.models import StatItem, FeatureCard, Shipment
from datetime import date

def seed():
    print("Seeding database...")

    # Clear existing
    StatItem.objects.all().delete()
    FeatureCard.objects.all().delete()
    Shipment.objects.all().delete()

    # Create StatItems
    stats_data = [
        {"number": "1200+", "label": "Shipments Delivered", "sublabel": "Across the Globe", "icon_name": "Ship", "order": 1},
        {"number": "850+", "label": "Global Routes", "sublabel": "Optimized & Reliable", "icon_name": "Box", "order": 2},
        {"number": "980+", "label": "Trusted Clients", "sublabel": "Businesses Worldwide", "icon_name": "Users", "order": 3},
        {"number": "95+", "label": "Countries Connected", "sublabel": "One Global Network", "icon_name": "Globe", "order": 4},
    ]

    for item in stats_data:
        StatItem.objects.create(**item)
    print("Stat items created!")

    # Create FeatureCards
    features_data = [
        {
            "title": "Smart Booking",
            "description": "Book containers instantly with real-time availability and the most competitive rates.",
            "icon_name": "Ship",
            "order": 1
        },
        {
            "title": "Real-Time Tracking",
            "description": "Track your shipments in real-time across sea, air, and land with complete visibility.",
            "icon_name": "Navigation",
            "order": 2
        },
        {
            "title": "Secure & Compliant",
            "description": "Built with global compliance standards to ensure secure and reliable trade operations.",
            "icon_name": "ShieldCheck",
            "order": 3
        }
    ]

    for card in features_data:
        FeatureCard.objects.create(**card)
    print("Feature cards created!")

    # Create Sample Shipments
    Shipment.objects.create(
        tracking_number="HH-100293",
        status="In Transit",
        origin="Shanghai Port, CN",
        destination="Rotterdam Gateway, NL",
        vessel="HH Horizon V-402",
        eta=date(2026, 8, 4),
        progress_percent=68,
        last_update="Passed Singapore Strait (12:40 UTC)"
    )

    Shipment.objects.create(
        tracking_number="HH-849201",
        status="Customs Cleared",
        origin="Singapore Hub, SG",
        destination="Port of Hamburg, DE",
        vessel="HH Titan X-109",
        eta=date(2026, 7, 30),
        progress_percent=92,
        last_update="Berthing at Terminal 4 (09:15 UTC)"
    )

    print("Sample shipments created!")

if __name__ == "__main__":
    seed()
