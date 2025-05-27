import { Component } from '@angular/core';
import {TitleViewComponent} from '../../../shared/components/title-view/title-view.component';
import { Router, ActivatedRoute } from '@angular/router';
import {NgClass} from '@angular/common';
import { ConfigurationPanelComponent} from '../../../shared/components/configuration-panel/configuration-panel.component';

@Component({
  selector: 'app-account-info',
  imports: [
    TitleViewComponent,
    NgClass,
    ConfigurationPanelComponent,
  ],
  templateUrl: './account-info.component.html',
  styleUrl: './account-info.component.scss'
})
export class AccountInfoComponent {

}
