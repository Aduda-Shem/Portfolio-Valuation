import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { PortfolioQuery } from '../../core/stores/portfolio.query';
import { PortfolioService } from '../../core/stores/portfolio.service';
import { Portfolio } from '../../models/portfolio.model';
import { PageHeaderComponent } from '../../shared/components/features/page-header/page-header.component';
import { SearchInputComponent } from '../../shared/components/features/search-input/search-input.component';
import { ErrorAlertComponent } from '../../shared/components/features/error-alert/error-alert.component';
import { PortfolioCardComponent } from '../../shared/components/cards/portfolio-card/portfolio-card.component';
import { EmptyStateComponent } from '../../shared/components/cards/empty-state/empty-state.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { PortfolioFormComponent } from '../../shared/components/forms/portfolio-form/portfolio-form.component';
import { ConfirmDialogComponent } from '../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import { LoadingSpinnerComponent } from '../../shared/components/ui/loading-spinner/loading-spinner.component';
import { CreatePortfolioRequest } from '../../models/portfolio.model';

/**
 * Portfolio List Component
 * Displays a list of all portfolios with search and create functionality
 */
@Component({
  selector: 'app-portfolio-list',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    SearchInputComponent,
    ErrorAlertComponent,
    PortfolioCardComponent,
    EmptyStateComponent,
    ButtonComponent,
    PortfolioFormComponent,
    ConfirmDialogComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './portfolio-list.component.html',
})
export class PortfolioListComponent implements OnInit, OnDestroy {
  portfolios$!: Observable<Portfolio[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  showForm: boolean = false;
  searchTerm: string = '';
  deleteConfirm = { isOpen: false, id: null as number | null };

  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  constructor(
    private portfolioQuery: PortfolioQuery,
    private portfolioService: PortfolioService
  ) {
    this.portfolios$ = this.portfolioQuery.portfolios$;
    this.loading$ = this.portfolioQuery.loading$;
    this.error$ = this.portfolioQuery.error$;
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(search => {
      this.portfolioService.getAll(search || undefined);
    });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.portfolioService.getAll();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.searchSubject.next(value);
  }

  handleCreate(data: CreatePortfolioRequest): void {
    this.portfolioService.create(data);
    this.showForm = false;
    this.portfolioService.getAll();
  }

  handleDeleteClick(id: number): void {
    this.deleteConfirm = { isOpen: true, id };
  }

  handleDeleteConfirm(): void {
    if (this.deleteConfirm.id) {
      this.portfolioService.delete(this.deleteConfirm.id);
      this.portfolioService.getAll();
      this.deleteConfirm = { isOpen: false, id: null };
    }
  }

  handleDeleteCancel(): void {
    this.deleteConfirm = { isOpen: false, id: null };
  }
}

