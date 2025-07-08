import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, map } from 'rxjs';
import { InventoryPartEntity } from '../../shared/models/inventory-part.entity';
import { calculateStockStatus } from '../../shared/services/inventory-part.assembler';
import { InventoryItemEntity } from '../../shared/models/inventory-item.entity';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryPartEntitysApiService {
  private apiUrl = environment.serverBaseUrl + '/inventory-items';
  constructor(private http: HttpClient) {}


  private getHeaders(): HttpHeaders {
    const userSession = localStorage.getItem('userSession');
    const token = userSession ? JSON.parse(userSession).token : null;

    if (!token) {
      throw new Error('No hay token disponible');
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }



  /* ---------------------- Mapeadores ---------------------- */
  private fromBackend(data: any): InventoryPartEntity {
    return new InventoryPartEntity({
      id: data.id,
      code: data.sku,
      name: data.name,
      description: data.description,
      category: data.category,
      unit: data.unit,
      location: data.location,
      unit_price: data.unitPrice,
      current_stock: data.currentStock,
      min_stock: data.minimumStock,
      status: data.status,
      compatible_machine_ids: data.compatibleMachineIds ?? [],
      stock_status: calculateStockStatus(data.currentStock, data.minimumStock),
      created_at: data.createdAt,
      updated_at: data.updatedAt
    });
  }

  private toBackend(data: Partial<InventoryPartEntity>): InventoryItemEntity {
    const anyData = data as any;
    const minimum = anyData.minimumStock ?? (data as any).min_stock ?? 0;

    return new InventoryItemEntity({
      sku: data.code,
      name: data.name,
      description: data.description,
      category: data.category as any,
      unit: data.unit,
      unitPrice: (data as any).unitPrice ?? data.unit_price,
      minimumStock: minimum,
      location: data.location,
      plantId: (data as any).plantId ?? 1,
      compatibleMachineIds: data.compatible_machine_ids ?? []
    });
  }

  /* ---------------------- CRUD ---------------------- */
  async getParts(page = 0, size = 20): Promise<InventoryPartEntity[]> {
    console.log('getParts',page,size);
    return firstValueFrom(
      this.http
        .get<any>(this.apiUrl, { params: { page, size }, headers: this.getHeaders() })
        .pipe(map(resp => (resp.content ?? []).map((item: any) => this.fromBackend(item))))
    );
  }

  async getPartById(id: number): Promise<InventoryPartEntity> {
    console.log('getPartById',id);
    return firstValueFrom(
      this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(map(res => this.fromBackend(res)))
    );
  }

  async createPart(data: Partial<InventoryPartEntity>): Promise<InventoryPartEntity> {
    console.log('createPart',data);
    return firstValueFrom(
      this.http
        .post<any>(this.apiUrl, this.toBackend(data), { headers: this.getHeaders() })
        .pipe(map(res => this.fromBackend(res)))
    );
  }

  async updatePart(id: number, data: Partial<InventoryPartEntity>): Promise<InventoryPartEntity> {
    console.log('updatePart',data);
    return firstValueFrom(
      this.http
        .put<any>(`${this.apiUrl}/${id}`, this.toBackend(data), { headers: this.getHeaders() })
        .pipe(map(res => this.fromBackend(res)))
    );
  }

  async deletePart(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }));
  }

  async addStock(id: number, dto: {quantity:number; reason:string; unitCost:number; reference:string}): Promise<void> {
    await firstValueFrom(this.http.post<void>(`${this.apiUrl}/${id}/add-stock`, dto, { headers: this.getHeaders() }));
  }
}
