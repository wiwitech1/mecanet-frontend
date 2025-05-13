import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Source} from '../../model/source.entity';
import {MatNavList} from '@angular/material/list';
import {SourceItemComponent} from '../source-item/source-item.component';

@Component({
  selector: 'app-source-list',
  imports: [
    MatNavList,
    SourceItemComponent
  ],
  templateUrl: './source-list.component.html',
  styleUrl: './source-list.component.scss'
})
export class SourceListComponent {
  @Input() sources!: Array<Source>;
  @Output() sourceSelected = new EventEmitter<Source>();

  onSourceSelected(source: Source) {
    this.sourceSelected.emit(source);
  }
}
