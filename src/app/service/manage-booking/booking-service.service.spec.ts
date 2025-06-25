import { TestBed } from '@angular/core/testing';

import { BookingServiceService } from './booking-service.service';

describe('BookingServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BookingServiceService = TestBed.get(BookingServiceService);
    expect(service).toBeTruthy();
  });
});
