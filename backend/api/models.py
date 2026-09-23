from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models

class StatItem(models.Model):
    number = models.CharField(max_length=50, help_text="e.g. 1200+")
    label = models.CharField(max_length=100, help_text="e.g. Shipments Delivered")
    sublabel = models.CharField(max_length=150, help_text="e.g. Across the Globe")
    icon_name = models.CharField(max_length=50, default="Ship")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.number} - {self.label}"


class FeatureCard(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon_name = models.CharField(max_length=50, default="Ship")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class Shipment(models.Model):
    STATUS_CHOICES = [
        ('Booked', 'Booked'),
        ('In Transit', 'In Transit'),
        ('Customs Cleared', 'Customs Cleared'),
        ('Delivered', 'Delivered'),
    ]

    tracking_number = models.CharField(max_length=50, unique=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='In Transit')
    origin = models.CharField(max_length=150)
    destination = models.CharField(max_length=150)
    vessel = models.CharField(max_length=100)
    eta = models.DateField()
    progress_percent = models.IntegerField(
        default=50,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    last_update = models.CharField(max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.tracking_number} ({self.status})"
