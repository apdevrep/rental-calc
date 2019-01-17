import { TestBed } from '@angular/core/testing';

import { PropertyCacheService } from './property-cache.service';

describe('PropertyCacheService', () => {
  let service: PropertyCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [PropertyCacheService]});
    service = TestBed.get(PropertyCacheService);
  });


});
