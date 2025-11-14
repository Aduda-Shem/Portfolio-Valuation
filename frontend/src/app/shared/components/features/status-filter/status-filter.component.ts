import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Status Filter Component
 * Reusable status filter dropdown
 */
@Component({
  selector: 'app-status-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './status-filter.component.html',
})
export class StatusFilterComponent {
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.valueChange.emit(target.value);
  }
}

