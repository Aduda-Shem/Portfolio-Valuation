import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Loading Spinner Component
 * Reusable loading indicator component
 */
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getContainerClasses()">
      <span class="loading loading-spinner loading-lg"></span>
      <p *ngIf="message" class="mt-4 text-gray-600">{{ message }}</p>
    </div>
  `,
})
export class LoadingSpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'lg';
  @Input() fullHeight: boolean = true;
  @Input() message?: string;

  getContainerClasses(): string {
    const baseClasses = 'flex flex-col items-center justify-center';
    const heightClass = this.fullHeight ? 'min-h-screen' : 'py-8';
    return `${baseClasses} ${heightClass}`;
  }
}

