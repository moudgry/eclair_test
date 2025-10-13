import { TestBed } from '@angular/core/testing';

import { ProductHelpersService } from './product-helpers.service';

describe('ProductHelpersService', () => {
  let service: ProductHelpersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductHelpersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
