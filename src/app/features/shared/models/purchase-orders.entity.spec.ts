import { PurchaseOrderEntity } from './purchase-orders.entity';

describe('PurchaseOrderEntity', () => {
  it('should create an instance', () => {
    expect(new PurchaseOrderEntity({})).toBeTruthy();
  });
});
