import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductionLineService } from '../../../../asset-management/services/production-line.service';
import { TaskCreatorComponent } from '../task-creator/task-creator.component';

@Component({
  selector: 'app-plan-item-creator',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskCreatorComponent],
  templateUrl: './plan-item-creator.component.html',
  styleUrls: ['./plan-item-creator.component.scss', '../static-plan-form/static-plan-form2.component.scss']
})
export class PlanItemCreatorComponent implements OnInit {

  constructor(private productionLineService: ProductionLineService) {}

  @Input() itemNameDefault: string = '';
  @Input() maxDays: number = 1;
  @Input() productionLineId: number = 0;

  itemName: string = '';
  selectedDay: number = 1;
  showTaskCreator: boolean = false;

  tasks: {
    taskName: string;
    taskDescription: string;
    machineIds: number[];
  }[] = [];

  @Output() saveItem = new EventEmitter<{
    itemName: string;
    dayNumber: number;
    tasks: {
      taskName: string;
      taskDescription: string;
      machineIds: number[];
    }[];
  }>();
  @Output() cancel = new EventEmitter<void>();

  ngOnInit() {
    this.itemName = this.itemNameDefault;
    this.selectedDay = 1;

    // Obtener las maquinarias de la línea de producción 1
    this.productionLineService.getMachineriesByProductionLine(this.productionLineId).subscribe({
      next: (machineries) => {
        this.availableMachineries = machineries;
      },
      error: (error) => {
        console.error('Error al obtener las maquinarias:', error);
      }
    });
    
  }

  visibleChips: any[] = [];
  hiddenChipsCount: number = 0;
isExpanded = false;

ngDoCheck() {
  const maxVisible = 2;
  const total = this.selectedMachineries;
  this.visibleChips = total.slice(0, maxVisible);
  this.hiddenChipsCount = Math.max(0, total.length - maxVisible);
}
onExpandClick() {
  this.isSelectorOpen = true;
}



  /*Maquinarias Recipiente*/

  searchTerm: string = '';

    // Todas las maquinarias disponibles según la línea de producción
availableMachineries: { id: number; name: string }[] = [];

// Recipiente temporal (lo que el usuario selecciona)
selectedMachineries: { id: number; name: string }[] = [];


  isSelectorOpen = false;

toggleMachinery(machine: { id: number; name: string }) {
  const index = this.selectedMachineries.findIndex(m => m.id === machine.id);
  if (index >= 0) {
    this.selectedMachineries.splice(index, 1);
  } else {
    this.selectedMachineries.push(machine);
  }
}

get filteredMachineries() {
  return this.availableMachineries.filter(machine =>
    machine.name.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
}


isMachineSelected(machineId: number): boolean {
  return this.selectedMachineries.some(m => m.id === machineId);
}



  /*Maquinarias Recipiente*/


  onTaskCreated(task: {
    taskName: string;
    taskDescription: string;
    machineIds: number[];
  }) {
    this.tasks.push(task);
    this.showTaskCreator = false;
  }

  onSave() {
    if (this.itemName.trim() && this.selectedDay >= 1 && this.selectedDay <= this.maxDays) {
      const item = {
        itemName: this.itemName.trim(),
        dayNumber: this.selectedDay,
        tasks: this.tasks
      };
      console.log('ITEM COMPLETO:', JSON.stringify(item, null, 2));
      this.saveItem.emit(item);
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  isEditingName = false;

enableEditName() {
  this.isEditingName = true;
  // Opcional: enfocar input al activarse
  setTimeout(() => {
    const input = document.getElementById('itemNameInput');
    input?.focus();
  }, 0);
}

disableEditName() {
  this.isEditingName = false;
}

openTaskCreator() {
  this.showTaskCreator = true;
}

closeTaskCreator() {
  this.showTaskCreator = false;
}

}
