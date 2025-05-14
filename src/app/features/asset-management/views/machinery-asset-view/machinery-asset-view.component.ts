import { Component } from '@angular/core';
import { InformationPanelComponent } from '../../../../shared/components/information-panel/information-panel.component';
import { SearchComponent } from '../../../../shared/components/search/search.component';
import { RecordTableComponent } from '../../../../shared/components/record-table/record-table.component';
import { TitleViewComponent } from '../../../../shared/components/title-view/title-view.component';
@Component({
  selector: 'app-machinery-asset-view',
  imports: [
    InformationPanelComponent,
    SearchComponent,
    RecordTableComponent,
    TitleViewComponent
  ],
  templateUrl: './machinery-asset-view.component.html',
  styleUrl: './machinery-asset-view.component.scss'
})
export class MachineryAssetViewComponent {

}
