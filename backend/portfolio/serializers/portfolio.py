from rest_framework import serializers

from portfolio.models.portfolio import Portfolio
from portfolio.serializers.holding import HoldingSerializer
from portfolio.serializers.valuation import ValuationSnapshotSerializer


class PortfolioSerializer(serializers.ModelSerializer):
    """
        Portfolio serialiazers.
    """

    class Meta:
        model = Portfolio
        fields = [
            "id",
            "name",
            "client_name",
            "client_email",
            "description",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class PortfolioDetailSerializer(serializers.ModelSerializer):
    """
        Detailed serializer for Portfolio with related data.
    """
    holdings = serializers.SerializerMethodField()
    valuation_snapshots = serializers.SerializerMethodField()

    def get_holdings(self, obj):
        """
            Get holdings for the portfolio.
        """
        return HoldingSerializer(obj.holdings.all(), many=True).data

    def get_valuation_snapshots(self, obj):
        """
            Get valuation snapshots for the portfolio.
        """
        return ValuationSnapshotSerializer(obj.valuation_snapshots.all(), many=True).data

    class Meta:
        model = Portfolio
        fields = [
            "id",
            "name",
            "client_name",
            "client_email",
            "description",
            "holdings",
            "valuation_snapshots",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

