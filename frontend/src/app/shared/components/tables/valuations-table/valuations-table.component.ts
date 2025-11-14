import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ValuationSnapshot, ValuationStatus } from '../../../../models/valuation.model';
import { ButtonComponent } from '../../ui/button/button.component';
import { BadgeComponent } from '../../ui/badge/badge.component';
import { Formatters } from '../../../../core/utils/formatters';

/**
 * Valuations Table Component
 * Displays valuation snapshots in a table format
 */
@Component({
  selector: 'app-valuations-table',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, BadgeComponent],
  template: `
    <div class="card bg-white shadow-sm border border-gray-200">
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead class="bg-gray-50">
            <tr>
              <th *ngIf="showPortfolio" class="text-left font-semibold text-gray-700">Portfolio</th>
              <th class="text-left font-semibold text-gray-700">Date</th>
              <th class="text-left font-semibold text-gray-700">Status</th>
              <th class="text-left font-semibold text-gray-700">Total AUM</th>
              <th class="text-left font-semibold text-gray-700">Created</th>
              <th class="text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let valuation of valuations" class="hover:bg-gray-50">
              <td *ngIf="showPortfolio" class="text-gray-900">
                <a [routerLink]="['/portfolios', valuation.portfolio]" class="hover:text-[#003781] font-semibold">
                  {{ valuation.portfolio_name || 'Portfolio ' + valuation.portfolio }}
                </a>
              </td>
              <td class="font-medium text-gray-700">{{ Formatters.formatDate(valuation.snapshot_date) }}</td>
              <td>
                <app-badge [label]="valuation.status" [variant]="valuation.status"></app-badge>
              </td>
              <td class="font-bold text-gray-900">
                {{ valuation.total_aum ? Formatters.formatCurrency(valuation.total_aum) : 'N/A' }}
              </td>
              <td class="text-sm text-gray-600">{{ Formatters.formatDate(valuation.created_at) }}</td>
              <td>
                <div class="flex gap-2">
                  <app-button *ngIf="onRecalculate" variant="ghost" size="sm" (onClick)="onRecalculate.emit(valuation.id)">
                    Recalculate
                  </app-button>
                  <app-button 
                    *ngIf="onUpdateStatus && valuation.status === 'DRAFT'" 
                    variant="primary" 
                    size="sm" 
                    (onClick)="onUpdateStatus.emit({ id: valuation.id, status: 'CONFIRMED' })"
                  >
                    Confirm
                  </app-button>
                  <app-button 
                    *ngIf="onUpdateStatus && valuation.status === 'CONFIRMED'" 
                    variant="ghost" 
                    size="sm" 
                    (onClick)="onUpdateStatus.emit({ id: valuation.id, status: 'ARCHIVED' })"
                  >
                    Archive
                  </app-button>
                  <app-button *ngIf="showPortfolio" size="sm" [routerLink]="['/portfolios', valuation.portfolio]">
                    View
                  </app-button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class ValuationsTableComponent {
  @Input() valuations: ValuationSnapshot[] = [];
  @Input() showPortfolio: boolean = false;
  @Output() onRecalculate = new EventEmitter<number>();
  @Output() onUpdateStatus = new EventEmitter<{ id: number; status: ValuationStatus }>();

  Formatters = Formatters;
}

