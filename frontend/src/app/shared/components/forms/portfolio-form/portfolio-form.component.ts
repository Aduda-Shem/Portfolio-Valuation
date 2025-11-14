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
  templateUrl: './portfolio-form.component.html',
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

