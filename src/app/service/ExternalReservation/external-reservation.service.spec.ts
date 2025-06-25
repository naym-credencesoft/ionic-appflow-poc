import { TestBed } from '@angular/core/testing';

import { ExternalReservationService } from './external-reservation.service';

describe('ExternalReservationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExternalReservationService = TestBed.get(ExternalReservationService);
    expect(service).toBeTruthy();
  });
});
