import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MachineMetricEntity } from '../models/machine-metric.entity';
import { MachineMetricResource } from './machine-metric.resource';
import { MachineMetricAssembler } from './machine-metric.assembler';
 
@Injectable({
  providedIn: 'root'
})
export class MachineMetricService {
  
  private baseUrl = environment.serverBaseUrl;

  constructor(private http: HttpClient) {}

  getMetricsForMachine(): Observable<MachineMetricEntity[]> {
    const token = JSON.parse(localStorage.getItem('userSession') || '{}').token;
    console.log('🔐 Token cargado desde localStorage:', token);
    return this.http.get<MachineMetricResource[]>(
      `${this.baseUrl}/machines/1/metrics`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).pipe(
      map(resources => MachineMetricAssembler.resourcesToEntities(resources))
    );
  }
} 