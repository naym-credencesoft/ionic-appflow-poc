import { TestBed } from '@angular/core/testing';

import { BookingListActionService } from './booking-list-action.service';

describe('BookingListActionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BookingListActionService = TestBed.get(BookingListActionService);
    expect(service).toBeTruthy();
  });
});
