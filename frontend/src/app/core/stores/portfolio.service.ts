import { Injectable } from '@angular/core';
import { PortfolioStore } from './portfolio.store';
import { PortfolioApiService } from '../services/portfolio-api.service';
import { Portfolio, CreatePortfolioRequest } from '../../models/portfolio.model';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';

/**
 * Portfolio Service
 * Business logic layer for portfolio operations
 */
@Injectable({ providedIn: 'root' })
export class PortfolioService {
  constructor(
    private portfolioStore: PortfolioStore,
    private portfolioApi: PortfolioApiService
  ) {}

  getAll(search?: string): void {
    this.portfolioStore.setLoading(true);
    this.portfolioStore.setErrorState(null);

    this.portfolioApi.getAll(search).pipe(
      tap(portfolios => {
        this.portfolioStore.set(portfolios);
        this.portfolioStore.setLoading(false);
      }),
      catchError(error => {
        this.portfolioStore.setErrorState(error.message || 'Failed to fetch portfolios');
        this.portfolioStore.setLoading(false);
        return throwError(() => error);
      })
    ).subscribe();
  }

  getById(id: number): void {
    this.portfolioStore.setLoading(true);
    this.portfolioStore.setErrorState(null);

    this.portfolioApi.getById(id).pipe(
      tap(portfolio => {
        this.portfolioStore.upsert(portfolio.id, portfolio);
        this.portfolioStore.setCurrentPortfolio(portfolio);
        this.portfolioStore.setLoading(false);
      }),
      catchError(error => {
        this.portfolioStore.setError(error.message || 'Failed to fetch portfolio');
        this.portfolioStore.setLoading(false);
        return throwError(() => error);
      })
    ).subscribe();
  }

  create(data: CreatePortfolioRequest): void {
    this.portfolioStore.setErrorState(null);

    this.portfolioApi.create(data).pipe(
      tap(portfolio => {
        this.portfolioStore.add(portfolio);
      }),
      catchError(error => {
        this.portfolioStore.setError(error.message || 'Failed to create portfolio');
        return throwError(() => error);
      })
    ).subscribe();
  }

  update(id: number, data: Partial<CreatePortfolioRequest>): void {
    this.portfolioStore.setErrorState(null);

    this.portfolioApi.update(id, data).pipe(
      tap(portfolio => {
        this.portfolioStore.update(id, portfolio);
        const currentPortfolio = this.portfolioStore.getValue().currentPortfolio;
        if (currentPortfolio?.id === id) {
          this.portfolioStore.setCurrentPortfolio(portfolio);
        }
      }),
      catchError(error => {
        this.portfolioStore.setError(error.message || 'Failed to update portfolio');
        return throwError(() => error);
      })
    ).subscribe();
  }

  delete(id: number): void {
    this.portfolioStore.setErrorState(null);

    this.portfolioApi.deleteById(id).pipe(
      tap(() => {
        this.portfolioStore.remove(id);
        const currentPortfolio = this.portfolioStore.getValue().currentPortfolio;
        if (currentPortfolio?.id === id) {
          this.portfolioStore.clearCurrentPortfolio();
        }
      }),
      catchError(error => {
        this.portfolioStore.setErrorState(error.message || 'Failed to delete portfolio');
        return throwError(() => error);
      })
    ).subscribe();
  }
}

