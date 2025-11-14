import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

/**
 * Layout Component
 * Main layout wrapper with responsive sidebar navigation
 */
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  sidebarOpen: boolean = false;

  constructor(private router: Router) {}

  isActive(path: string): boolean {
    return this.router.url === path || (path === '/' && this.router.url.startsWith('/portfolios/'));
  }
}

