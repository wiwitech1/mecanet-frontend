import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() headerText: string = 'Default Header'; 
  @Input() showRectangularBox: boolean = false; 
  @Input() rectangularBoxText: string = ''; 
  @Input() headerTextClass: string = ''; 
}
