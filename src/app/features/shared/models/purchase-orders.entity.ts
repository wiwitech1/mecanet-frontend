export class PurchaseOrderEntity {
  id!: number;
  orderNumber!: string;
  supplier!: string;
  status!: string;
  orderDate!: string;
  expectedDate!: string;
  totalAmount!: number;
  notes?: string;
  inventoryPartId?: number;
  quantity?: number;
  price?: number;
  receivedDate?: string;
  userId?: number;

  constructor({
      id = 0,
      order_number = '',
      supplier = '',
      status = 'PENDING',
      order_date = '',
      expected_date = '',
      total_amount = 0,
      notes = '',
      inventory_part_id = 0,
      quantity = 0,
      price = 0.00,
      received_date = '',
      user_id = 0
  }) {
      this.id = id;
      this.orderNumber = order_number;
      this.supplier = supplier;
      this.status = status;
      this.orderDate = order_date;
      this.expectedDate = expected_date;
      this.totalAmount = total_amount;
      this.notes = notes;
      this.inventoryPartId = inventory_part_id;
      this.quantity = quantity;
      this.price = price;
      this.receivedDate = received_date;
      this.userId = user_id;
  }
}
