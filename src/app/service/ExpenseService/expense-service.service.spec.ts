import { TestBed } from '@angular/core/testing';

import { ExpenseServiceService } from './expense-service.service';

describe('ExpenseServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExpenseServiceService = TestBed.get(ExpenseServiceService);
    expect(service).toBeTruthy();
  });
});
