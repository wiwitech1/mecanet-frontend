import {Component, inject, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {filter, Subscription} from 'rxjs';
import {CommonModule, Location} from '@angular/common';
import {TranslateService, TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [
    MatButton,
    CommonModule,
    TranslateModule
  ],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent implements OnInit, OnDestroy {
  protected invalidPath: string = '';
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private location: Location = inject(Location);
  private translateService: TranslateService = inject(TranslateService);
  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    // Obtener la ruta inicial
    this.updateInvalidPath();

    // Suscribirse a los cambios de navegación
    this.subscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateInvalidPath();
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private updateInvalidPath(): void {
    // Usar la URL actual del navegador para mostrar la ruta completa
    const currentPath = this.location.path();
    this.invalidPath = currentPath.startsWith('/') ? currentPath.substring(1) : currentPath;

    // Si la ruta está vacía, mostrar la URL completa
    if (!this.invalidPath) {
      this.invalidPath = window.location.pathname.substring(1);
    }
  }

  protected onNavigateHome() {
    this.router.navigate(['']).then();
  }
}

