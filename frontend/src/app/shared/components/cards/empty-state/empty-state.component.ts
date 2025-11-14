import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Empty State Component
 * Displays empty state message when no data is available
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.component.html',
})
export class EmptyStateComponent {
  @Input() message: string = 'No data found';
  @Input() description?: string;
}

