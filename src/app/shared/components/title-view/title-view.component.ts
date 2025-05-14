import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-title-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title-view.component.html',
  styleUrl: './title-view.component.scss'
})
export class TitleViewComponent {
  @Input() text: string = '';
}
