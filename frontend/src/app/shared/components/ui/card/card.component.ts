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
  templateUrl: './card.component.html',
})
export class CardComponent {
  @Input() className?: string;
}

