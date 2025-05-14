export class PurchaseOrderResource {
  _id: number;
  inventory_part_id: number;
  quantity: number;
  price: number;
  order_date: string;
  received_date: string;
  status: string;
  user_id: number;
  constructor({
      id = 0,
      inventory_part_id = 0,
      quantity = 0,
      price = 0.00,
      order_date = '',
      received_date = '',
      status = 'PENDING',
      user_id = 0
  } = {}) {
      this._id = id;
      this.inventory_part_id = inventory_part_id;
      this.quantity = quantity;
      this.price = price;
      this.order_date = order_date;
      this.received_date = received_date;
      this.status = status;
      this.user_id = user_id;
  }
}

export class PurchaseOrderResponse {
  data: PurchaseOrderResource[];
  info: { count: number };

  constructor(data: PurchaseOrderResource[] = []) {
      this.data = data;
      this.info = {
          count: data.length
      };
  }
}
