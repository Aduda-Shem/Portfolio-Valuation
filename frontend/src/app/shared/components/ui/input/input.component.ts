import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

/**
 * Input Component
 * Reusable input component with label and form integration
 */
@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-control">
      <label *ngIf="label" class="label">
        <span class="label-text font-medium text-gray-700">{{ label }}</span>
        <span *ngIf="required" class="label-text-alt text-red-500">*</span>
      </label>
      <input
        [type]="type"
        [placeholder]="placeholder || ''"
        [required]="required"
        [min]="min"
        [max]="max"
        [step]="step"
        [value]="value"
        [disabled]="disabled"
        (input)="onInput($event)"
        (blur)="onBlur()"
        class="input input-bordered w-full bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003781] focus:border-[#003781]"
        [class.input-error]="hasError"
      />
      <label *ngIf="error" class="label">
        <span class="label-text-alt text-red-500">{{ error }}</span>
      </label>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() type: string = 'text';
  @Input() placeholder?: string;
  @Input() required: boolean = false;
  @Input() min?: string | number;
  @Input() max?: string | number;
  @Input() step?: string | number;
  @Input() disabled: boolean = false;
  @Input() error?: string;

  value: string = '';
  hasError: boolean = false;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.hasError = !!this.error;
  }

  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

