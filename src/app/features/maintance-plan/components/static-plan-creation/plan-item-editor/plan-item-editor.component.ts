import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MaintenancePlanItem } from '../../../model/maintenance-plan.entity';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plan-item-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plan-item-editor.component.html',
  styleUrls: ['./plan-item-editor.component.scss']
})
export class PlanItemEditorComponent {

  @Input() item!: MaintenancePlanItem | null;  // El item a editar

  // Eventos para comunicar cambios al padre
  @Output() itemChanged = new EventEmitter<MaintenancePlanItem>();
  @Output() taskAdded = new EventEmitter<void>();
  @Output() taskRemoved = new EventEmitter<number>(); // id o índice de la tarea eliminada

  // Métodos para manejar cambios (ejemplo para editar día)
  onDayChange(newDay: number) {
    if (this.item) {
      this.item.dayNumber = newDay;
      this.itemChanged.emit(this.item);
    }
  }

  // Similar para otras propiedades...

  // Agregar tarea
  addTask() {
    this.taskAdded.emit();
  }

  // Remover tarea
  removeTask(index: number) {
    this.taskRemoved.emit(index);
  }
}
