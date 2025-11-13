from django.db import models

from portfolio.models.portfolio import Portfolio


class ValuationSnapshot(models.Model):
    """
    model for a snapshot of portfolio value at a specific date.
    """

    STATUS_CHOICES = [
        ("DRAFT", "Draft"),
        ("CONFIRMED", "Confirmed"),
        ("ARCHIVED", "Archived"),
    ]

    portfolio = models.ForeignKey(
        Portfolio,
        on_delete=models.CASCADE,
        related_name="valuation_snapshots",
    )
    snapshot_date = models.DateField()
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="DRAFT"
    )
    total_aum = models.DecimalField(
        max_digits=20,
        decimal_places=2,
        null=True,
        blank=True,
    )
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-snapshot_date", "-created_at"]
        verbose_name_plural = "Valuation Snapshots"
        unique_together = [["portfolio", "snapshot_date"]]
        indexes = [
            models.Index(fields=["portfolio", "snapshot_date"]),
            models.Index(fields=["status"]),
        ]

    def __str__(self) -> str:
        return f"{self.portfolio.name} - {self.snapshot_date} ({self.status})"

