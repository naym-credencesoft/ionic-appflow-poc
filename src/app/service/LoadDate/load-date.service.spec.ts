import { TestBed } from '@angular/core/testing';

import { LoadDateService } from './load-date.service';

describe('LoadDateService', () => {
  let service: LoadDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
