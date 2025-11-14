import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ValuationQuery } from '../../core/stores/valuation.query';
import { ValuationService } from '../../core/stores/valuation.service';
import { ValuationSnapshot, ValuationStatus } from '../../models/valuation.model';
import { PageHeaderComponent } from '../../shared/components/features/page-header/page-header.component';
import { StatusFilterComponent } from '../../shared/components/features/status-filter/status-filter.component';
import { ErrorAlertComponent } from '../../shared/components/features/error-alert/error-alert.component';
import { EmptyStateComponent } from '../../shared/components/cards/empty-state/empty-state.component';
import { ValuationsTableComponent } from '../../shared/components/tables/valuations-table/valuations-table.component';
import { LoadingSpinnerComponent } from '../../shared/components/ui/loading-spinner/loading-spinner.component';

/**
 * Valuations List Component
 * Displays all valuation snapshots across all portfolios
 */
@Component({
  selector: 'app-valuations-list',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    StatusFilterComponent,
    ErrorAlertComponent,
    EmptyStateComponent,
    ValuationsTableComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './valuations-list.component.html',
})
export class ValuationsListComponent implements OnInit {
  valuations$!: Observable<ValuationSnapshot[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  statusFilter: string = '';

  constructor(
    private valuationQuery: ValuationQuery,
    private valuationService: ValuationService
  ) {
    this.valuations$ = this.valuationQuery.valuations$;
    this.loading$ = this.valuationQuery.loading$;
    this.error$ = this.valuationQuery.error$;
  }

  ngOnInit(): void {
    this.valuationService.getAll();
  }

  onStatusFilterChange(status: string): void {
    this.statusFilter = status;
    this.valuationService.getAll(undefined, status || undefined);
  }

  handleRecalculate(id: number): void {
    this.valuationService.recalculate(id);
    this.valuationService.getAll(undefined, this.statusFilter || undefined);
  }

  handleUpdateStatus(event: { id: number; status: ValuationStatus }): void {
    this.valuationService.updateStatus(event.id, event.status);
    this.valuationService.getAll(undefined, this.statusFilter || undefined);
  }
}

