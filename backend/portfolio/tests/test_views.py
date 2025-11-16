"""
Tests for Portfolio API views.
Updated for GenericAPIView pattern.
"""
import pytest
from decimal import Decimal
from datetime import date, timedelta
from django.urls import reverse

from portfolio.models import Portfolio, Holding, ValuationSnapshot
from portfolio.tests.factories import (
    PortfolioFactory,
    HoldingFactory,
    ValuationSnapshotFactory,
)


@pytest.mark.django_db
class TestPortfolioGenericAPIView:
    """Test cases for PortfolioGenericAPIView."""

    def test_list_portfolios(self, api_client):
        """Test listing portfolios."""
        PortfolioFactory()
        PortfolioFactory()
        url = reverse("portfolio-list")
        response = api_client.get(url)
        assert response.status_code == 200
        assert response.data["message"] == "Portfolios fetched successfully"
        assert len(response.data["portfolios"]) == 2
        assert "current_page" in response.data
        assert "total" in response.data

    def test_create_portfolio(self, api_client):
        """Test creating a portfolio."""
        url = reverse("portfolio-list")
        data = {
            "name": "New Portfolio",
            "client_name": "Test Client",
            "client_email": "test@example.com",
            "description": "Test description",
        }
        response = api_client.post(url, data, format="json")
        assert response.status_code == 201
        assert response.data["message"] == "Portfolio created successfully"
        assert response.data["portfolio"]["name"] == "New Portfolio"

    def test_search_portfolios(self, api_client):
        """Test searching portfolios."""
        tech_portfolio = PortfolioFactory(name="Tech Portfolio")
        PortfolioFactory(name="Finance Portfolio")
        url = reverse("portfolio-list")
        response = api_client.get(url, {"search": "Tech"})
        assert response.status_code == 200
        assert len(response.data["portfolios"]) == 1
        assert response.data["portfolios"][0]["name"] == tech_portfolio.name

    def test_pagination(self, api_client):
        """Test pagination."""
        # Create 30 portfolios
        for _ in range(30):
            PortfolioFactory()
        url = reverse("portfolio-list")
        response = api_client.get(url, {"page": 1, "rows": 10})
        assert response.status_code == 200
        assert len(response.data["portfolios"]) == 10
        assert response.data["current_page"] == 1
        assert response.data["last_page"] == 3


@pytest.mark.django_db
class TestPortfolioDetailGenericAPIView:
    """Test cases for PortfolioDetailGenericAPIView."""

    def test_retrieve_portfolio(self, api_client):
        """Test retrieving a portfolio."""
        portfolio = PortfolioFactory()
        url = reverse("portfolio-detail")
        response = api_client.get(url, {"id": portfolio.id})
        assert response.status_code == 200
        assert response.data["message"] == "Portfolio fetched successfully"
        assert response.data["portfolio"]["name"] == portfolio.name

    def test_update_portfolio(self, api_client):
        """Test updating a portfolio."""
        portfolio = PortfolioFactory()
        new_name = "Updated Portfolio"
        url = reverse("portfolio-detail")
        data = {
            "id": portfolio.id,
            "name": new_name,
            "client_name": portfolio.client_name,
            "client_email": portfolio.client_email,
        }
        response = api_client.put(url, data, format="json")
        assert response.status_code == 200
        assert response.data["message"] == "Portfolio updated successfully"
        assert response.data["portfolio"]["name"] == new_name

    def test_delete_portfolio(self, api_client):
        """Test deleting a portfolio."""
        portfolio = PortfolioFactory()
        url = reverse("portfolio-detail")
        response = api_client.delete(f"{url}?id={portfolio.id}")
        assert response.status_code == 200
        assert response.data["message"] == "Portfolio deleted successfully"
        assert not Portfolio.objects.filter(pk=portfolio.id).exists()

    def test_portfolio_statistics(self, api_client):
        """Test portfolio statistics endpoint."""
        portfolio = PortfolioFactory()
        url = reverse("portfolio-statistics")
        response = api_client.get(url, {"id": portfolio.id})
        assert response.status_code == 200
        assert response.data["message"] == "Portfolio statistics fetched successfully"
        assert "statistics" in response.data


@pytest.mark.django_db
class TestHoldingGenericAPIView:
    """Test cases for HoldingGenericAPIView."""

    def test_create_holding(self, api_client):
        """Test creating a holding."""
        portfolio = PortfolioFactory()
        quantity = Decimal("100.0")
        unit_price = Decimal("150.50")
        valuation_date = date.today()
        url = reverse("holding-list")
        data = {
            "portfolio": portfolio.id,
            "asset_name": "Test Asset",
            "asset_type": "STOCK",
            "quantity": str(quantity),
            "unit_price": str(unit_price),
            "valuation_date": str(valuation_date),
        }
        response = api_client.post(url, data, format="json")
        assert response.status_code == 201
        assert response.data["message"] == "Holding created successfully"
        assert response.data["holding"]["asset_name"] == "Test Asset"
        assert Decimal(response.data["holding"]["total_value"]) == quantity * unit_price

    def test_list_holdings_filtered_by_portfolio(self, api_client):
        """Test listing holdings filtered by portfolio."""
        portfolio1 = PortfolioFactory()
        portfolio2 = PortfolioFactory()
        holding1 = HoldingFactory(portfolio=portfolio1, valuation_date=date.today())
        HoldingFactory(portfolio=portfolio2, valuation_date=date.today())
        url = reverse("holding-list")
        response = api_client.get(url, {"portfolio": portfolio1.id})
        assert response.status_code == 200
        assert response.data["message"] == "Holdings fetched successfully"
        assert len(response.data["holdings"]) == 1
        assert response.data["holdings"][0]["asset_name"] == holding1.asset_name

    def test_update_holding(self, api_client):
        """Test updating a holding."""
        portfolio = PortfolioFactory()
        holding = HoldingFactory(portfolio=portfolio, valuation_date=date.today())
        new_asset_name = "Updated Asset Name"
        url = reverse("holding-list")
        data = {
            "id": holding.id,
            "portfolio": portfolio.id,
            "asset_name": new_asset_name,
            "asset_type": holding.asset_type,
            "quantity": str(holding.quantity),
            "unit_price": str(holding.unit_price),
            "valuation_date": str(holding.valuation_date),
        }
        response = api_client.put(url, data, format="json")
        assert response.status_code == 200
        assert response.data["message"] == "Holding updated successfully"
        assert response.data["holding"]["asset_name"] == new_asset_name

    def test_delete_holding(self, api_client):
        """Test deleting a holding."""
        portfolio = PortfolioFactory()
        holding = HoldingFactory(portfolio=portfolio, valuation_date=date.today())
        url = reverse("holding-list")
        response = api_client.delete(f"{url}?id={holding.id}")
        assert response.status_code == 200
        assert response.data["message"] == "Holding deleted successfully"
        assert not Holding.objects.filter(pk=holding.id).exists()


