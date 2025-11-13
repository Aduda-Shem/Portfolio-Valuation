"""
URL configuration for Portfolio Valuation project.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from typing import List
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="Portfolio Valuation API",
        default_version="v1",
        description="API for managing investment portfolios, holdings, and valuation snapshots",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@portfolio.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns: List = [
    path("admin/", admin.site.urls),
    path("api/v1/", include("portfolio.urls")),
    # Swagger documentation
    re_path(
        r"^swagger(?P<format>\.json|\.yaml)$",
        schema_view.without_ui(cache_timeout=0),
        name="schema-json",
    ),
    re_path(
        r"^swagger/$",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    re_path(
        r"^redoc/$",
        schema_view.with_ui("redoc", cache_timeout=0),
        name="schema-redoc",
    ),
]

