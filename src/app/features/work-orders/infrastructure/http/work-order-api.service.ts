import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../environments/environment";
import { Injectable } from "@angular/core";
import { WorkOrderDto } from "./dto/work-order.dto";

@Injectable({ providedIn: 'root' })
export class WorkOrderApiService {
    
  private base = `${environment.serverBaseUrl}/work-orders`;
  constructor(private http: HttpClient) {}

  post(dto: WorkOrderDto){ 
    return this.http.post<void>(this.base, dto); 
  }
  getAll(){ 
    return this.http.get<WorkOrderDto[]>(this.base); 
  }
}
