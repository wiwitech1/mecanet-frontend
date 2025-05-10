import { inject } from '@angular/core';
import { WorkOrderRepository } from '../../domain/interfaces/work-order-repository';

export class ListWorkOrdersUseCase {
  private repo = inject(WorkOrderRepository);
  execute() { return this.repo.list(); }
}
