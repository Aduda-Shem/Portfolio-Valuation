"""
URL routing for Portfolio API endpoints.
"""
from django.urls import path
from typing import List

from portfolio.views import (
    PortfolioGenericAPIView,
    PortfolioDetailGenericAPIView,
    PortfolioStatisticsGenericAPIView,
    HoldingGenericAPIView,
    ValuationSnapshotGenericAPIView,
    ValuationRecalculateGenericAPIView,
    ValuationUpdateStatusGenericAPIView,
)

urlpatterns: List = [
    # Portfolio endpoints
    path("portfolios/", PortfolioGenericAPIView.as_view(), name="portfolio-list"),
    path("portfolios/detail/", PortfolioDetailGenericAPIView.as_view(), name="portfolio-detail"),
    path("portfolios/statistics/", PortfolioStatisticsGenericAPIView.as_view(), name="portfolio-statistics"),
    # Holding endpoints
    path("holdings/", HoldingGenericAPIView.as_view(), name="holding-list"),
    # Valuation endpoints
    path("valuations/", ValuationSnapshotGenericAPIView.as_view(), name="valuation-list"),
    path("valuations/recalculate/", ValuationRecalculateGenericAPIView.as_view(), name="valuation-recalculate"),
    path("valuations/update-status/", ValuationUpdateStatusGenericAPIView.as_view(), name="valuation-update-status"),
]
