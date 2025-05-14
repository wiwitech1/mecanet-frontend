import { TestBed } from '@angular/core/testing';

import { InventoryPartsApiService } from './inventory-parts-api.service';

describe('InventoryPartsApiService', () => {
  let service: InventoryPartsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryPartsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
