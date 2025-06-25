import { TestBed } from '@angular/core/testing';

import { SubscriptionServiceService } from './subscription-service.service';

describe('SubscriptionServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubscriptionServiceService = TestBed.get(SubscriptionServiceService);
    expect(service).toBeTruthy();
  });
});
