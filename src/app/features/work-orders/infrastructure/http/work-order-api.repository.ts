import { Injectable } from "@angular/core";
import { WorkOrder } from "../../domain/entities/work-order.entity";
import { WorkOrderApiService } from "./work-order-api.service";
import { WorkOrderRepository } from "../../domain/interfaces/work-order-repository";
import { map, Observable } from "rxjs";
import { WorkOrderAssembler } from "../mappers/work-order.assembler";

@Injectable({ providedIn: 'root' })
export class WorkOrderApiRepository extends WorkOrderRepository {
  constructor(private api: WorkOrderApiService) { super(); }

  create(e: WorkOrder) : Observable<void> { 
    const dto = WorkOrderAssembler.toDto(e);
    return this.api.post(dto); 
  }

  list() : Observable<WorkOrder[]> { 
    return this.api.getAll()
             .pipe(map(ds => ds.map(WorkOrderAssembler.fromDto))); 
  }
}
