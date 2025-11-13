"""
Portfolio Model
"""
from django.db import models


class Portfolio(models.Model):
    """
    model for an investment portfolio for a client.
    """
    name = models.CharField(max_length=255)
    client_name = models.CharField(max_length=255)
    client_email = models.EmailField()
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Portfolios"

    def __str__(self) -> str:
        return f"{self.name} - {self.client_name}"

