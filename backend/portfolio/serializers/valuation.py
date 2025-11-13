from typing import Dict, Any
from rest_framework import serializers

from portfolio.models.valuation import ValuationSnapshot
from portfolio.services import ValuationService


class ValuationSnapshotSerializer(serializers.ModelSerializer):
    """
    Valuation Snapshot serializers.
    """

    portfolio_name = serializers.CharField(source="portfolio.name", read_only=True)

    class Meta:
        model = ValuationSnapshot
        fields = [
            "id",
            "portfolio",
            "portfolio_name",
            "snapshot_date",
            "status",
            "total_aum",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "total_aum", "created_at", "updated_at"]

    def validate_status(self, value: str) -> str:
        """
            Validate status is one of the allowed values.
        """
        valid_statuses = [choice[0] for choice in ValuationSnapshot.STATUS_CHOICES]
        if value not in valid_statuses:
            raise serializers.ValidationError(f"Status must be one of {valid_statuses}.")
        return value


class ValuationSnapshotCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating valuation snapshots.
    calculates AUM when creating a snapshot.
    """

    portfolio_name = serializers.CharField(source="portfolio.name", read_only=True)

    class Meta:
        model = ValuationSnapshot
        fields = [
            "id",
            "portfolio",
            "portfolio_name",
            "snapshot_date",
            "status",
            "total_aum",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "total_aum", "created_at", "updated_at"]

    def create(self, validated_data: Dict[str, Any]) -> ValuationSnapshot:
        """
            Create a valuation snapshot and calculate AUM.
        """
        portfolio = validated_data["portfolio"]
        snapshot_date = validated_data["snapshot_date"]
        status = validated_data.get("status", "DRAFT")
        notes = validated_data.get("notes")

        snapshot = ValuationService.create_valuation_snapshot(
            portfolio=portfolio,
            snapshot_date=snapshot_date,
            status=status,
            notes=notes,
            recalculate=True,
        )

        return snapshot

