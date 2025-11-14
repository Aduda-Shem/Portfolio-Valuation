import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { ValuationSnapshot, CreateValuationRequest, UpdateValuationRequest, UpdateValuationStatusRequest } from '../../models/valuation.model';
import { ApiResponse } from '../../models/api-response.model';

/**
 * Valuation API Service
 */
@Injectable({
  providedIn: 'root'
})
export class ValuationApiService extends BaseApiService {
  getAll(portfolioId?: number, status?: string, snapshotDate?: string): Observable<ValuationSnapshot[]> {
    const params: Record<string, string | number> = {};
    if (portfolioId) params['portfolio'] = portfolioId;
    if (status) params['status'] = status;
    if (snapshotDate) params['snapshot_date'] = snapshotDate;

    return this.get<ApiResponse<ValuationSnapshot>>('/valuations/', params).pipe(
      map((response: ApiResponse<ValuationSnapshot>) => response.valuations || [])
    );
  }

  getById(id: number): Observable<ValuationSnapshot> {
    return this.get<ApiResponse<ValuationSnapshot>>(`/valuations/?id=${id}`).pipe(
      map((response: ApiResponse<ValuationSnapshot>) => response.valuation!)
    );
  }

  create(data: CreateValuationRequest): Observable<ValuationSnapshot> {
    return this.post<ApiResponse<ValuationSnapshot>>('/valuations/', data).pipe(
      map((response: ApiResponse<ValuationSnapshot>) => response.valuation!)
    );
  }

  update(id: number, data: Partial<CreateValuationRequest>): Observable<ValuationSnapshot> {
    return this.put<ApiResponse<ValuationSnapshot>>(`/valuations/`, { ...data, id }).pipe(
      map((response: ApiResponse<ValuationSnapshot>) => response.valuation!)
    );
  }

  deleteById(id: number): Observable<void> {
    return this.delete<ApiResponse<void>>(`/valuations/?id=${id}`).pipe(
      map(() => undefined)
    );
  }

  recalculate(id: number): Observable<ValuationSnapshot> {
    return this.post<ApiResponse<ValuationSnapshot>>(`/valuations/recalculate/?id=${id}`, {}).pipe(
      map((response: ApiResponse<ValuationSnapshot>) => response.valuation!)
    );
  }

  updateStatus(id: number, status: string): Observable<ValuationSnapshot> {
    return this.patch<ApiResponse<ValuationSnapshot>>(`/valuations/update-status/?id=${id}`, { status }).pipe(
      map((response: ApiResponse<ValuationSnapshot>) => response.valuation!)
    );
  }
}

