import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Holding } from '../../../../models/holding.model';
import { ButtonComponent } from '../../ui/button/button.component';
import { BadgeComponent } from '../../ui/badge/badge.component';
import { Formatters } from '../../../../core/utils/formatters';

/**
 * Holdings Table Component
 * Displays holdings in a table format
 */
@Component({
  selector: 'app-holdings-table',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, BadgeComponent],
  templateUrl: './holdings-table.component.html',
})
export class HoldingsTableComponent {
  @Input() holdings: Holding[] = [];
  @Input() showPortfolio: boolean = false;
  @Output() onDelete = new EventEmitter<number>();

  Formatters = Formatters;
}

