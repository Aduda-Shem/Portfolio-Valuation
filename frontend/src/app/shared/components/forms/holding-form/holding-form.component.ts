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
  templateUrl: './holding-form.component.html',
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

