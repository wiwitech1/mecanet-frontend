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
  category!: string;
  unit!: string;
  location!: string;
  status!: string;
  compatible_machine_ids: number[] = [];
  stock_status!: string;
  last_restock!: string;
  created_at?: string;
  updated_at?: string;
  purchase_orders: PurchaseOrderEntity[] = [];

  constructor({
      id = 0,
      code = '',
      name = '',
      description = '',
      current_stock = 0,
      min_stock = 0,
      unit_price = 0,
      category = '',
      unit = '',
      location = '',
      status = '',
      compatible_machine_ids = [],
      stock_status = '',
      last_restock = '',
      purchase_orders = [],
      created_at = '',
      updated_at = ''
  }) {
      this.id = id;
      this.code = code;
      this.name = name;
      this.description = description;
      this.current_stock = current_stock;
      this.min_stock = min_stock;
      this.unit_price = unit_price;
      this.category = category;
      this.unit = unit;
      this.location = location;
      this.status = status;
      this.compatible_machine_ids = compatible_machine_ids;
      this.stock_status = stock_status;
      this.last_restock = last_restock;
      this.purchase_orders = purchase_orders;
      this.created_at = created_at;
      this.updated_at = updated_at;
  }
}
