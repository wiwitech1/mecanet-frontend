import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { InventoryPartEntity} from '../../shared/models/inventory-part.entity';
import { calculateStockStatus } from '../../shared/services/inventory-part.assembler';

@Injectable({
  providedIn: 'root'
})
export class InventoryPartEntitysApiService {// Ajusta esto según tu configuración
  private apiUrl = 'https://6854b3de6a6ef0ed662fcca2.mockapi.io/api/v1/inventory-parts';
  constructor(private http: HttpClient) {}

  private preparePartData(data: Partial<InventoryPartEntity>): Partial<InventoryPartEntity> {
    if (data.current_stock !== undefined && data.min_stock !== undefined) {
      return {
        ...data,
        stock_status: calculateStockStatus(data.current_stock, data.min_stock)
      };
    }
    return data;
  }

  async getParts(): Promise<InventoryPartEntity[]> {
    return firstValueFrom(this.http.get<InventoryPartEntity[]>(this.apiUrl));
  }
  async getPartById(id: number): Promise<InventoryPartEntity> {
    return firstValueFrom(this.http.get<InventoryPartEntity>(`${this.apiUrl}/${id}`));
  }
  async createPart(data: Partial<InventoryPartEntity>): Promise<InventoryPartEntity> {
    const preparedData = this.preparePartData(data);
    return firstValueFrom(this.http.post<InventoryPartEntity>(this.apiUrl, preparedData));
  }
  async updatePart(id: number, data: Partial<InventoryPartEntity>): Promise<InventoryPartEntity> {
    const preparedData = this.preparePartData(data);
    return firstValueFrom(this.http.put<InventoryPartEntity>(`${this.apiUrl}/${id}`, preparedData));
  }
  async deletePart(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
  }
}
