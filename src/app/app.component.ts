import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {RouterLink, RouterOutlet, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ThemeToggleComponent} from './public/components/theme-toggle/theme-toggle.component';
import {LanguageSwitcherComponent} from './public/components/language-switcher/language-switcher.component';
import { SidebarMecanetComponent } from './shared/components/sidebar-mecanet/sidebar-mecanet.component';
@Component({
 selector: 'app-root',
 standalone: true,
 imports: [
   RouterLink,
   RouterOutlet,
   CommonModule,
   ThemeToggleComponent,
   LanguageSwitcherComponent,
   SidebarMecanetComponent
 ],
 templateUrl: './app.component.html',
 styleUrl: './app.component.scss'
})
export class AppComponent {
 title = 'mecanet-frontend';
 options = [
   { path: '/home', title: 'Home' },
   { path: '/about', title: 'About' },
   { path: '/components-demo', title: 'Componentes' },
   { path: '/work-orders', title: 'Work Orders' }
 ]

 constructor(private translate: TranslateService, private router: Router) {
   this.translate.addLangs(['en', 'es']);
   
   this.translate.setDefaultLang('en');
   this.translate.use('en');
 }

 shouldShowSidebar(): boolean {
   return this.router.url !== '/iniciar-sesion' && this.router.url !== '/registrar' && this.router.url !== '/404';
 }
}

