"""
Portfolio Views
"""
from typing import Any
from drf_yasg import openapi
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.request import Request
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage
from django.shortcuts import get_object_or_404

from portfolio.models.portfolio import Portfolio
from portfolio.serializers.portfolio import PortfolioSerializer, PortfolioDetailSerializer
from portfolio.services import PortfolioService


class PortfolioGenericAPIView(generics.GenericAPIView):
    """Generic API View for Portfolio management."""
    serializer_class = PortfolioSerializer

    def get(self, request: Request) -> Response:
        """Get list of portfolios with optional search and pagination."""
        search = request.query_params.get("search")
        page = int(request.query_params.get("page", 1))
        rows = int(request.query_params.get("rows", 25))

        query = Q(pk__isnull=False)

        if search:
            query &= Q(
                Q(name__icontains=search)
                | Q(client_name__icontains=search)
                | Q(client_email__icontains=search)
            )

        portfolios = Portfolio.objects.filter(query).order_by("-created_at")

        paginator = Paginator(portfolios, rows)
        try:
            portfolios_page = paginator.page(page)
        except EmptyPage:
            portfolios_page = paginator.page(paginator.num_pages)

        return Response(
            {
                "message": "Portfolios fetched successfully",
                "portfolios": self.serializer_class(portfolios_page, many=True).data,
                "current_page": page,
                "last_page": paginator.num_pages,
                "total": paginator.count,
            },
            status=status.HTTP_200_OK,
        )


    def post(self, request: Request) -> Response:
        """Create a new portfolio."""
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            # Create portfolio instance and set fields one by one
            portfolio = Portfolio()
            portfolio.name = request.data.get("name")
            portfolio.client_name = request.data.get("client_name")
            portfolio.client_email = request.data.get("client_email")
            portfolio.description = request.data.get("description", "")
            portfolio.save()
            
            return Response(
                {
                    "message": "Portfolio created successfully",
                    "portfolio": self.serializer_class(portfolio).data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {"message": "Validation error", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )


class PortfolioDetailGenericAPIView(generics.GenericAPIView):
    """Generic API View for Portfolio detail operations."""
    serializer_class = PortfolioDetailSerializer

    def get(self, request: Request) -> Response:
        """Get portfolio details with holdings and valuations."""
        portfolio_id = request.query_params.get("id")
        if not portfolio_id:
            return Response(
                {"message": "Portfolio ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        portfolio = get_object_or_404(Portfolio, pk=portfolio_id)
        return Response(
            {
                "message": "Portfolio fetched successfully",
                "portfolio": self.serializer_class(portfolio).data,
            },
            status=status.HTTP_200_OK,
        )

    def put(self, request: Request) -> Response:
        """Update a portfolio."""
        portfolio_id = request.data.get("id") or request.query_params.get("id")
        if not portfolio_id:
            return Response(
                {"message": "Portfolio ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        portfolio = get_object_or_404(Portfolio, pk=portfolio_id)
        serializer = PortfolioSerializer(portfolio, data=request.data, partial=True)
        if serializer.is_valid():
            # Update portfolio fields one by one
            if "name" in request.data:
                portfolio.name = request.data.get("name")
            if "client_name" in request.data:
                portfolio.client_name = request.data.get("client_name")
            if "client_email" in request.data:
                portfolio.client_email = request.data.get("client_email")
            if "description" in request.data:
                portfolio.description = request.data.get("description", "")
            portfolio.save()
            
            return Response(
                {
                    "message": "Portfolio updated successfully",
                    "portfolio": PortfolioSerializer(portfolio).data,
                },
                status=status.HTTP_200_OK,
            )
        return Response(
            {"message": "Validation error", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request: Request) -> Response:
        """Delete a portfolio."""
        portfolio_id = request.query_params.get("id")
        if not portfolio_id:
            return Response(
                {"message": "Portfolio ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        portfolio = get_object_or_404(Portfolio, pk=portfolio_id)
        portfolio.delete()
        return Response(
            {"message": "Portfolio deleted successfully"},
            status=status.HTTP_200_OK,
        )


class PortfolioStatisticsGenericAPIView(generics.GenericAPIView):
    """Generic API View for Portfolio statistics."""

    def get(self, request: Request) -> Response:
        """Get statistics for a portfolio."""
        portfolio_id = request.query_params.get("id")
        if not portfolio_id:
            return Response(
                {"message": "Portfolio ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        portfolio = get_object_or_404(Portfolio, pk=portfolio_id)
        stats = PortfolioService.get_portfolio_statistics(portfolio)
        return Response(
            {
                "message": "Portfolio statistics fetched successfully",
                "statistics": stats,
            },
            status=status.HTTP_200_OK,
        )

