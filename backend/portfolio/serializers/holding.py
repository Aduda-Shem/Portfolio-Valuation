from decimal import Decimal
from rest_framework import serializers

from portfolio.models.holding import Holding


class HoldingSerializer(serializers.ModelSerializer):
    """
        Serializer for Holding model.
    """
    portfolio_name = serializers.CharField(source="portfolio.name", read_only=True)
    total_value = serializers.DecimalField(max_digits=20, decimal_places=2, read_only=True)

    class Meta:
        model = Holding
        fields = [
            "id",
            "portfolio",
            "portfolio_name",
            "asset_name",
            "asset_type",
            "quantity",
            "unit_price",
            "valuation_date",
            "total_value",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "total_value", "created_at", "updated_at"]

    def validate_quantity(self, value: Decimal) -> Decimal:
        """
            Validate that quantity is positive.
        """
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than zero.")
        return value

    def validate_unit_price(self, value: Decimal) -> Decimal:
        """
            Validate that unit_price is positive.
        """
        if value <= 0:
            raise serializers.ValidationError("Unit price must be greater than zero.")
        return value

