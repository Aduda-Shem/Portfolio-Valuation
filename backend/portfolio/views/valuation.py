"""
Valuation Views
"""
from drf_yasg import openapi
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.request import Request
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage
from django.shortcuts import get_object_or_404

from portfolio.models.valuation import ValuationSnapshot
from portfolio.serializers.valuation import (
    ValuationSnapshotSerializer,
    ValuationSnapshotCreateSerializer,
)
from portfolio.services import ValuationService

from portfolio.models.portfolio import Portfolio
from datetime import date

class ValuationSnapshotGenericAPIView(generics.GenericAPIView):
    """Generic API View for Valuation Snapshot management."""
    serializer_class = ValuationSnapshotSerializer

    def get(self, request: Request) -> Response:
        """Get list of valuation snapshots with optional filtering and pagination."""
        portfolio_id = request.query_params.get("portfolio")
        status_filter = request.query_params.get("status")
        snapshot_date = request.query_params.get("snapshot_date")
        page = int(request.query_params.get("page", 1))
        rows = int(request.query_params.get("rows", 25))

        query = Q(pk__isnull=False)

        if portfolio_id:
            query &= Q(portfolio_id=portfolio_id)
        if status_filter:
            query &= Q(status=status_filter)
        if snapshot_date:
            query &= Q(snapshot_date=snapshot_date)

        snapshots = (
            ValuationSnapshot.objects.filter(query)
            .select_related("portfolio")
            .order_by("-snapshot_date", "-created_at")
        )

        paginator = Paginator(snapshots, rows)
        try:
            snapshots_page = paginator.page(page)
        except EmptyPage:
            snapshots_page = paginator.page(paginator.num_pages)

        return Response(
            {
                "message": "Valuation snapshots fetched successfully",
                "valuations": self.serializer_class(snapshots_page, many=True).data,
                "current_page": page,
                "last_page": paginator.num_pages,
                "total": paginator.count,
            },
            status=status.HTTP_200_OK,
        )


    def post(self, request: Request) -> Response:
        """Create a new valuation snapshot (automatically calculates AUM)."""
        serializer = ValuationSnapshotCreateSerializer(data=request.data)
        if serializer.is_valid():
            # Create valuation snapshot instance and set fields one by one

            
            portfolio_id = request.data.get("portfolio")
            portfolio = get_object_or_404(Portfolio, pk=portfolio_id)
            snapshot_date_str = request.data.get("snapshot_date")
            snapshot_date = date.fromisoformat(snapshot_date_str) if snapshot_date_str else date.today()
            status_value = request.data.get("status", "DRAFT")
            notes = request.data.get("notes", "")
            
            # Check if snapshot already exists for this portfolio and date
            snapshot, created = ValuationSnapshot.objects.get_or_create(
                portfolio=portfolio,
                snapshot_date=snapshot_date,
                defaults={}
            )
            
            # Set fields one by one
            snapshot.portfolio = portfolio
            snapshot.snapshot_date = snapshot_date
            snapshot.status = status_value
            snapshot.notes = notes if notes else None
            
            # Calculate AUM using service
            total_aum = ValuationService.calculate_portfolio_aum(portfolio, snapshot_date)
            snapshot.total_aum = total_aum
            
            snapshot.save()
            
            return Response(
                {
                    "message": "Valuation snapshot created successfully",
                    "valuation": ValuationSnapshotSerializer(snapshot).data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {"message": "Validation error", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )


    def put(self, request: Request) -> Response:
        """Update a valuation snapshot."""
        snapshot_id = request.data.get("id") or request.query_params.get("id")
        if not snapshot_id:
            return Response(
                {"message": "Valuation snapshot ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        snapshot = get_object_or_404(ValuationSnapshot, pk=snapshot_id)
        serializer = self.serializer_class(snapshot, data=request.data, partial=True)
        if serializer.is_valid():
            # Update valuation snapshot fields one by one
            from portfolio.models.portfolio import Portfolio
            from datetime import date
            
            if "portfolio" in request.data:
                portfolio_id = request.data.get("portfolio")
                if portfolio_id:
                    snapshot.portfolio = get_object_or_404(Portfolio, pk=portfolio_id)
            if "snapshot_date" in request.data:
                snapshot_date_str = request.data.get("snapshot_date")
                snapshot.snapshot_date = date.fromisoformat(snapshot_date_str) if snapshot_date_str else date.today()
            if "status" in request.data:
                snapshot.status = request.data.get("status")
            if "notes" in request.data:
                snapshot.notes = request.data.get("notes", "")
            snapshot.save()
            
            return Response(
                {
                    "message": "Valuation snapshot updated successfully",
                    "valuation": self.serializer_class(snapshot).data,
                },
                status=status.HTTP_200_OK,
            )
        return Response(
            {"message": "Validation error", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request: Request) -> Response:
        """Delete a valuation snapshot."""
        snapshot_id = request.query_params.get("id")
        if not snapshot_id:
            return Response(
                {"message": "Valuation snapshot ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        snapshot = get_object_or_404(ValuationSnapshot, pk=snapshot_id)
        snapshot.delete()
        return Response(
            {"message": "Valuation snapshot deleted successfully"},
            status=status.HTTP_200_OK,
        )


class ValuationRecalculateGenericAPIView(generics.GenericAPIView):
    """Generic API View for recalculating valuation AUM."""
    serializer_class = ValuationSnapshotSerializer

    def post(self, request: Request) -> Response:
        """Recalculate AUM for a valuation snapshot."""
        snapshot_id = request.query_params.get("id") or request.data.get("id")
        if not snapshot_id:
            return Response(
                {"message": "Valuation snapshot ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        snapshot = get_object_or_404(ValuationSnapshot, pk=snapshot_id)
        updated_snapshot = ValuationService.recalculate_snapshot_aum(snapshot)
        return Response(
            {
                "message": "Valuation AUM recalculated successfully",
                "valuation": self.serializer_class(updated_snapshot).data,
            },
            status=status.HTTP_200_OK,
        )


class ValuationUpdateStatusGenericAPIView(generics.GenericAPIView):
    """Generic API View for updating valuation snapshot status."""
    serializer_class = ValuationSnapshotSerializer

    def patch(self, request: Request) -> Response:
        """Update the status of a valuation snapshot."""
        snapshot_id = request.query_params.get("id") or request.data.get("id")
        new_status = request.data.get("status") or request.query_params.get("status")

        if not snapshot_id:
            return Response(
                {"message": "Valuation snapshot ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not new_status:
            return Response(
                {"message": "Status is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        snapshot = get_object_or_404(ValuationSnapshot, pk=snapshot_id)
        try:
            updated_snapshot = ValuationService.update_snapshot_status(snapshot, new_status)
            return Response(
                {
                    "message": "Valuation status updated successfully",
                    "valuation": self.serializer_class(updated_snapshot).data,
                },
                status=status.HTTP_200_OK,
            )
        except ValueError as e:
            return Response(
                {"message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

