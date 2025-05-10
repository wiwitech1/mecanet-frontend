import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss'
})
export class ThemeToggleComponent {
  currentTheme: Theme = 'light';
  
  constructor(private themeService: ThemeService) {
    // Suscribirse a los cambios de tema
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }
  
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
