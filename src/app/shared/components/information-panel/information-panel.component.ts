import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-information-panel',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './information-panel.component.html',
  styleUrls: ['./information-panel.component.scss']
})
export class InformationPanelComponent {
  // Control de visibilidad de cada sección
  @Input() showHeader: boolean = true;
  @Input() showRectangularBox: boolean = false;

  // Datos adicionales que se pueden pasar desde el componente padre
  @Input() headerText: string = 'Información del Panel';
  @Input() rectangularBoxText: string = '';
  @Input() headerTextClass: string = '';
  
  // Propiedades para los botones
  @Input() showPrimaryButton: boolean = false;
  @Input() showSecondaryButton: boolean = false;
  @Input() primaryButtonText: string = 'Editar';
  @Input() secondaryButtonText: string = 'Desactivar';
  
  // Eventos para los botones
  @Output() primaryButtonClick = new EventEmitter<void>();
  @Output() secondaryButtonClick = new EventEmitter<void>();
  
  // Métodos para manejar los clics de los botones
  onPrimaryButtonClick(): void {
    this.primaryButtonClick.emit();
  }
  
  onSecondaryButtonClick(): void {
    this.secondaryButtonClick.emit();
  }
}