@pytest.mark.django_db
class TestValuationSnapshotGenericAPIView:
    """Test cases for ValuationSnapshotGenericAPIView."""

    def test_create_valuation_snapshot(self, api_client):
        """Test creating a valuation snapshot."""
        portfolio = PortfolioFactory()
        quantity = Decimal("100")
        unit_price = Decimal("150.50")
        valuation_date = date.today()
        HoldingFactory(
            portfolio=portfolio,
            quantity=quantity,
            unit_price=unit_price,
            valuation_date=valuation_date,
        )
        url = reverse("valuation-list")
        data = {
            "portfolio": portfolio.id,
            "snapshot_date": str(valuation_date),
            "status": "DRAFT",
        }
        response = api_client.post(url, data, format="json")
        assert response.status_code == 201
        assert response.data["message"] == "Valuation snapshot created successfully"
        assert Decimal(response.data["valuation"]["total_aum"]) == quantity * unit_price

    def test_list_valuations_filtered_by_status(self, api_client):
        """Test listing valuations filtered by status."""
        portfolio = PortfolioFactory()
        ValuationSnapshotFactory(
            portfolio=portfolio,
            snapshot_date=date.today(),
            status="DRAFT",
            total_aum=Decimal("10000.00"),
        )
        ValuationSnapshotFactory(
            portfolio=portfolio,
            snapshot_date=date.today() - timedelta(days=1),
            status="CONFIRMED",
            total_aum=Decimal("20000.00"),
        )
        url = reverse("valuation-list")
        response = api_client.get(url, {"status": "DRAFT"})
        assert response.status_code == 200
        assert response.data["message"] == "Valuation snapshots fetched successfully"
        assert len(response.data["valuations"]) == 1
        assert response.data["valuations"][0]["status"] == "DRAFT"

    def test_recalculate_snapshot(self, api_client):
        """Test recalculating snapshot AUM."""
        portfolio = PortfolioFactory()
        quantity = Decimal("100")
        unit_price = Decimal("150.50")
        valuation_date = date.today()
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
        url = reverse("valuation-recalculate")
        response = api_client.post(url, {"id": snapshot.id})
        assert response.status_code == 200
        assert response.data["message"] == "Valuation AUM recalculated successfully"
        assert Decimal(response.data["valuation"]["total_aum"]) == quantity * unit_price

    def test_update_snapshot_status(self, api_client):
        """Test updating snapshot status."""
        portfolio = PortfolioFactory()
        snapshot = ValuationSnapshotFactory(
            portfolio=portfolio,
            snapshot_date=date.today(),
            status="DRAFT",
        )
        url = reverse("valuation-update-status")
        response = api_client.patch(url, {"id": snapshot.id, "status": "CONFIRMED"})
        assert response.status_code == 200
        assert response.data["message"] == "Valuation status updated successfully"
        assert response.data["valuation"]["status"] == "CONFIRMED"

    def test_update_valuation(self, api_client):
        """Test updating a valuation snapshot."""
        portfolio = PortfolioFactory()
        snapshot = ValuationSnapshotFactory(
            portfolio=portfolio,
            snapshot_date=date.today(),
            status="DRAFT",
            total_aum=Decimal("10000.00"),
        )
        url = reverse("valuation-list")
        data = {
            "id": snapshot.id,
            "portfolio": portfolio.id,
            "snapshot_date": str(date.today()),
            "status": "DRAFT",
            "notes": "Updated notes",
        }
        response = api_client.put(url, data, format="json")
        assert response.status_code == 200
        assert response.data["message"] == "Valuation snapshot updated successfully"
        assert response.data["valuation"]["notes"] == "Updated notes"

    def test_delete_valuation(self, api_client):
        """Test deleting a valuation snapshot."""
        portfolio = PortfolioFactory()
        snapshot = ValuationSnapshotFactory(
            portfolio=portfolio,
            snapshot_date=date.today(),
            status="DRAFT",
        )
        url = reverse("valuation-list")
        response = api_client.delete(f"{url}?id={snapshot.id}")
        assert response.status_code == 200
        assert response.data["message"] == "Valuation snapshot deleted successfully"
        assert not ValuationSnapshot.objects.filter(pk=snapshot.id).exists()
