"""
Tests for Portfolio services.
"""
import pytest
from decimal import Decimal
from datetime import date

from portfolio.models import Portfolio, Holding, ValuationSnapshot
from portfolio.services import ValuationService, PortfolioService
from portfolio.tests.factories import (
    PortfolioFactory,
    HoldingFactory,
    ValuationSnapshotFactory,
)


@pytest.mark.django_db
class TestValuationService:
    """Test cases for ValuationService."""

    def test_calculate_portfolio_aum_single_holding(self):
        """Test AUM calculation with a single holding."""
        portfolio = PortfolioFactory()
        valuation_date = date.today()
        quantity = Decimal("100")
        unit_price = Decimal("150.50")
        HoldingFactory(
            portfolio=portfolio,
            quantity=quantity,
            unit_price=unit_price,
            valuation_date=valuation_date,
        )
        aum = ValuationService.calculate_portfolio_aum(portfolio, valuation_date)
        assert aum == quantity * unit_price

    def test_calculate_portfolio_aum_multiple_holdings(self):
        """Test AUM calculation with multiple holdings."""
        portfolio = PortfolioFactory()
        valuation_date = date.today()
        quantity1 = Decimal("100")
        unit_price1 = Decimal("150.50")
        quantity2 = Decimal("50")
        unit_price2 = Decimal("200.75")
        HoldingFactory(
            portfolio=portfolio,
            quantity=quantity1,
            unit_price=unit_price1,
            valuation_date=valuation_date,
        )
        HoldingFactory(
            portfolio=portfolio,
            quantity=quantity2,
            unit_price=unit_price2,
            valuation_date=valuation_date,
        )
        aum = ValuationService.calculate_portfolio_aum(portfolio, valuation_date)
        expected = (quantity1 * unit_price1) + (quantity2 * unit_price2)
        assert aum == expected

    def test_calculate_portfolio_aum_no_holdings(self):
        """Test AUM calculation with no holdings."""
        portfolio = PortfolioFactory()
        valuation_date = date.today()
        aum = ValuationService.calculate_portfolio_aum(portfolio, valuation_date)
        assert aum == Decimal("0.00")

    def test_calculate_portfolio_aum_different_dates(self):
        """Test AUM calculation filters by date correctly."""
        from datetime import timedelta

        portfolio = PortfolioFactory()
        today = date.today()
        yesterday = today - timedelta(days=1)
        quantity1 = Decimal("100")
        unit_price1 = Decimal("150.50")
        quantity2 = Decimal("50")
        unit_price2 = Decimal("200.75")
        HoldingFactory(
            portfolio=portfolio,
            quantity=quantity1,
            unit_price=unit_price1,
            valuation_date=today,
        )
        HoldingFactory(
            portfolio=portfolio,
            quantity=quantity2,
            unit_price=unit_price2,
            valuation_date=yesterday,
        )
        aum_today = ValuationService.calculate_portfolio_aum(portfolio, today)
        aum_yesterday = ValuationService.calculate_portfolio_aum(portfolio, yesterday)
        assert aum_today == quantity1 * unit_price1
        assert aum_yesterday == quantity2 * unit_price2

    def test_create_valuation_snapshot(self):
        """Test creating a valuation snapshot."""
        portfolio = PortfolioFactory()
        valuation_date = date.today()
        quantity = Decimal("100")
        unit_price = Decimal("150.50")
        HoldingFactory(
            portfolio=portfolio,
            quantity=quantity,
            unit_price=unit_price,
            valuation_date=valuation_date,
        )
        snapshot = ValuationService.create_valuation_snapshot(
            portfolio=portfolio,
            snapshot_date=valuation_date,
            status="DRAFT",
        )
        assert snapshot.portfolio == portfolio
        assert snapshot.snapshot_date == valuation_date
        assert snapshot.status == "DRAFT"
        assert snapshot.total_aum == quantity * unit_price

    def test_recalculate_snapshot_aum(self):
        """Test recalculating snapshot AUM."""
        portfolio = PortfolioFactory()
        valuation_date = date.today()
        quantity = Decimal("100")
        unit_price = Decimal("150.50")
        snapshot = ValuationSnapshotFactory(
            portfolio=portfolio,
            snapshot_date=valuation_date,
            status="DRAFT",
            total_aum=Decimal("0.00"),
        )
        HoldingFactory(
            portfolio=portfolio,
            quantity=quantity,
            unit_price=unit_price,
            valuation_date=valuation_date,
        )
        updated_snapshot = ValuationService.recalculate_snapshot_aum(snapshot)
        assert updated_snapshot.total_aum == quantity * unit_price

    def test_update_snapshot_status(self):
        """Test updating snapshot status."""
        portfolio = PortfolioFactory()
        snapshot = ValuationSnapshotFactory(
            portfolio=portfolio,
            snapshot_date=date.today(),
            status="DRAFT",
        )
        updated = ValuationService.update_snapshot_status(snapshot, "CONFIRMED")
        assert updated.status == "CONFIRMED"

    def test_update_snapshot_status_invalid(self):
        """Test updating snapshot status with invalid value."""
        portfolio = PortfolioFactory()
        snapshot = ValuationSnapshotFactory(
            portfolio=portfolio,
            snapshot_date=date.today(),
            status="DRAFT",
        )
        with pytest.raises(ValueError):
            ValuationService.update_snapshot_status(snapshot, "INVALID_STATUS")


@pytest.mark.django_db
class TestPortfolioService:
    """Test cases for PortfolioService."""

    def test_get_portfolio_statistics(self):
        """Test getting portfolio statistics."""
        portfolio = PortfolioFactory()
        quantity = Decimal("100")
        unit_price = Decimal("150.50")
        total_aum = quantity * unit_price
        HoldingFactory(
            portfolio=portfolio,
            quantity=quantity,
            unit_price=unit_price,
            valuation_date=date.today(),
        )
        ValuationSnapshotFactory(
            portfolio=portfolio,
            snapshot_date=date.today(),
            status="DRAFT",
            total_aum=total_aum,
        )
        stats = PortfolioService.get_portfolio_statistics(portfolio)
        assert stats["total_holdings"] == 1
        assert stats["total_snapshots"] == 1
        assert stats["latest_aum"] == total_aum

