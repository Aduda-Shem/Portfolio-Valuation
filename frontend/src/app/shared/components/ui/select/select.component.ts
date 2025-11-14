import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Select Component
 * Reusable select dropdown component
 */
@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-control">
      <label *ngIf="label" class="label">
        <span class="label-text font-medium text-gray-700">{{ label }}</span>
        <span *ngIf="required" class="label-text-alt text-red-500">*</span>
      </label>
      <select
        [value]="value"
        [required]="required"
        [disabled]="disabled"
        (change)="onChange($event)"
        (blur)="onBlur()"
        class="select select-bordered w-full bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003781] focus:border-[#003781]"
        [class.select-error]="hasError"
      >
        <option [value]="''" disabled>{{ placeholder || 'Select an option' }}</option>
        <option *ngFor="let option of options" [value]="option.value">
          {{ option.label }}
        </option>
      </select>
      <label *ngIf="error" class="label">
        <span class="label-text-alt text-red-500">{{ error }}</span>
      </label>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() options: SelectOption[] = [];
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() error?: string;

  value: string = '';
  hasError: boolean = false;

  private onChangeCallback = (value: string) => {};
  private onTouchedCallback = () => {};

  onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.onChangeCallback(this.value);
    this.hasError = !!this.error;
  }

  onBlur(): void {
    this.onTouchedCallback();
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

