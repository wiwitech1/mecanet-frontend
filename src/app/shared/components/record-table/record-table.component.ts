import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonComponent, ButtonVariant } from '../button/button.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

export type RecordTableColumnType = 'text' | 'number' | 'information' | 'cta' | 'template';

export interface RecordTableColumn {
  key: string;
  label: string;
  type: 'texto' | 'numero' | 'informacion' | 'cta' | 'template';
  ctaLabel?: string;
  ctaVariant?: ButtonVariant;
  templateRef?: TemplateRef<any> | null;
}

@Component({
  selector: 'app-record-table',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, ButtonComponent, TranslateModule],
  templateUrl: './record-table.component.html',
  styleUrl: './record-table.component.scss'
})
export class RecordTableComponent {
  @Input() columns: RecordTableColumn[] = [];
  @Input() data: any[] = [];
  @Output() ctaClick = new EventEmitter<{row: any, column: RecordTableColumn}>();

  constructor(private translate: TranslateService) {}

  getColumnType(type: string): RecordTableColumnType {
    return this.translate.instant(`recordTable.columnTypes.${type}`) as RecordTableColumnType;
  }

  onCtaClick(row: any, column: RecordTableColumn) {
    this.ctaClick.emit({row, column});
  }
}
