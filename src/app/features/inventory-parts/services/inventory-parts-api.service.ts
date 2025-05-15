import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { InventoryPartEntity} from '../../shared/models/inventory-part.entity';

@Injectable({
  providedIn: 'root'
})
export class InventoryPartEntitysApiService {// Ajusta esto según tu configuración
  private apiUrl = 'http://localhost:3000/inventory-parts';
  constructor(private http: HttpClient) {}

  private calculateStockStatus(currentStock: number, minStock: number): string {
    if (currentStock <= 0) {
      return 'CERO';
    } else if (currentStock < minStock) {
      return 'LOW';
    } else if (currentStock === minStock) {
      return 'OK';
    } else {
      return 'OK';
    }
  }

  private preparePartData(data: Partial<InventoryPartEntity>): Partial<InventoryPartEntity> {
    if (data.current_stock !== undefined && data.min_stock !== undefined && !data.stock_status) {
      return {
        ...data,
        stock_status: this.calculateStockStatus(data.current_stock, data.min_stock)
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
