import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
 selector: 'app-root',
 standalone: true,
 imports: [],
 templateUrl: './app.component.html',
 styleUrl: './app.component.scss'
})
export class AppComponent {
 title = 'mecanet-frontend';
 constructor(private translate: TranslateService) {
   this.translate.addLangs(['en', 'es']);
   this.translate.setDefaultLang('en');
   this.translate.use('en');
 }
}
