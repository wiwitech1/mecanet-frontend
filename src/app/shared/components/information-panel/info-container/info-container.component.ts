import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-container.component.html',
  styleUrls: ['./info-container.component.scss']
})
export class InfoContainerComponent {
  @Input() title: string = ''; // Título del contenedor
  @Input() titleType: number = 1; // 1 o 2 para los diferentes estilos de título
  @Input() titleClass: string = ''; // Clase adicional para el título si es necesario
} 