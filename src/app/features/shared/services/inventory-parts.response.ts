
export class InventoryPartResource {
  _id!: number;
  code!: string;
  name!: string;
  description!: string;
  current_stock!: number;
  min_stock!: number;
  unit_price!: number;
  stock_status!: string;
  last_restock!: string;
  constructor({
      id = 0,
      code = '',
      name = '',
      description = '',
      current_stock = 0,
      min_stock = 0,
      unit_price = 0.00,
      stock_status = '',
      last_restock = ''
  } = {}) {
      this._id = id;
      this.code = code;
      this.name = name;
      this.description = description;
      this.current_stock = current_stock;
      this.min_stock = min_stock;
      this.unit_price = unit_price;
      this.stock_status = stock_status;
      this.last_restock = last_restock;
  }
}
export class InventoryPartResponse {
  data: InventoryPartResource[];
  info: { count: number };
  constructor(data: InventoryPartResource[] = []) {
      this.data = data;
      this.info = {
          count: data.length
      };
  }
}

