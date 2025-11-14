import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { PortfolioQuery } from '../../core/stores/portfolio.query';
import { PortfolioService } from '../../core/stores/portfolio.service';
import { HoldingQuery } from '../../core/stores/holding.query';
import { HoldingService } from '../../core/stores/holding.service';
import { ValuationQuery } from '../../core/stores/valuation.query';
import { ValuationService } from '../../core/stores/valuation.service';
import { Portfolio } from '../../models/portfolio.model';
import { Holding } from '../../models/holding.model';
import { ValuationSnapshot, ValuationStatus } from '../../models/valuation.model';
import { PageHeaderComponent } from '../../shared/components/features/page-header/page-header.component';
import { ErrorAlertComponent } from '../../shared/components/features/error-alert/error-alert.component';
import { EmptyStateComponent } from '../../shared/components/cards/empty-state/empty-state.component';
import { CardComponent } from '../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { LoadingSpinnerComponent } from '../../shared/components/ui/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from '../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import { HoldingsTableComponent } from '../../shared/components/tables/holdings-table/holdings-table.component';
import { ValuationsTableComponent } from '../../shared/components/tables/valuations-table/valuations-table.component';
import { HoldingFormComponent } from '../../shared/components/forms/holding-form/holding-form.component';
import { CreateHoldingRequest } from '../../models/holding.model';
import { CreateValuationRequest } from '../../models/valuation.model';

/**
 * Portfolio Detail Component
 * Displays detailed information about a portfolio including holdings and valuations
 */
@Component({
  selector: 'app-portfolio-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PageHeaderComponent,
    ErrorAlertComponent,
    EmptyStateComponent,
    CardComponent,
    ButtonComponent,
    LoadingSpinnerComponent,
    ConfirmDialogComponent,
    HoldingsTableComponent,
    ValuationsTableComponent,
    HoldingFormComponent,
  ],
  templateUrl: './portfolio-detail.component.html',
})
export class PortfolioDetailComponent implements OnInit {
  portfolioId: number = 0;
  currentPortfolio$!: Observable<Portfolio | null>;
  portfolioLoading$!: Observable<boolean>;
  holdings$!: Observable<Holding[]>;
  holdingsLoading$!: Observable<boolean>;
  valuations$!: Observable<ValuationSnapshot[]>;
  valuationsLoading$!: Observable<boolean>;

  showHoldingForm: boolean = false;
  valuationDate: string = new Date().toISOString().split('T')[0];
  deleteConfirm = { isOpen: false, id: null as number | null };

  constructor(
    private route: ActivatedRoute,
    private portfolioQuery: PortfolioQuery,
    private portfolioService: PortfolioService,
    private holdingQuery: HoldingQuery,
    private holdingService: HoldingService,
    private valuationQuery: ValuationQuery,
    private valuationService: ValuationService
  ) {
    this.currentPortfolio$ = this.portfolioQuery.currentPortfolio$;
    this.portfolioLoading$ = this.portfolioQuery.loading$;
    this.holdings$ = this.holdingQuery.holdings$;
    this.holdingsLoading$ = this.holdingQuery.loading$;
    this.valuations$ = this.valuationQuery.valuations$;
    this.valuationsLoading$ = this.valuationQuery.loading$;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.portfolioId = +params['id'];
      if (this.portfolioId) {
        this.portfolioService.getById(this.portfolioId);
        this.holdingService.getAll(this.portfolioId);
        this.valuationService.getAll(this.portfolioId);
      }
    });
  }

  toggleHoldingForm(): void {
    this.showHoldingForm = !this.showHoldingForm;
  }

  handleCreateHolding(data: CreateHoldingRequest): void {
    this.holdingService.create(data);
    this.showHoldingForm = false;
    this.holdingService.getAll(this.portfolioId);
  }

  handleDeleteHoldingClick(id: number): void {
    this.deleteConfirm = { isOpen: true, id };
  }

  handleDeleteHoldingConfirm(): void {
    if (this.deleteConfirm.id) {
      this.holdingService.delete(this.deleteConfirm.id);
      this.holdingService.getAll(this.portfolioId);
      this.deleteConfirm = { isOpen: false, id: null };
    }
  }

  handleDeleteHoldingCancel(): void {
    this.deleteConfirm = { isOpen: false, id: null };
  }

  handleCreateValuation(): void {
    const data: CreateValuationRequest = {
      portfolio: this.portfolioId,
      snapshot_date: this.valuationDate,
      status: 'DRAFT',
    };
    this.valuationService.create(data);
    this.valuationService.getAll(this.portfolioId);
  }

  handleRecalculate(id: number): void {
    this.valuationService.recalculate(id);
    this.valuationService.getAll(this.portfolioId);
  }

  handleUpdateStatus(event: { id: number; status: ValuationStatus }): void {
    this.valuationService.updateStatus(event.id, event.status);
    this.valuationService.getAll(this.portfolioId);
  }
}

