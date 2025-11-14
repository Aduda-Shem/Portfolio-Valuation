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
  templateUrl: './confirm-dialog.component.html',
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

