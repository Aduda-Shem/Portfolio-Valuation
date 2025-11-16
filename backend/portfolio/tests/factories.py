"""
Factory Boy factories for Portfolio models.
"""
import factory

from portfolio.models import Portfolio, Holding, ValuationSnapshot


class PortfolioFactory(factory.django.DjangoModelFactory):
    """Factory for Portfolio model."""

    class Meta:
        model = Portfolio

    name = factory.Faker("company")
    client_name = factory.Faker("name")
    client_email = factory.Faker("email")
    description = factory.Faker("text", max_nb_chars=200)


class HoldingFactory(factory.django.DjangoModelFactory):
    """Factory for Holding model."""

    class Meta:
        model = Holding

    portfolio = factory.SubFactory(PortfolioFactory)
    asset_name = factory.Faker("company")
    asset_type = factory.Iterator([choice[0] for choice in Holding.ASSET_TYPE_CHOICES])
    quantity = factory.Faker("pydecimal", left_digits=5, right_digits=2, positive=True)
    unit_price = factory.Faker("pydecimal", left_digits=6, right_digits=2, positive=True)
    valuation_date = factory.Faker("date_between", start_date="-1y", end_date="today")


class ValuationSnapshotFactory(factory.django.DjangoModelFactory):
    """Factory for ValuationSnapshot model."""

    class Meta:
        model = ValuationSnapshot

    portfolio = factory.SubFactory(PortfolioFactory)
    snapshot_date = factory.Faker("date_between", start_date="-1y", end_date="today")
    status = factory.Iterator([choice[0] for choice in ValuationSnapshot.STATUS_CHOICES])
    total_aum = factory.Faker("pydecimal", left_digits=10, right_digits=2, positive=True)
    notes = factory.Faker("text", max_nb_chars=500)

