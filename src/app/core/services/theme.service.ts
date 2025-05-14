import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<Theme>(this.getInitialTheme());
  
  // Observable que otros componentes pueden suscribirse para conocer el tema actual
  public theme$: Observable<Theme> = this.themeSubject.asObservable();
  
  constructor() {
    // Aplicar el tema inicial al documento HTML
    this.applyTheme(this.themeSubject.value);
    
    // Opcional: Escuchar cambios en la preferencia del sistema
    this.listenForPreferenceChanges();
  }
  
  /**
   * Obtiene el tema inicial basado en:
   * 1. Preferencia guardada en localStorage
   * 2. Preferencia del sistema
   * 3. Tema por defecto (light)
   */
  private getInitialTheme(): Theme {
    // Comprobar si hay un tema guardado en localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    
    // Comprobar preferencia del sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // Tema por defecto
    return 'light';
  }
  
  /**
   * Cambia el tema actual
   */
  public setTheme(theme: Theme): void {
    if (theme !== this.themeSubject.value) {
      this.themeSubject.next(theme);
      localStorage.setItem('theme', theme);
      this.applyTheme(theme);
    }
  }
  
  /**
   * Alterna entre los temas claro y oscuro
   */
  public toggleTheme(): void {
    const newTheme: Theme = this.themeSubject.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
  
  /**
   * Devuelve el tema actual
   */
  public getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }
  
  /**
   * Aplica el tema al documento HTML
   */
  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Opcional: Sincronizar con la meta tag de color-scheme para mejorar la UX
    document.documentElement.style.colorScheme = theme;
  }
  
  /**
   * Escucha cambios en la preferencia del sistema (modo oscuro/claro)
   */
  private listenForPreferenceChanges(): void {
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        // Solo cambiar automáticamente si no hay preferencia guardada
        if (!localStorage.getItem('theme')) {
          const newTheme: Theme = e.matches ? 'dark' : 'light';
          this.setTheme(newTheme);
        }
      });
    }
  }
}
