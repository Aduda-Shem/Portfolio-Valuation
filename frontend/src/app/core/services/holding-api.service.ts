import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Holding, CreateHoldingRequest, UpdateHoldingRequest } from '../../models/holding.model';
import { ApiResponse } from '../../models/api-response.model';

/**
 * Holding API Service
 */
@Injectable({
  providedIn: 'root'
})
export class HoldingApiService extends BaseApiService {
  getAll(portfolioId?: number, valuationDate?: string): Observable<Holding[]> {
    const params: Record<string, string | number> = {};
    if (portfolioId) params['portfolio'] = portfolioId;
    if (valuationDate) params['valuation_date'] = valuationDate;

    return this.get<ApiResponse<Holding>>('/holdings/', params).pipe(
      map((response: ApiResponse<Holding>) => response.holdings || [])
    );
  }

  getById(id: number): Observable<Holding> {
    return this.get<ApiResponse<Holding>>(`/holdings/?id=${id}`).pipe(
      map((response: ApiResponse<Holding>) => response.holding!)
    );
  }

  create(data: CreateHoldingRequest): Observable<Holding> {
    return this.post<ApiResponse<Holding>>('/holdings/', data).pipe(
      map((response: ApiResponse<Holding>) => response.holding!)
    );
  }

  update(id: number, data: Partial<CreateHoldingRequest>): Observable<Holding> {
    return this.put<ApiResponse<Holding>>(`/holdings/`, { ...data, id }).pipe(
      map((response: ApiResponse<Holding>) => response.holding!)
    );
  }

  deleteById(id: number): Observable<void> {
    return this.delete<ApiResponse<void>>(`/holdings/?id=${id}`).pipe(
      map(() => undefined)
    );
  }
}

