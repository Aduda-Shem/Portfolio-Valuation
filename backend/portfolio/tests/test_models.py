"""
Tests for Portfolio models.
"""
import pytest
from decimal import Decimal
from datetime import date, timedelta
from django.core.exceptions import ValidationError

from portfolio.models import Portfolio, Holding, ValuationSnapshot


@pytest.mark.django_db
class TestPortfolio:
    """Test cases for Portfolio model."""

    def test_create_portfolio(self):
        """Test creating a portfolio."""
        portfolio = Portfolio.objects.create(
            name="Test Portfolio",
            client_name="John Doe",
            client_email="john@example.com",
            description="Test description",
        )
        assert portfolio.id is not None
        assert portfolio.name == "Test Portfolio"
        assert portfolio.client_name == "John Doe"
        assert str(portfolio) == "Test Portfolio - John Doe"

    def test_portfolio_str(self):
        """Test portfolio string representation."""
        portfolio = Portfolio.objects.create(
            name="My Portfolio",
            client_name="Jane Smith",
            client_email="jane@example.com",
        )
        assert str(portfolio) == "My Portfolio - Jane Smith"


@pytest.mark.django_db
class TestHolding:
    """Test cases for Holding model."""

    def test_create_holding(self):
        """Test creating a holding."""
        portfolio = Portfolio.objects.create(
            name="Test Portfolio",
            client_name="John Doe",
            client_email="john@example.com",
        )
        holding = Holding.objects.create(
            portfolio=portfolio,
            asset_name="Apple Inc.",
            asset_type="STOCK",
            quantity=Decimal("100.0"),
            unit_price=Decimal("150.50"),
            valuation_date=date.today(),
        )
        assert holding.id is not None
        assert holding.asset_name == "Apple Inc."
        assert holding.total_value == Decimal("15050.00")

    def test_holding_total_value_calculation(self):
        """Test holding total value calculation."""
        portfolio = Portfolio.objects.create(
            name="Test Portfolio",
            client_name="John Doe",
            client_email="john@example.com",
        )
        holding = Holding.objects.create(
            portfolio=portfolio,
            asset_name="Tesla Inc.",
            asset_type="STOCK",
            quantity=Decimal("50.5"),
            unit_price=Decimal("200.75"),
            valuation_date=date.today(),
        )
        expected_value = Decimal("50.5") * Decimal("200.75")
        assert holding.total_value == expected_value

    def test_holding_str(self):
        """Test holding string representation."""
        portfolio = Portfolio.objects.create(
            name="Test Portfolio",
            client_name="John Doe",
            client_email="john@example.com",
        )
        holding = Holding.objects.create(
            portfolio=portfolio,
            asset_name="Microsoft Corp.",
            asset_type="STOCK",
            quantity=Decimal("25"),
            unit_price=Decimal("300.00"),
            valuation_date=date.today(),
        )
        assert "Microsoft Corp." in str(holding)
        assert "25" in str(holding)


@pytest.mark.django_db
class TestValuationSnapshot:
    """Test cases for ValuationSnapshot model."""

    def test_create_valuation_snapshot(self):
        """Test creating a valuation snapshot."""
        portfolio = Portfolio.objects.create(
            name="Test Portfolio",
            client_name="John Doe",
            client_email="john@example.com",
        )
        snapshot = ValuationSnapshot.objects.create(
            portfolio=portfolio,
            snapshot_date=date.today(),
            status="DRAFT",
            total_aum=Decimal("100000.00"),
        )
        assert snapshot.id is not None
        assert snapshot.status == "DRAFT"
        assert snapshot.total_aum == Decimal("100000.00")

    def test_snapshot_str(self):
        """Test snapshot string representation."""
        portfolio = Portfolio.objects.create(
            name="Test Portfolio",
            client_name="John Doe",
            client_email="john@example.com",
        )
        snapshot = ValuationSnapshot.objects.create(
            portfolio=portfolio,
            snapshot_date=date.today(),
            status="CONFIRMED",
        )
        assert "Test Portfolio" in str(snapshot)
        assert "CONFIRMED" in str(snapshot)

    def test_snapshot_unique_constraint(self):
        """Test that portfolio and snapshot_date combination is unique."""
        portfolio = Portfolio.objects.create(
            name="Test Portfolio",
            client_name="John Doe",
            client_email="john@example.com",
        )
        ValuationSnapshot.objects.create(
            portfolio=portfolio,
            snapshot_date=date.today(),
            status="DRAFT",
        )
        # Attempting to create another snapshot with same portfolio and date should fail
        with pytest.raises(Exception):  # IntegrityError
            ValuationSnapshot.objects.create(
                portfolio=portfolio,
                snapshot_date=date.today(),
                status="CONFIRMED",
            )

