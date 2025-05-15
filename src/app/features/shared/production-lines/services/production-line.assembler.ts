// src/app/features/shared/production-lines/assemblers/production-line.assembler.ts

import { Injectable } from '@angular/core';
import { ProductionLine } from '../models/production-line.model';
import { ProductionLineResponse } from './production-line.response';
import { Machinery } from '../../machinery/models/machinery.model'; // Importa la interfaz Machinery para los detalles de maquinaria

@Injectable({
  providedIn: 'root',
})
export class ProductionLineAssembler {

  // Convierte la respuesta del API en un formato que necesitamos
  toProductionLineList(response: ProductionLineResponse[]): ProductionLine[] {
    return response.map(item => ({
      id: item.id,
      plant_id: item.plant_id,
      name: item.name,
      capacity: item.capacity,
      status: item.status,
      description: item.description,
      created_at: item.created_at,
      updated_at: item.updated_at,
      machineries: this.toMachineryList(item.machineries) // Convierte las maquinarias asociadas
    }));
  }

  // Convierte las maquinarias desde el formato de respuesta al modelo esperado
  private toMachineryList(machineryResponse: Machinery[]): Machinery[] {
    return machineryResponse.map(machinery => ({
      id: machinery.id,
      name: machinery.name,
      model: machinery.model,
      brand: machinery.brand,
      serial_number: machinery.serial_number,
      production_capacity: machinery.production_capacity,
      recommendations: machinery.recommendations,
      status: machinery.status,
      user_creator: machinery.user_creator,
      user_updater: machinery.user_updater,
      created_at: machinery.created_at,
      updated_at: machinery.updated_at,
    }));
  }
}
