import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MaintenancePlanService } from '../../../services/maintenance-plan.service';

import { PlanItemBoardComponent } from '../plan-item-board/plan-item-board.component';

import { PlanItemEditorComponent } from '../plan-item-editor/plan-item-editor.component';

import { MaintenancePlanItem } from '../../../model/maintenance-plan.entity';

interface ProductionLine { id: number; name: string; }
interface Machine         { id: number; name: string; productionLineId: number; }
 
@Component({
  selector: 'app-static-plan-form',
  standalone: true,
  imports: [CommonModule, FormsModule, PlanItemBoardComponent, PlanItemEditorComponent],
  templateUrl: './static-plan-form.component.html',
  styleUrls: ['./static-plan-form.component.scss', './static-plan-form2.component.scss']
})
export class StaticPlanFormComponent {
  activeTab: number = 1; // Por defecto muestra la pestaña 1

  @Output() close = new EventEmitter<void>();

  // Método para cambiar pestaña, si quieres algo más explícito
  setActiveTab(tabNumber: number) {
    this.activeTab = tabNumber;
  }

  formData = {
    planName: '',
    productionLineId: '',
    startDate: '',
    repeatCycle: 1, //mejor llamarlo repetition algo 
    durationDays: 3,
    items: [] as {
      dayNumber: number;
      tasks: {
        taskId: number | null;
        taskName: string;
        taskDescription: string;
        machineIds: number[];
      }[];
    }[]
  };
  
  onClose() {
    this.close.emit();
  }

  onContinue() {
    console.log('Plan actual:', this.formData);
  }

  /*FUNCIONES PARA MANEJAR ITEMS*/

  onAddElement() {
    const nextDay = this.getNextAvailableDay();
  
    const newItem: MaintenancePlanItem = {
      dayNumber: nextDay,
      tasks: []
    };
  
    this.formData.items.push(newItem);
    this.selectedItem = newItem;
  }
  
  getNextAvailableDay(): number {
    const usedDays = this.formData.items.map(item => item.dayNumber);
    for (let i = 1; i <= this.formData.durationDays; i++) {
      if (!usedDays.includes(i)) return i;
    }
    return this.formData.durationDays + 1; // en caso todos estén ocupados
  }

  selectedItem: MaintenancePlanItem | null = null;

onItemChanged(updatedItem: MaintenancePlanItem) {
  // Actualiza el array formData.items con los cambios
  const index = this.formData.items.findIndex(i => i === this.selectedItem);
  if (index !== -1) {
    this.formData.items[index] = updatedItem;
  }
  this.selectedItem = updatedItem; // opcionalmente reasignar para refrescar binding
}

 /*FUNCIONES PARA MANEJAR ITEMS*/


 /*
onTaskAdded() {
  if (this.selectedItem) {
    this.selectedItem.tasks.push({
      taskId: null,
      taskName: '',
      taskDescription: '',
      machineIds: []
    });
  }
}

onTaskRemoved(index: number) {
  if (this.selectedItem) {
    this.selectedItem.tasks.splice(index, 1);
  }
}
*/
  
}
