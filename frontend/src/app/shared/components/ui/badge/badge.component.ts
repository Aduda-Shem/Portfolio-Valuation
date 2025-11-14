import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { STATUS_COLORS } from '../../../../core/utils/constants';

/**
 * Badge Component
 * Reusable badge component for displaying status labels
 */
@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="getBadgeClasses()">
      {{ label }}
    </span>
  `,
})
export class BadgeComponent {
  @Input() label: string = '';
  @Input() variant?: 'DRAFT' | 'CONFIRMED' | 'ARCHIVED' | 'primary' | 'success' | 'warning' | 'error';
  @Input() className?: string;

  getBadgeClasses(): string {
    const baseClasses = 'badge badge-sm font-medium border';
    
    if (this.variant && STATUS_COLORS[this.variant]) {
      return `${baseClasses} ${STATUS_COLORS[this.variant]} ${this.className || ''}`;
    }

    const variantClasses: Record<string, string> = {
      primary: 'bg-[#003781] text-white border-transparent',
      success: 'bg-green-600 text-white border-transparent',
      warning: 'bg-yellow-500 text-white border-transparent',
      error: 'bg-red-600 text-white border-transparent',
    };

    return `${baseClasses} ${variantClasses[this.variant || 'primary']} ${this.className || ''}`;
  }
}

