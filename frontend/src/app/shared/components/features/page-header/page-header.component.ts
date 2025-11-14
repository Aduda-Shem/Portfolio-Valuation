import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Page Header Component
 * Reusable page header with title, description, and action button
 */
@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-header.component.html',
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() description?: string;
  @Input() action?: boolean = false;
}

