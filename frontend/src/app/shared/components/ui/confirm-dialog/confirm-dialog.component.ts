import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

/**
 * Confirm Dialog Component
 * Reusable confirmation dialog component
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" (click)="handleCancel()">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" (click)="$event.stopPropagation()">
        <div class="p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-2">{{ title }}</h3>
          <p class="text-gray-600 mb-6">{{ message }}</p>
          <div class="flex justify-end gap-2">
            <app-button variant="ghost" (onClick)="handleCancel()">
              {{ cancelText }}
            </app-button>
            <app-button [variant]="variant === 'danger' ? 'danger' : 'primary'" (onClick)="handleConfirm()">
              {{ confirmText }}
            </app-button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmDialogComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = 'Confirm';
  @Input() message: string = '';
  @Input() confirmText: string = 'Confirm';
  @Input() cancelText: string = 'Cancel';
  @Input() variant: 'primary' | 'danger' = 'primary';
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  handleConfirm(): void {
    this.onConfirm.emit();
  }

  handleCancel(): void {
    this.onCancel.emit();
  }
}

