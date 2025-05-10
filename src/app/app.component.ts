import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatAnchor} from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {ThemeToggleComponent} from './public/components/theme-toggle/theme-toggle.component';
import {LanguageSwitcherComponent} from './public/components/language-switcher/language-switcher.component';

@Component({
 selector: 'app-root',
 standalone: true,
 imports: [
   RouterLink,
   RouterOutlet,
   CommonModule,
   ThemeToggleComponent,
   LanguageSwitcherComponent
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

 constructor(private translate: TranslateService) {
   this.translate.addLangs(['en', 'es']);
   this.translate.setDefaultLang('en');
   this.translate.use('en');
 }
}

