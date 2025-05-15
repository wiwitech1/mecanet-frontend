import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PurchaseOrderEntity } from '../../shared/models/purchase-orders.entity';
import { InventoryPartEntitysApiService } from '../../inventory-parts/services/inventory-parts-api.service';
import { InventoryPartEntity } from '../../shared/models/inventory-part.entity';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrdersApiService {
  private apiUrl = 'http://localhost:3000/purchase-orders';

  constructor(
    private http: HttpClient,
    private inventoryPartsService: InventoryPartEntitysApiService
  ) {}

  async getOrders(): Promise<(PurchaseOrderEntity & { inventoryPart?: InventoryPartEntity })[]> {
    const orders = await firstValueFrom(this.http.get<PurchaseOrderEntity[]>(this.apiUrl));
    return Promise.all(orders.map(async order => {
      try {
        const inventoryPart = order.inventoryPartId ?
          await this.inventoryPartsService.getPartById(Number(order.inventoryPartId)) :
          undefined;

        console.log('Order:', order); // Debug
        console.log('InventoryPart found:', inventoryPart); // Debug

        return {
          ...order,
          inventoryPart
        };
      } catch (error) {
        console.error(`Error fetching inventory part ${order.inventoryPartId}:`, error);
        return {
          ...order,
          inventoryPart: undefined
        };
      }
    }));
  }

  async getOrderById(id: number): Promise<PurchaseOrderEntity & { inventoryPart?: InventoryPartEntity }> {
    const order = await firstValueFrom(this.http.get<PurchaseOrderEntity>(`${this.apiUrl}/${id}`));
    return {
      ...order,
      inventoryPart: order.inventoryPartId ?
        await this.inventoryPartsService.getPartById(order.inventoryPartId) :
        undefined
    };
  }

  async createOrder(data: Partial<PurchaseOrderEntity>): Promise<PurchaseOrderEntity> {
    return firstValueFrom(this.http.post<PurchaseOrderEntity>(this.apiUrl, data));
  }

  async updateOrder(id: string | number, data: Partial<PurchaseOrderEntity>): Promise<PurchaseOrderEntity> {
    return firstValueFrom(this.http.put<PurchaseOrderEntity>(`${this.apiUrl}/${id}`, data));
  }

  async deleteOrder(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
  }
}
