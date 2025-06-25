import { TestBed } from '@angular/core/testing';

import { DateServiceService } from './date-service.service';

describe('DateServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DateServiceService = TestBed.get(DateServiceService);
    expect(service).toBeTruthy();
  });
});
