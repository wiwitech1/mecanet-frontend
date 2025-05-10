import { Component, OnInit } from '@angular/core';
import { WorkOrder } from '../../../domain/entities/work-order.entity';
import { ListWorkOrdersUseCase } from '../../../application/use-cases/list-work-orders.use-case';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-work-order-table',
  templateUrl: './work-order-table.component.html',
  styleUrls: ['./work-order-table.component.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [ListWorkOrdersUseCase]
})
export class WorkOrderTableComponent implements OnInit {
  loading = false;
  workOrders: WorkOrder[] = [];
  error = '';

  constructor(private listUC: ListWorkOrdersUseCase) {}

  ngOnInit(): void {
    this.fetch();
  }

  /** Recarga manual (por ejemplo, botón "Refresh") */
  fetch(): void {
    this.loading = true;
    this.error = '';
    this.listUC.execute().subscribe({
      next: (list) => {
        this.workOrders = list;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message ?? 'Error loading work-orders';
        this.loading = false;
      },
    });
  }
}

