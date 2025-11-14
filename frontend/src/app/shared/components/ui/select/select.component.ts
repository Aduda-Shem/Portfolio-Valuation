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
  templateUrl: './select.component.html',
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

