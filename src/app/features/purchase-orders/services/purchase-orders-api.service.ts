import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PurchaseOrderEntity } from '../../shared/models/purchase-orders.entity';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrdersApiService {
  private apiUrl = 'http://localhost:3000/purchase-orders';

  constructor(private http: HttpClient) {}

  async getOrders(): Promise<PurchaseOrderEntity[]> {
    return firstValueFrom(this.http.get<PurchaseOrderEntity[]>(this.apiUrl));
  }

  async getOrderById(id: number): Promise<PurchaseOrderEntity> {
    return firstValueFrom(this.http.get<PurchaseOrderEntity>(`${this.apiUrl}/${id}`));
  }

  async createOrder(data: Partial<PurchaseOrderEntity>): Promise<PurchaseOrderEntity> {
    return firstValueFrom(this.http.post<PurchaseOrderEntity>(this.apiUrl, data));
  }

  async updateOrder(id: number, data: Partial<PurchaseOrderEntity>): Promise<PurchaseOrderEntity> {
    return firstValueFrom(this.http.put<PurchaseOrderEntity>(`${this.apiUrl}/${id}`, data));
  }

  async deleteOrder(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
  }
}
