import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-section.component.html',
  styleUrls: ['./info-section.component.scss']
})
export class InfoSectionComponent {
  @Input() infoType: number = 1; // Tipo de visualización (1, 2 o 3)
  @Input() data: any[] = []; // Datos para los tipos 1 y 2
  @Input() showSubtitle: boolean = false; // Mostrar subtítulo
  @Input() subtitleText: string = ''; // Texto del subtítulo
  @Input() subtitleClass: string = ''; // Clase CSS para el subtítulo
  @Input() statisticsData: any[] = []; // Datos para estadísticas (tipo 3)
} 