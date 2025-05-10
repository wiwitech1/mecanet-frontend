import { Observable } from 'rxjs';
import { WorkOrder } from '../entities/work-order.entity';

export abstract class WorkOrderRepository {
  abstract create(entity: WorkOrder): Observable<void>;
  abstract list(): Observable<WorkOrder[]>;
}
