import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaintenancePlanService } from '../../../services/maintenance-plan.service';
import { ProductionLineService } from '../../../../asset-management/services/production-line.service';
import { PlanItemBoardComponent } from '../plan-item-board/plan-item-board.component';
import { PlanItemCreatorComponent } from '../plan-item-creator/plan-item-creator.component';
import { MaintenancePlanItem, MaintenanceTask } from '../../../model/maintenance-plan.entity';
import { MaintenancePlanData } from '../../../model/maintenance-plan.entity';

import { DragDropModule } from '@angular/cdk/drag-drop';

/*Animaciones */
import { TemplatePortal } from '@angular/cdk/portal';
import { TemplateRef, ViewContainerRef } from '@angular/core';

import {
  Overlay,OverlayRef,ConnectedPosition,FlexibleConnectedPositionStrategy} from '@angular/cdk/overlay';
import { ComponentRef, ElementRef, ViewChild, Injector } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
/*Animaciones */


interface ProductionLine { id: number; name: string; }
interface Machine         { id: number; name: string; productionLineId: number; }



@Component({
  selector: 'app-static-plan-form',
  standalone: true,
  imports: [CommonModule, FormsModule, PlanItemBoardComponent, PlanItemCreatorComponent, DragDropModule],
  templateUrl: './static-plan-form.component.html',
  styleUrls: ['./static-plan-form.component.scss', './static-plan-form2.component.scss']
})
export class StaticPlanFormComponent implements OnInit {

  constructor(private productionLineService: ProductionLineService, private overlay: Overlay, private injector: Injector,  private viewContainerRef: ViewContainerRef, private maintenancePlanService: MaintenancePlanService) {}


  formData: MaintenancePlanData = {
    planName: '',
    productionLineId: 0,
    startDate: null,
    repeatCycle: 1,
    durationDays: 3,
    planId: 0,
    userCreator: 1,
    items: []
  };


  ngOnInit() {
    this.productionLineService.getProductionLineIdAndName().subscribe({
      next: (lines) => {
        this.productionLines = lines;
        this.filteredLines = lines;
        console.log(this.productionLines);
      },
      error: (err) => {
        console.error('Error fetching production lines:', err);
      }
    });
  }

  /*BUSQUEDA DE LINEAS DE PRODUCCION*/
  productionLines: { id: number; name: string }[] = [];
  filteredLines: { id: number; name: string }[] = [];
  selectedProductionLineName: string = '';


  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const term = input.value.toLowerCase();
  
    this.filteredLines = this.productionLines.filter(line =>
      line.name.toLowerCase().includes(term)
    );
  }

  selectLine(line: { id: number; name: string }) {
    this.formData.productionLineId = line.id;
    this.selectedProductionLineName = line.name;
  }


  // Animaciones

  hasAnimatedPanel = false;
  panelExpanded = false;
  @ViewChild('productionLineInputRef') productionLineInputRef!: ElementRef;

  overlayRef!: OverlayRef;

  @ViewChild('ballTemplate') ballTemplate!: TemplateRef<any>;

  inputOffset = { top: 0, left: 0 };

  resetPanelState() {
    this.hasAnimatedPanel = false;
    this.panelExpanded = false;
    this.isEditingProductionLine = false;
  }
  

  showBallOverlay() {
    if (this.overlayRef) return;

    this.resetPanelState();

    const inputElement = this.productionLineInputRef.nativeElement;
    const rect = inputElement.getBoundingClientRect();
  
    const finalBallOffset = 70;
    const spacing = 8;
  
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(inputElement)
      .withPositions([
        {
          originX: 'end',
          originY: 'center',
          overlayX: 'start',
          overlayY: 'center',
          offsetX: spacing
        }
      ]);
  
    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
  
    const portal = new TemplatePortal(this.ballTemplate, this.viewContainerRef);
    this.overlayRef.attach(portal);
  
    // Esperamos a que se renderice la bolita y termine su animación (400ms)
    setTimeout(() => {
      const ballOverlayElement = this.overlayRef.overlayElement.querySelector('.trigger-ball') as HTMLElement;
  
      // 1. Mostramos el contenedor (nace como bolita)
      this.isEditingProductionLine = true;
  
      // 2. Esperamos al próximo tick para asegurar que el DOM lo pinte
      setTimeout(() => {
        this.hasAnimatedPanel = true;
  
        setTimeout(() => {
          this.hasAnimatedPanel = false;
          this.panelExpanded = true;
        }, 200); // duración igual a la animación
      }, 20);
  
      // 5. Ya no necesitamos la bolita
      this.hideBallOverlay();
    }, 250);
  }
  
  hideBallOverlay() {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef = undefined!;
    }
  }

  //


  activeTab: number = 1; // Por defecto muestra la pestaña 1


  selectedItem: MaintenancePlanItem | null = null;

  @Output() close = new EventEmitter<void>();

  // Activar input de linea de produccion
  isEditingProductionLine = false;

  openProductionLinePanel(event: MouseEvent) {
    event.stopPropagation(); // Evita que el click burbujee y cierre el panel
    this.isEditingProductionLine = true;
  }

  closeProductionLinePanel() {
    if (this.isEditingProductionLine) {
      this.isEditingProductionLine = false;
    }
  }
  

  // Método para cambiar pestaña, si quieres algo más explícito
  setActiveTab(tabNumber: number) {
    this.activeTab = tabNumber;
  }

  
  onClose() {
    this.submitted = false;
    this.close.emit();
  }


  /*FUNCIONES DE VALIDACION Y CREACION DE PLAN*/
  submitted = false;

  isFormValid(): boolean {
    const nameOk = this.formData.planName?.trim().length > 0;
    const lineOk = this.formData.productionLineId > 0;
    const dateOk = typeof this.formData.startDate === 'string' && this.formData.startDate.trim() !== '';
    return nameOk && lineOk && dateOk;
  }


  onContinue() {
    this.submitted = true;
    if (!this.isFormValid()) return;

    const planToSave = {
      ...this.formData
    };

    this.maintenancePlanService.createPlan(planToSave).subscribe({
      next: created => {
        console.log('✅ Plan creado:', created);
        this.onClose();
      },
      error: err => console.error('❌ Error:', err)
    });
  }
  

  /*FUNCIONES PARA MANEJAR ITEMS*/

  showItemCreator = false;

  onOpenItemCreator() {
    this.showItemCreator = true;
  }

  onCloseItemCreator() {
    this.showItemCreator = false;
  }


  onAddElement(data: {
    itemName: string;
    dayNumber: number;
    tasks: {
      taskName: string;
      taskDescription: string;
      machineIds: number[];
    }[];
  }) {
    const newItem: MaintenancePlanItem = {
      itemName: data.itemName,
      dayNumber: data.dayNumber,
      tasks: data.tasks.map(t => ({
        taskId: null,
        taskName: t.taskName,
        taskDescription: t.taskDescription,
        machineIds: t.machineIds
      }))
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


  onItemMoved(event: { item: MaintenancePlanItem; newDay: number }) {
    console.log('Item movido:', event.item, 'Nuevo día:', event.newDay);
    const index = this.formData.items.findIndex(i => i === event.item);
    if (index !== -1) {
      this.formData.items[index].dayNumber = event.newDay;
    }
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
