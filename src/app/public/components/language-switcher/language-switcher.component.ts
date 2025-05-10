import {Component} from '@angular/core';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {TranslateService} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';

@Component({
 selector: 'app-language-switcher',
 standalone: true,
 imports: [
   MatButtonToggleGroup,
   MatButtonToggle,
   CommonModule
 ],
 templateUrl: './language-switcher.component.html',
 styleUrl: './language-switcher.component.scss'
})
export class LanguageSwitcherComponent {
 /** Currently active language code */
 protected currentLang: string = 'en';

 /** List of available language codes */
 protected languages: string[] = ['en', 'es'];

 /**
  * Creates an instance of LanguageSwitcherComponent.
  * Initializes the current language from the translation service.
  *
  * @param translate - The translation service for handling language changes
  */
 constructor(private translate: TranslateService) {
   this.currentLang = this.translate.currentLang;
 }

 /**
  * Changes the application's current language.
  * Updates both the translation service and the component's local state.
  *
  * @param language - The language code to switch to (e.g., 'en', 'es')
  */
 useLanguage(language: string) {
   this.translate.use(language);
   this.currentLang = language;
 }
}