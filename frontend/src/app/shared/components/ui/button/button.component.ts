import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Button Component
 * Reusable button component following DRY and Single Responsibility principles
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled: boolean = false;
  @Output() onClick = new EventEmitter<Event>();

  getButtonClasses(): string {
    const baseClasses = 'btn font-medium transition-colors';
    const variantClasses = {
      primary: 'btn-primary bg-[#003781] hover:bg-[#002d5f] text-white',
      secondary: 'btn-secondary bg-gray-200 hover:bg-gray-300 text-gray-900',
      danger: 'btn-error bg-red-600 hover:bg-red-700 text-white',
      ghost: 'btn-ghost hover:bg-gray-100 text-gray-700',
    };
    const sizeClasses = {
      sm: 'btn-sm',
      md: 'btn-md',
      lg: 'btn-lg',
    };

    return `${baseClasses} ${variantClasses[this.variant]} ${sizeClasses[this.size]}`;
  }
}

