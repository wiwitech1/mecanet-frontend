import { Component } from '@angular/core';
import {
  ConfigurationPanelComponent
} from '../../../shared/components/configuration-panel/configuration-panel.component';

@Component({
  selector: 'app-delete-account',
  imports: [
    ConfigurationPanelComponent
  ],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.scss'
})
export class DeleteAccountComponent {

}
