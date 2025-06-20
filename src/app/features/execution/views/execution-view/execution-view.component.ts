import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TitleViewComponent } from '../../../../shared/components/title-view/title-view.component';
import { ExecutionCardComponent } from '../../components/execution-card/execution-card.component';
import { ExecutionService } from '../../services/execution.service';
import { WorkOrderExecution, ExecutionCardData } from '../../models/execution.model';

@Component({
  selector: 'app-execution-view',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleViewComponent, ExecutionCardComponent],
  templateUrl: './execution-view.component.html',
  styleUrls: ['./execution-view.component.scss']
})
export class ExecutionViewComponent implements OnInit {
  workOrders: WorkOrderExecution[] = [];
  selectedOrder: string = '';
  cards: ExecutionCardData[] = [];

  constructor(private executionService: ExecutionService) {}

  ngOnInit(): void {
    // Obtener las órdenes de trabajo
    this.executionService.getWorkOrders().subscribe({
      next: (workOrders) => {
        this.workOrders = workOrders;
        if (workOrders.length > 0) {
          this.selectedOrder = workOrders[0].id;
          this.loadMachineriesForWorkOrder(this.selectedOrder);
        }
      },
      error: (error) => {
        console.error('Error al obtener órdenes de trabajo:', error);
      }
    });
  }

  loadMachineriesForWorkOrder(workOrderId: string) {
    this.executionService.getMachineriesByWorkOrder(workOrderId).subscribe({
      next: (machineries) => {
        this.cards = machineries;
      },
      error: (error) => {
        console.error('Error al obtener las maquinarias:', error);
      }
    });
  }

  onWorkOrderChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedOrder = selectElement.value;
    this.loadMachineriesForWorkOrder(this.selectedOrder);
  }
}
