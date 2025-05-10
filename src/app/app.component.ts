
import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatAnchor} from '@angular/material/button';

@Component({
 selector: 'app-root',
 standalone: true,
 imports: [
   MatToolbar,
   MatToolbarRow,
   RouterLink,
   RouterOutlet,
   MatAnchor,
 ],
 templateUrl: './app.component.html',
 styleUrl: './app.component.scss'
})
export class AppComponent {
 title = 'mecanet-frontend';
 options = [
   { path: '/home', title: 'Home' },
   { path:'/about', title: 'About' }
 ]

 constructor(private translate: TranslateService) {
   this.translate.addLangs(['en', 'es']);
   this.translate.setDefaultLang('en');
   this.translate.use('en');
 }
}

