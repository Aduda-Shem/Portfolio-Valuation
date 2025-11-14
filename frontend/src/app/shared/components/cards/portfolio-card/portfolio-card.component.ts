import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Portfolio } from '../../../../models/portfolio.model';
import { ButtonComponent } from '../../ui/button/button.component';
import { CardComponent } from '../../ui/card/card.component';
import { Formatters } from '../../../../core/utils/formatters';

/**
 * portfolio information in a card format
 */
@Component({
  selector: 'app-portfolio-card',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, CardComponent],
  templateUrl: './portfolio-card.component.html',
})
export class PortfolioCardComponent {
  @Input() portfolio!: Portfolio;
  @Output() onDelete = new EventEmitter<number>();

  Formatters = Formatters;
}

