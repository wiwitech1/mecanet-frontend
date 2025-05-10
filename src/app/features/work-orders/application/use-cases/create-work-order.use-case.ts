import { inject } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { WorkOrder } from '../../domain/entities/work-order.entity';
import { WorkOrderRepository } from '../../domain/interfaces/work-order-repository';

export class CreateWorkOrderUseCase {
  private repo = inject(WorkOrderRepository);

  execute(description: string, equipmentId: string) {
    const entity = new WorkOrder(uuid(), description, equipmentId, new Date());
    return this.repo.create(entity);
  }
}
