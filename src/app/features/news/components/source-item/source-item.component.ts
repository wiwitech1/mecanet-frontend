import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Source} from '../../model/source.entity';
import {MatListItem} from '@angular/material/list';

@Component({
  selector: 'app-source-item',
  imports: [
    MatListItem
  ],
  templateUrl: './source-item.component.html',
  styleUrl: './source-item.component.scss'
})
export class SourceItemComponent {
  @Input() source!: Source;
  @Output() sourceSelected = new EventEmitter<Source>();

  onClick() {
    this.sourceSelected.emit(this.source);
  }
}
