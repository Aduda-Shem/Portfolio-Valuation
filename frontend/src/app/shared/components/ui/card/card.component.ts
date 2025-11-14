import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Card Component
 * Reusable card container component
 */
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'card bg-white shadow-sm border border-gray-200 ' + (className || '')">
      <div class="card-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class CardComponent {
  @Input() className?: string;
}

