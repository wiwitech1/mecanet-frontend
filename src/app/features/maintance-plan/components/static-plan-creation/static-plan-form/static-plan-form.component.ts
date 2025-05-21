import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MaintenancePlanService } from '../../../services/maintenance-plan.service';

import { PlanItemBoardComponent } from '../plan-item-board/plan-item-board.component';

import { PlanItemCreatorComponent } from '../plan-item-creator/plan-item-creator.component';


import { MaintenancePlanItem } from '../../../model/maintenance-plan.entity';

interface ProductionLine { id: number; name: string; }
interface Machine         { id: number; name: string; productionLineId: number; }
 
@Component({
  selector: 'app-static-plan-form',
  standalone: true,
  imports: [CommonModule, FormsModule, PlanItemBoardComponent, PlanItemCreatorComponent],
  templateUrl: './static-plan-form.component.html',
  styleUrls: ['./static-plan-form.component.scss', './static-plan-form2.component.scss']
})
export class StaticPlanFormComponent {
  activeTab: number = 1; // Por defecto muestra la pestaña 1

  selectedItem: MaintenancePlanItem | null = null;

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
      itemName: string;
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

  showItemCreator = false;

  onOpenItemCreator() {
    this.showItemCreator = true;
  }

  onCloseItemCreator() {
    this.showItemCreator = false;
  }


  onAddElement(data: { name: string; day: number }) {
    const newItem: MaintenancePlanItem = {
      dayNumber: data.day,
      itemName: data.name,
      tasks: []
    };
    this.formData.items.push(newItem);
    this.selectedItem = newItem;
  }

  // Obtener siguiente día disponible para un nuevo item
  getNextAvailableDay(): number {
    const usedDays = this.formData.items.map(item => item.dayNumber);
    for (let i = 1; i <= this.formData.durationDays; i++) {
      if (!usedDays.includes(i)) return i;
    }
    return this.formData.durationDays + 1;
  }

  // Actualizar un item existente (si implementas edición luego)
  onItemChanged(updatedItem: MaintenancePlanItem) {
    const index = this.formData.items.findIndex(i => i === this.selectedItem);
    if (index !== -1) {
      this.formData.items[index] = updatedItem;
    }
    this.selectedItem = updatedItem;
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
