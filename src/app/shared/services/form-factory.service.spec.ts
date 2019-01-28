import { TestBed } from '@angular/core/testing';

import { FormFactoryService } from './form-factory.service';

describe('FormFactoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormFactoryService = TestBed.get(FormFactoryService);
    expect(service).toBeTruthy();
  });
});
