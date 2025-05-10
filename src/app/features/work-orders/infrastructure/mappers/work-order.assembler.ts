import { WorkOrder } from '../../domain/entities/work-order.entity';
import { WorkOrderDto } from '../http/dto/work-order.dto';
import { WorkOrderStatus } from '../../domain/value-objects/work-order-status.vo';

export class WorkOrderAssembler {
  static fromDto(d: WorkOrderDto): WorkOrder {
    return new WorkOrder(
      d.id,
      d.description,
      d.equipmentId,
      new Date(d.createdAt),
      d.status as WorkOrderStatus,
    );
  }
  static toDto(e: WorkOrder): WorkOrderDto {
    return {
      id: e.id,
      description: e.description,
      equipmentId: e.equipmentId,
      createdAt: e.createdAt.toISOString(),
      status: e.status,
    };
  }
}
