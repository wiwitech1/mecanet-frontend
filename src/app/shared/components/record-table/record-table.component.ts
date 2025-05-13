import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonComponent, ButtonVariant } from '../button/button.component';

export interface RecordTableColumn {
  key: string;
  label: string;
  type: 'texto' | 'numero' | 'informacion' | 'cta';
  ctaLabel?: string;
  ctaVariant?: ButtonVariant;
}

@Component({
  selector: 'app-record-table',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, ButtonComponent],
  templateUrl: './record-table.component.html',
  styleUrl: './record-table.component.scss'
})
export class RecordTableComponent {
  @Input() columns: RecordTableColumn[] = [];
  @Input() data: any[] = [];
  @Output() ctaClick = new EventEmitter<{row: any, column: RecordTableColumn}>();

  onCtaClick(row: any, column: RecordTableColumn) {
    this.ctaClick.emit({row, column});
  }
}
