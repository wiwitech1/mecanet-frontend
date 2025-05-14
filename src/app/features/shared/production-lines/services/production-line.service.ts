// src/app/features/shared/production-lines/services/production-line.service.ts

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProductionLine } from '../models/production-line.model';
import { ProductionLineAssembler } from './production-line.assembler';
import { ProductionLineResponse } from './production-line.response';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductionLineService {

  constructor(private assembler: ProductionLineAssembler) {}

  // Simulando la respuesta de un API
  getProductionLines(): Observable<ProductionLine[]> {
    const response: ProductionLineResponse[] = [
      {
        id: 1,
        plant_id: 1,
        name: 'Assembly Line A',
        capacity: 1000,
        status: 1,
        description: 'This is the primary assembly line responsible for manufacturing large machinery.',
        created_at: '2025-05-01T08:00:00Z',
        updated_at: '2025-05-10T08:00:00Z',
        machineries: [
          {
            id: 1,
            name: 'CNC Lathe Machine',
            model: 'CNC-2000X',
            brand: 'ABC Manufacturing',
            serial_number: 'SN123456789',
            production_capacity: 100,
            recommendations: 'Regular maintenance is recommended every 500 hours of operation.',
            status: 1,
            user_creator: 101,
            user_updater: 102,
            created_at: '2025-04-25T08:00:00Z',
            updated_at: '2025-04-28T08:00:00Z'
          }
        ]
      },
      {
        id: 2,
        plant_id: 1,
        name: 'Packaging Line B',
        capacity: 500,
        status: 1,
        description: 'This line handles the final packaging of the manufactured machinery parts.',
        created_at: '2025-03-15T08:00:00Z',
        updated_at: '2025-04-20T08:00:00Z',
        machineries: []
      }
    ];

    // Usamos el assembler para convertir la respuesta si es necesario
    return of(this.assembler.toProductionLineList(response));
  }

  // Método específico para obtener solo id y name
  getProductionLineIdAndName(): Observable<{ id: number, name: string }[]> {
    return this.getProductionLines().pipe(
      map((productionLines: ProductionLine[]) => 
        productionLines.map(line => ({
          id: line.id,
          name: line.name
        }))
      )
    );
  }
}
