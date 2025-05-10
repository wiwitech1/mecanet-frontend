import { WorkOrderStatus } from '../value-objects/work-order-status.vo';

export class WorkOrder {
  constructor(
    public readonly id: string,
    public description: string,
    public equipmentId: string,
    public readonly createdAt: Date,
    public status: WorkOrderStatus = WorkOrderStatus.Pending
  ) {}

  start() {
    if (this.status !== WorkOrderStatus.Pending)
      throw new Error('Work order already started or finished');
    this.status = WorkOrderStatus.InProgress;
  }

  finish() {
    if (this.status !== WorkOrderStatus.InProgress)
      throw new Error('Work order must be in progress to finish');
    this.status = WorkOrderStatus.Finished;
  }
}
