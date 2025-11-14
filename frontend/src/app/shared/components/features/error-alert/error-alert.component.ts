import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Error Alert Component
 * Displays error messages
 */
@Component({
  selector: 'app-error-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-alert.component.html',
})
export class ErrorAlertComponent {
  @Input() message?: string | null;
}

