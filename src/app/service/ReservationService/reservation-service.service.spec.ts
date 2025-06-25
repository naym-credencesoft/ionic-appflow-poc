import { TestBed } from '@angular/core/testing';

import { ReservationServiceService } from './reservation-service.service';

describe('ReservationServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReservationServiceService = TestBed.get(ReservationServiceService);
    expect(service).toBeTruthy();
  });
});
