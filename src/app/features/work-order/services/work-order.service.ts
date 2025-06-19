import { Injectable } from '@angular/core';
import { WorkOrderEntity } from '../models/work-order.entity';

@Injectable({ providedIn: 'root' })
export class WorkOrderService {
  private orders: WorkOrderEntity[] = [
    {
      id: 1,
      code: 'PM-2025-04',
      date: '2025-03-10',
      productionLine: 'L-01',
      type: 'Preventivo',
      technicians: [
        { name: 'Juan Pérez', machines: ['MT-430', 'MT-450'] },
        { name: 'María López', machines: [] }
      ]
    },
    {
      id: 2,
      code: 'OT-2025-01',
      date: '2025-03-15',
      productionLine: 'L-01',
      type: 'Correctivo',
      technicians: [
        { name: 'Luis Ramírez', machines: ['MT-500'] }
      ]
    }
  ];

  async getOrders(): Promise<WorkOrderEntity[]> {
    return [...this.orders];
  }

  async getOrderById(id: number): Promise<WorkOrderEntity | undefined> {
    return this.orders.find(o => o.id === id);
  }

  async createOrder(order: Partial<WorkOrderEntity>): Promise<void> {
    const newOrder: WorkOrderEntity = {
      ...order,
      id: this.orders.length + 1,
      technicians: order.technicians || []
    } as WorkOrderEntity;
    this.orders.push(newOrder);
  }

  async updateOrder(id: number, order: Partial<WorkOrderEntity>): Promise<void> {
    const idx = this.orders.findIndex(o => o.id === id);
    if (idx > -1) {
      this.orders[idx] = { ...this.orders[idx], ...order };
    }
  }

  async deleteOrder(id: number): Promise<void> {
    this.orders = this.orders.filter(o => o.id !== id);
  }
}
