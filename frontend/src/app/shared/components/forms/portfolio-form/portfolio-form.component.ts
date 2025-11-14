import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Portfolio, CreatePortfolioRequest } from '../../../../models/portfolio.model';
import { CardComponent } from '../../ui/card/card.component';
import { InputComponent } from '../../ui/input/input.component';
import { TextareaComponent } from '../../ui/textarea/textarea.component';
import { ButtonComponent } from '../../ui/button/button.component';

/**
 * Portfolio Form Component
 * Form for creating or editing a portfolio
 */
@Component({
  selector: 'app-portfolio-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    InputComponent,
    TextareaComponent,
    ButtonComponent,
  ],
  template: `
    <app-card>
      <h2 class="text-xl font-bold text-gray-900 mb-6">
        {{ portfolio ? 'Edit Portfolio' : 'Create New Portfolio' }}
      </h2>
      <form [formGroup]="form" (ngSubmit)="handleSubmit()">
        <div class="space-y-4">
          <app-input
            label="Portfolio Name"
            type="text"
            placeholder="Enter portfolio name"
            formControlName="name"
            [required]="true"
          ></app-input>
          <app-input
            label="Client Name"
            type="text"
            placeholder="Enter client name"
            formControlName="client_name"
            [required]="true"
          ></app-input>
          <app-input
            label="Client Email"
            type="email"
            placeholder="Enter client email"
            formControlName="client_email"
            [required]="true"
          ></app-input>
          <app-textarea
            label="Description"
            placeholder="Enter description (optional)"
            formControlName="description"
            [rows]="3"
          ></app-textarea>
          <div class="flex justify-end gap-2 pt-4">
            <app-button type="button" variant="ghost" (onClick)="onCancel.emit()">
              Cancel
            </app-button>
            <app-button type="submit" [disabled]="form.invalid">
              {{ portfolio ? 'Update' : 'Create' }}
            </app-button>
          </div>
        </div>
      </form>
    </app-card>
  `,
})
export class PortfolioFormComponent implements OnInit {
  @Input() portfolio?: Portfolio;
  @Output() onSubmit = new EventEmitter<CreatePortfolioRequest>();
  @Output() onCancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      client_name: ['', Validators.required],
      client_email: ['', [Validators.required, Validators.email]],
      description: [''],
    });
  }

  ngOnInit(): void {
    if (this.portfolio) {
      this.form.patchValue({
        name: this.portfolio.name,
        client_name: this.portfolio.client_name,
        client_email: this.portfolio.client_email,
        description: this.portfolio.description || '',
      });
    }
  }

  handleSubmit(): void {
    if (this.form.valid) {
      this.onSubmit.emit(this.form.value);
    }
  }
}

