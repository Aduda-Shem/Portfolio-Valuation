"""
Tests for Portfolio services.
"""
import pytest
from decimal import Decimal
from datetime import date, timedelta

from portfolio.models import Portfolio, Holding, ValuationSnapshot
from portfolio.services import ValuationService, PortfolioService


@pytest.mark.django_db
class TestValuationService:
    """Test cases for ValuationService."""

    def test_calculate_portfolio_aum_single_holding(self):
        """Test AUM calculation with a single holding."""
        portfolio = Portfolio.objects.create(
            name="Test Portfolio",
            client_name="John Doe",
            client_email="john@example.com",
        )
        valuation_date = date.today()
        Holding.objects.create(
            portfolio=portfolio,
            asset_name="Apple Inc.",
            asset_type="STOCK",
            quantity=Decimal("100"),
            unit_price=Decimal("150.50"),
            valuation_date=valuation_date,
        )
        aum = ValuationService.calculate_portfolio_aum(portfolio, valuation_date)
        assert aum == Decimal("15050.00")

    def test_calculate_portfolio_aum_multiple_holdings(self):
        """Test AUM calculation with multiple holdings."""
        portfolio = Portfolio.objects.create(
            name="Test Portfolio",
            client_name="John Doe",
            client_email="john@example.com",
        )
        valuation_date = date.today()
        Holding.objects.create(
            portfolio=portfolio,
            asset_name="Apple Inc.",
            asset_type="STOCK",
            quantity=Decimal("100"),
            unit_price=Decimal("150.50"),
            valuation_date=valuation_date,
        )
        Holding.objects.create(
            portfolio=portfolio,
            asset_name="Tesla Inc.",
            asset_type="STOCK",
            quantity=Decimal("50"),
            unit_price=Decimal("200.75"),
            valuation_date=valuation_date,
        )
        aum = ValuationService.calculate_portfolio_aum(portfolio, valuation_date)
        expected = Decimal("15050.00") + Decimal("10037.50")
        assert aum == expected

    def test_calculate_portfolio_aum_no_holdings(self):
        """Test AUM calculation with no holdings."""
        portfolio = Portfolio.objects.create(
            name="Test Portfolio",
            client_name="John Doe",
            client_email="john@example.com",
        )
        valuation_date = date.today()
        aum = ValuationService.calculate_portfolio_aum(portfolio, valuation_date)
        assert aum == Decimal("0.00")

    def test_calculate_portfolio_aum_different_dates(self):
        """Test AUM calculation filters by date correctly."""
        portfolio = Portfolio.objects.create(
            name="Test Portfolio",
            client_name="John Doe",
            client_email="john@example.com",
        )
        today = date.today()
        yesterday = today - timedelta(days=1)
        Holding.objects.create(
            portfolio=portfolio,
            asset_name="Apple Inc.",
            asset_type="STOCK",
            quantity=Decimal("100"),
            unit_price=Decimal("150.50"),
            valuation_date=today,
        )
        Holding.objects.create(
            portfolio=portfolio,
            asset_name="Tesla Inc.",
            asset_type="STOCK",
            quantity=Decimal("50"),
            unit_price=Decimal("200.75"),
            valuation_date=yesterday,
        )
        aum_today = ValuationService.calculate_portfolio_aum(portfolio, today)
        aum_yesterday = ValuationService.calculate_portfolio_aum(portfolio, yesterday)
        assert aum_today == Decimal("15050.00")
        assert aum_yesterday == Decimal("10037.50")

    def test_create_valuation_snapshot(self):
        """Test creating a valuation snapshot."""
        portfolio = Portfolio.objects.create(
            name="Test Portfolio",
            client_name="John Doe",
            client_email="john@example.com",
        )
        valuation_date = date.today()
        Holding.objects.create(
            portfolio=portfolio,
            asset_name="Apple Inc.",
            asset_type="STOCK",
            quantity=Decimal("100"),
            unit_price=Decimal("150.50"),
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
        assert snapshot.total_aum == Decimal("15050.00")

    def test_recalculate_snapshot_aum(self):
        """Test recalculating snapshot AUM."""
        portfolio = Portfolio.objects.create(
            name="Test Portfolio",
            client_name="John Doe",
            client_email="john@example.com",
        )
        valuation_date = date.today()
        snapshot = ValuationSnapshot.objects.create(
            portfolio=portfolio,
            snapshot_date=valuation_date,
            status="DRAFT",
            total_aum=Decimal("0.00"),
        )
        Holding.objects.create(
            portfolio=portfolio,
            asset_name="Apple Inc.",
            asset_type="STOCK",
            quantity=Decimal("100"),
            unit_price=Decimal("150.50"),
            valuation_date=valuation_date,
        )
        updated_snapshot = ValuationService.recalculate_snapshot_aum(snapshot)
        assert updated_snapshot.total_aum == Decimal("15050.00")

    def test_update_snapshot_status(self):
        """Test updating snapshot status."""
        portfolio = Portfolio.objects.create(
            name="Test Portfolio",
            client_name="John Doe",
            client_email="john@example.com",
        )
        snapshot = ValuationSnapshot.objects.create(
            portfolio=portfolio,
            snapshot_date=date.today(),
            status="DRAFT",
        )
        updated = ValuationService.update_snapshot_status(snapshot, "CONFIRMED")
        assert updated.status == "CONFIRMED"

    def test_update_snapshot_status_invalid(self):
        """Test updating snapshot status with invalid value."""
        portfolio = Portfolio.objects.create(
            name="Test Portfolio",
            client_name="John Doe",
            client_email="john@example.com",
        )
        snapshot = ValuationSnapshot.objects.create(
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
        portfolio = Portfolio.objects.create(
            name="Test Portfolio",
            client_name="John Doe",
            client_email="john@example.com",
        )
        Holding.objects.create(
            portfolio=portfolio,
            asset_name="Apple Inc.",
            asset_type="STOCK",
            quantity=Decimal("100"),
            unit_price=Decimal("150.50"),
            valuation_date=date.today(),
        )
        ValuationSnapshot.objects.create(
            portfolio=portfolio,
            snapshot_date=date.today(),
            status="DRAFT",
            total_aum=Decimal("15050.00"),
        )
        stats = PortfolioService.get_portfolio_statistics(portfolio)
        assert stats["total_holdings"] == 1
        assert stats["total_snapshots"] == 1
        assert stats["latest_aum"] == Decimal("15050.00")

