import { TestBed } from '@angular/core/testing';

import { InventoryPartEntitysApiService } from './inventory-parts-api.service';

describe('InventoryPartsApiService', () => {
  let service: InventoryPartEntitysApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryPartEntitysApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
