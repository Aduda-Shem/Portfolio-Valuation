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
  templateUrl: './valuations-table.component.html',
})
export class ValuationsTableComponent {
  @Input() valuations: ValuationSnapshot[] = [];
  @Input() showPortfolio: boolean = false;
  @Output() onRecalculate = new EventEmitter<number>();
  @Output() onUpdateStatus = new EventEmitter<{ id: number; status: ValuationStatus }>();

  Formatters = Formatters;
}

