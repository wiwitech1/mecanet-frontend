import { Component } from '@angular/core';
import {
  ConfigurationPanelComponent
} from '../../../shared/components/configuration-panel/configuration-panel.component';

@Component({
  selector: 'app-billing',
  imports: [
    ConfigurationPanelComponent
  ],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss'
})
export class BillingComponent {

}
