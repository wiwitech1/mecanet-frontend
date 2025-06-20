import { Component } from '@angular/core';
import {Router, ActivatedRoute, RouterOutlet} from '@angular/router';
import {NgClass} from '@angular/common';
import {TitleViewComponent} from '../title-view/title-view.component';

@Component({
  selector: 'app-configuration-panel',
  standalone: true,
  imports: [
    NgClass,
    TitleViewComponent,
    RouterOutlet,
  ],
  templateUrl: './configuration-panel.component.html',
  styleUrl: './configuration-panel.component.scss'
})
export class ConfigurationPanelComponent {
  currentTab = 'cuenta';

  constructor(private router: Router, private route: ActivatedRoute) {}

  navigateTo(tab: string) {
    this.currentTab = tab;
    this.router.navigate([tab], { relativeTo: this.route });
  }
}

