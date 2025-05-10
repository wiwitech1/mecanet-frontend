import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent, ButtonVariant, ButtonSize, ButtonRadius } from '../../components/button/button.component';

@Component({
  selector: 'app-components-demo',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent
  ],
  templateUrl: './components-demo.component.html',
  styleUrl: './components-demo.component.scss'
})
export class ComponentsDemoComponent {
  buttonVariants: ButtonVariant[] = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'outline', 'ghost'];
  buttonSizes: ButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  buttonRadiuses: ButtonRadius[] = ['none', 'sm', 'md', 'lg', 'full'];
  
  handleButtonClick(event: MouseEvent): void {
    console.log('Botón clickeado:', event);
  }
}
