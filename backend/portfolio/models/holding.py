"""
Holding Model
"""
from decimal import Decimal
from django.db import models
from django.core.validators import MinValueValidator

from portfolio.models.portfolio import Portfolio


class Holding(models.Model):
    """
    model for an asset holding within a portfolio.
    """

    ASSET_TYPE_CHOICES = [
        ("STOCK", "Stock"),
        ("BOND", "Bond"),
        ("CASH", "Cash"),
        ("ETF", "ETF"),
        ("MUTUAL_FUND", "Mutual Fund"),
        ("OTHER", "Other"),
    ]

    portfolio = models.ForeignKey(
        Portfolio, on_delete=models.CASCADE, related_name="holdings"
    )
    asset_name = models.CharField(max_length=255)
    asset_type = models.CharField(max_length=50, choices=ASSET_TYPE_CHOICES)
    quantity = models.DecimalField(
        max_digits=20, decimal_places=8, validators=[MinValueValidator(Decimal("0"))]
    )
    unit_price = models.DecimalField(
        max_digits=20,
        decimal_places=4,
        validators=[MinValueValidator(Decimal("0"))],
    )
    valuation_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-valuation_date", "asset_name"]
        verbose_name_plural = "Holdings"
        indexes = [
            models.Index(fields=["portfolio", "valuation_date"]),
            models.Index(fields=["valuation_date"]),
        ]

    def __str__(self) -> str:
        return f"{self.asset_name} ({self.quantity} @ {self.unit_price})"

    @property
    def total_value(self) -> Decimal:
        """
            Calculate the total value of this holding.
        """
        return self.quantity * self.unit_price

