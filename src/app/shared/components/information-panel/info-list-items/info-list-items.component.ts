import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-list-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-list-items.component.html',
  styleUrls: ['./info-list-items.component.scss']
})
export class InfoListItemsComponent {
  @Input() items: any[] = [];
  @Input() type: string = 'default'; // 'maintenance', 'simpleList', 'movements'
} 