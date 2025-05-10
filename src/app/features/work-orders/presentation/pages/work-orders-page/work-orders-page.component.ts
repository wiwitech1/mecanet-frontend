import { Component } from '@angular/core';
import { CreateWorkOrderUseCase } from '../../../application/use-cases/create-work-order.use-case';
import { FormsModule } from '@angular/forms';
import { WorkOrderTableComponent } from '../../components/work-order-table/work-order-table.component';
import { CommonModule } from '@angular/common';
import { WorkOrderRepository } from '../../../domain/interfaces/work-order-repository';
import { WorkOrderApiRepository } from '../../../infrastructure/http/work-order-api.repository';

@Component({
  selector: 'app-work-orders-page',
  templateUrl: './work-orders-page.component.html',
  styleUrls: ['./work-orders-page.component.scss'],
  standalone: true,
  imports: [FormsModule, WorkOrderTableComponent, CommonModule],
  providers: [
    CreateWorkOrderUseCase,
    { provide: WorkOrderRepository, useClass: WorkOrderApiRepository }
  ]
})
export class WorkOrdersPageComponent {
  description = '';
  equipmentId = '';

  constructor(private createUC: CreateWorkOrderUseCase) {}

  create(): void {
    if (!this.description.trim() || !this.equipmentId.trim()) {
      return;
    }

    this.createUC.execute(this.description, this.equipmentId).subscribe({
      next: () => {
        alert('Work-order created!');
        this.description = '';
        this.equipmentId = '';
      },
      error: (err) => alert(err?.message ?? 'Error creating work-order'),
    });
  }
}
