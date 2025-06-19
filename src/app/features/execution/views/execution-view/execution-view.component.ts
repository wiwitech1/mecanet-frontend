import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TitleViewComponent } from '../../../../shared/components/title-view/title-view.component';
import { ExecutionCardComponent } from '../../components/execution-card/execution-card.component';

@Component({
  selector: 'app-execution-view',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleViewComponent, ExecutionCardComponent],
  templateUrl: './execution-view.component.html',
  styleUrls: ['./execution-view.component.scss']
})
export class ExecutionViewComponent {
  workOrders = [
    { id: 'OT01', name: 'Orden de Trabajo - OT01' },
    { id: 'OT02', name: 'Orden de Trabajo - OT02' }
  ];
  selectedOrder = this.workOrders[0].id;
  cards = [
    {
      machineryName: '1 | MT-450',
      tasks: [
        { label: 'Drenar aceite viejo al depósito aprobado', completed: false },
        { label: 'Reemplazar filtro hidráulico', completed: false },
        { label: 'Rellenar con aceite nuevo', completed: false },
        { label: 'Arranque de prueba y verificación de presión', completed: false },
        { label: 'Inspección de fugas en un recorrido de 5 min', completed: false }
      ],
      observations: '',
      products: [
        { name: 'Aceite hidráulico', quantity: 2 },
        { name: 'Filtro hidráulico', quantity: 1 }
      ]
    },
    {
      machineryName: '11 | MT-430',
      tasks: [
        { label: 'Drenar aceite viejo al depósito aprobado', completed: false },
        { label: 'Reemplazar filtro hidráulico', completed: false },
        { label: 'Rellenar con aceite nuevo', completed: false },
        { label: 'Arranque de prueba y verificación de presión', completed: false },
        { label: 'Inspección de fugas en un recorrido de 5 min', completed: false }
      ],
      observations: '',
      products: [
        { name: 'Aceite hidráulico', quantity: 2 },
        { name: 'Filtro hidráulico', quantity: 1 }
      ]
    },
    {
      machineryName: '5 | MT-150',
      tasks: [
        { label: 'Drenar aceite viejo al depósito aprobado', completed: false },
        { label: 'Reemplazar filtro hidráulico', completed: false },
        { label: 'Rellenar con aceite nuevo', completed: false },
        { label: 'Arranque de prueba y verificación de presión', completed: false },
        { label: 'Inspección de fugas en un recorrido de 5 min', completed: false }
      ],
      observations: '',
      products: [
        { name: 'Aceite hidráulico', quantity: 2 },
        { name: 'Filtro hidráulico', quantity: 1 }
      ]
    }
  ];
}
