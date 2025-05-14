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
  async getParts(): Promise<InventoryPartEntity[]> {
    return firstValueFrom(this.http.get<InventoryPartEntity[]>(this.apiUrl));
  }
  async getPartById(id: number): Promise<InventoryPartEntity> {
    return firstValueFrom(this.http.get<InventoryPartEntity>(`${this.apiUrl}/${id}`));
  }
  async createPart(data: Partial<InventoryPartEntity>): Promise<InventoryPartEntity> {
    return firstValueFrom(this.http.post<InventoryPartEntity>(this.apiUrl, data));
  }
  async updatePart(id: number, data: Partial<InventoryPartEntity>): Promise<InventoryPartEntity> {
    return firstValueFrom(this.http.put<InventoryPartEntity>(`${this.apiUrl}/${id}`, data));
  }
  async deletePart(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
  }
}
