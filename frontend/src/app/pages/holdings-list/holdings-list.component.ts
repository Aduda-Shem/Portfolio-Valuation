import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { HoldingQuery } from '../../core/stores/holding.query';
import { HoldingService } from '../../core/stores/holding.service';
import { Holding } from '../../models/holding.model';
import { PageHeaderComponent } from '../../shared/components/features/page-header/page-header.component';
import { ErrorAlertComponent } from '../../shared/components/features/error-alert/error-alert.component';
import { EmptyStateComponent } from '../../shared/components/cards/empty-state/empty-state.component';
import { HoldingsTableComponent } from '../../shared/components/tables/holdings-table/holdings-table.component';
import { LoadingSpinnerComponent } from '../../shared/components/ui/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from '../../shared/components/ui/confirm-dialog/confirm-dialog.component';

/**
 * Holdings List Component
 * Displays all holdings across all portfolios
 */
@Component({
  selector: 'app-holdings-list',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    ErrorAlertComponent,
    EmptyStateComponent,
    HoldingsTableComponent,
    LoadingSpinnerComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './holdings-list.component.html',
})
export class HoldingsListComponent implements OnInit {
  holdings$!: Observable<Holding[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  deleteConfirm = { isOpen: false, id: null as number | null };

  constructor(
    private holdingQuery: HoldingQuery,
    private holdingService: HoldingService
  ) {
    this.holdings$ = this.holdingQuery.holdings$;
    this.loading$ = this.holdingQuery.loading$;
    this.error$ = this.holdingQuery.error$;
  }

  ngOnInit(): void {
    this.holdingService.getAll();
  }

  handleDeleteClick(id: number): void {
    this.deleteConfirm = { isOpen: true, id };
  }

  handleDeleteConfirm(): void {
    if (this.deleteConfirm.id) {
      this.holdingService.delete(this.deleteConfirm.id);
      this.holdingService.getAll();
      this.deleteConfirm = { isOpen: false, id: null };
    }
  }

  handleDeleteCancel(): void {
    this.deleteConfirm = { isOpen: false, id: null };
  }
}

