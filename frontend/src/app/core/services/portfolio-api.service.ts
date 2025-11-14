import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Portfolio, CreatePortfolioRequest, UpdatePortfolioRequest } from '../../models/portfolio.model';
import { ApiResponse } from '../../models/api-response.model';

/**
 * Portfolio API Service
 */
@Injectable({
  providedIn: 'root'
})
export class PortfolioApiService extends BaseApiService {
  getAll(search?: string): Observable<Portfolio[]> {
    const params: Record<string, string | number> | undefined = search ? { search } : undefined;
    return this.get<ApiResponse<Portfolio>>('/portfolios/', params).pipe(
      map((response: ApiResponse<Portfolio>) => response.portfolios || [])
    );
  }

  getById(id: number): Observable<Portfolio> {
    return this.get<ApiResponse<Portfolio>>(`/portfolios/detail/?id=${id}`).pipe(
      map((response: ApiResponse<Portfolio>) => response.portfolio!)
    );
  }

  create(data: CreatePortfolioRequest): Observable<Portfolio> {
    return this.post<ApiResponse<Portfolio>>('/portfolios/', data).pipe(
      map((response: ApiResponse<Portfolio>) => response.portfolio!)
    );
  }

  update(id: number, data: Partial<CreatePortfolioRequest>): Observable<Portfolio> {
    return this.put<ApiResponse<Portfolio>>(`/portfolios/detail/`, { ...data, id }).pipe(
      map((response: ApiResponse<Portfolio>) => response.portfolio!)
    );
  }

  deleteById(id: number): Observable<void> {
    return this.delete<ApiResponse<void>>(`/portfolios/detail/?id=${id}`).pipe(
      map(() => undefined)
    );
  }

  getStatistics(id: number): Observable<any> {
    return this.get<ApiResponse<any>>(`/portfolios/statistics/?id=${id}`).pipe(
      map((response: ApiResponse<any>) => response.statistics)
    );
  }
}

