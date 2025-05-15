// inventory-part.entity.ts

import { PurchaseOrderEntity } from './purchase-orders.entity';

export class InventoryPartEntity {
  id!: number;
  code!: string;
  name!: string;
  description!: string;
  current_stock!: number;
  min_stock!: number;
  unit_price!: number;
  stock_status!: string;
  last_restock!: string;
  purchase_orders: PurchaseOrderEntity[] = [];

  constructor({
      id = 0,
      code = '',
      name = '',
      description = '',
      current_stock = 0,
      min_stock = 0,
      unit_price = 0,
      stock_status = '',
      last_restock = '',
      purchase_orders = []
  }) {
      this.id = id;
      this.code = code;
      this.name = name;
      this.description = description;
      this.current_stock = current_stock;
      this.min_stock = min_stock;
      this.unit_price = unit_price;
      this.stock_status = stock_status;
      this.last_restock = last_restock;
      this.purchase_orders = purchase_orders;
  }
}
