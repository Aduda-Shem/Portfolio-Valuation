import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Holding, CreateHoldingRequest } from '../../../../models/holding.model';
import { ASSET_TYPES } from '../../../../core/utils/constants';
import { CardComponent } from '../../ui/card/card.component';
import { InputComponent } from '../../ui/input/input.component';
import { SelectComponent, SelectOption } from '../../ui/select/select.component';
import { ButtonComponent } from '../../ui/button/button.component';

/**
 * Holding Form Component
 * Form for creating or editing a holding
 */
@Component({
  selector: 'app-holding-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    InputComponent,
    SelectComponent,
    ButtonComponent,
  ],
  template: `
    <app-card>
      <h2 class="text-xl font-bold text-gray-900 mb-6">
        {{ holding ? 'Edit Holding' : 'Add New Holding' }}
      </h2>
      <form [formGroup]="form" (ngSubmit)="handleSubmit()">
        <div class="space-y-4">
          <app-input
            label="Asset Name"
            type="text"
            placeholder="e.g., Apple Inc."
            formControlName="asset_name"
            [required]="true"
          ></app-input>
          <app-select
            label="Asset Type"
            [options]="assetTypeOptions"
            formControlName="asset_type"
            [required]="true"
          ></app-select>
          <app-input
            label="Quantity"
            type="number"
            [step]="0.00000001"
            placeholder="0.00000000"
            formControlName="quantity"
            [required]="true"
            [min]="0"
          ></app-input>
          <app-input
            label="Unit Price"
            type="number"
            [step]="0.0001"
            placeholder="0.0000"
            formControlName="unit_price"
            [required]="true"
            [min]="0"
          ></app-input>
          <app-input
            label="Valuation Date"
            type="date"
            formControlName="valuation_date"
            [required]="true"
          ></app-input>
          <div class="flex justify-end gap-2 pt-4">
            <app-button type="button" variant="ghost" (onClick)="onCancel.emit()">
              Cancel
            </app-button>
            <app-button type="submit" [disabled]="form.invalid">
              {{ holding ? 'Update' : 'Add' }}
            </app-button>
          </div>
        </div>
      </form>
    </app-card>
  `,
})
export class HoldingFormComponent implements OnInit {
  @Input() holding?: Holding;
  @Input() portfolioId?: number;
  @Output() onSubmit = new EventEmitter<CreateHoldingRequest>();
  @Output() onCancel = new EventEmitter<void>();

  form: FormGroup;
  assetTypeOptions: SelectOption[] = ASSET_TYPES.map(type => ({
    value: type.value,
    label: type.label,
  }));

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      asset_name: ['', Validators.required],
      asset_type: ['STOCK', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0)]],
      unit_price: ['', [Validators.required, Validators.min(0)]],
      valuation_date: [new Date().toISOString().split('T')[0], Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.holding) {
      this.form.patchValue({
        asset_name: this.holding.asset_name,
        asset_type: this.holding.asset_type,
        quantity: this.holding.quantity,
        unit_price: this.holding.unit_price,
        valuation_date: this.holding.valuation_date,
      });
    }
  }

  handleSubmit(): void {
    if (this.form.valid && (this.portfolioId || this.holding?.portfolio)) {
      const formValue = this.form.value;
      this.onSubmit.emit({
        portfolio: this.portfolioId || this.holding!.portfolio,
        asset_name: formValue.asset_name,
        asset_type: formValue.asset_type,
        quantity: formValue.quantity,
        unit_price: formValue.unit_price,
        valuation_date: formValue.valuation_date,
      });
    }
  }
}

