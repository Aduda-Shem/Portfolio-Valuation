"""
Django admin configuration for Portfolio models.
"""
from django.contrib import admin
from portfolio.models import Portfolio, Holding, ValuationSnapshot


@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ["name", "client_name", "client_email", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["name", "client_name", "client_email"]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(Holding)
class HoldingAdmin(admin.ModelAdmin):
    list_display = ["asset_name", "asset_type", "portfolio", "quantity", "unit_price", "valuation_date"]
    list_filter = ["asset_type", "valuation_date", "portfolio"]
    search_fields = ["asset_name", "portfolio__name"]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(ValuationSnapshot)
class ValuationSnapshotAdmin(admin.ModelAdmin):
    list_display = ["portfolio", "snapshot_date", "status", "total_aum", "created_at"]
    list_filter = ["status", "snapshot_date", "portfolio"]
    search_fields = ["portfolio__name"]
    readonly_fields = ["created_at", "updated_at"]

