from decimal import Decimal
from datetime import date
from typing import Optional, List, Dict, Any
from django.db.models import QuerySet, Sum, Q
from django.db import transaction

from portfolio.models import Portfolio, Holding, ValuationSnapshot


class ValuationService:
    """
        Portfolio Valuation Services
    """

    @staticmethod
    def calculate_portfolio_aum(portfolio: Portfolio, valuation_date: date) -> Decimal:
        """
        Calculate total Assets Under Management (AUM) for a portfolio on a specific date.
        """
        holdings = Holding.objects.filter(
            portfolio=portfolio,
            valuation_date=valuation_date,
        )

        total_aum = Decimal("0.00")

        for holding in holdings:
            total_aum += holding.total_value

        return total_aum.quantize(Decimal("0.01"))

    @staticmethod
    def create_valuation_snapshot(
        portfolio: Portfolio,
        snapshot_date: date,
        status: str = "DRAFT",
        notes: Optional[str] = None,
        recalculate: bool = True,
    ) -> ValuationSnapshot:
        """
        Create a valuation snapshot for a portfolio on a specific date.
        """
        total_aum = None
        if recalculate:
            total_aum = ValuationService.calculate_portfolio_aum(portfolio, snapshot_date)

        snapshot, created = ValuationSnapshot.objects.update_or_create(
            portfolio=portfolio,
            snapshot_date=snapshot_date,
            defaults={
                "status": status,
                "total_aum": total_aum,
                "notes": notes,
            },
        )

        return snapshot

    @staticmethod
    def recalculate_snapshot_aum(snapshot: ValuationSnapshot) -> ValuationSnapshot:
        """
        Recalculate and update the AUM for an existing snapshot.
        """
        total_aum = ValuationService.calculate_portfolio_aum(snapshot.portfolio, snapshot.snapshot_date)
        snapshot.total_aum = total_aum
        snapshot.save(update_fields=["total_aum", "updated_at"])
        return snapshot

    @staticmethod
    def get_portfolio_holdings_by_date(portfolio: Portfolio, valuation_date: date) -> QuerySet[Holding]:
        """
        Get all holdings for a portfolio on a specific date.
        """
        return Holding.objects.filter(portfolio=portfolio, valuation_date=valuation_date).select_related("portfolio")

    @staticmethod
    def get_portfolio_valuation_history(portfolio: Portfolio) -> QuerySet[ValuationSnapshot]:
        """
        Get all valuation snapshots for a portfolio, ordered by date.
        """
        return ValuationSnapshot.objects.filter(portfolio=portfolio).select_related("portfolio").order_by(
            "-snapshot_date"
        )

    @staticmethod
    def update_snapshot_status(snapshot: ValuationSnapshot, new_status: str) -> ValuationSnapshot:
        """
        Update the status of a valuation snapshot.
        """
        snapshot.status = new_status
        snapshot.save(update_fields=["status", "updated_at"])
        return snapshot


class PortfolioService:
    """
    Service class for portfolio management operations.
    """

    @staticmethod
    def get_portfolio_statistics(portfolio: Portfolio) -> Dict[str, Any]:
        """
        Get statistics for a portfolio.
        """
        total_holdings = portfolio.holdings.count()
        total_snapshots = portfolio.valuation_snapshots.count()
        latest_snapshot = portfolio.valuation_snapshots.order_by("-snapshot_date").first()

        return {
            "total_holdings": total_holdings,
            "total_snapshots": total_snapshots,
            "latest_snapshot_date": latest_snapshot.snapshot_date if latest_snapshot else None,
            "latest_aum": latest_snapshot.total_aum if latest_snapshot else None,
        }

