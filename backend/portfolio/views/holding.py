"""
Holding Views
"""
from drf_yasg import openapi
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.request import Request
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage
from django.shortcuts import get_object_or_404

from portfolio.models.holding import Holding
from portfolio.serializers.holding import HoldingSerializer


class HoldingGenericAPIView(generics.GenericAPIView):
    """
        Generic API View for Holding management.
    """
    serializer_class = HoldingSerializer

    def get(self, request: Request) -> Response:
        """
            list of holdings with filtering and pagination.
        """
        portfolio_id = request.query_params.get("portfolio")
        valuation_date = request.query_params.get("valuation_date")
        page = int(request.query_params.get("page", 1))
        rows = int(request.query_params.get("rows", 25))

        query = Q(pk__isnull=False)

        if portfolio_id:
            query &= Q(portfolio_id=portfolio_id)
        if valuation_date:
            query &= Q(valuation_date=valuation_date)

        holdings = Holding.objects.filter(query).select_related("portfolio").order_by(
            "-valuation_date", "asset_name"
        )

        paginator = Paginator(holdings, rows)
        try:
            holdings_page = paginator.page(page)
        except EmptyPage:
            holdings_page = paginator.page(paginator.num_pages)

        return Response(
            {
                "message": "Holdings fetched successfully",
                "holdings": self.serializer_class(holdings_page, many=True).data,
                "current_page": page,
                "last_page": paginator.num_pages,
                "total": paginator.count,
            },
            status=status.HTTP_200_OK,
        )


    def post(self, request: Request) -> Response:
        """
            Create a new holding.
        """
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            holding = serializer.save()
            
            return Response(
                {
                    "message": "Holding created successfully",
                    "holding": self.serializer_class(holding).data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {"message": "Validation error", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )


    def put(self, request: Request) -> Response:
        """Update a holding."""
        holding_id = request.data.get("id") or request.query_params.get("id")
        if not holding_id:
            return Response(
                {"message": "Holding ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        holding = get_object_or_404(Holding, pk=holding_id)
        serializer = self.serializer_class(holding, data=request.data, partial=True)
        if serializer.is_valid():
            holding = serializer.save()
            
            return Response(
                {
                    "message": "Holding updated successfully",
                    "holding": self.serializer_class(holding).data,
                },
                status=status.HTTP_200_OK,
            )
        return Response(
            {"message": "Validation error", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request: Request) -> Response:
        """Delete a holding."""
        holding_id = request.query_params.get("id")
        if not holding_id:
            return Response(
                {"message": "Holding ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        holding = get_object_or_404(Holding, pk=holding_id)
        holding.delete()
        return Response(
            {"message": "Holding deleted successfully"},
            status=status.HTTP_200_OK,
        )

