import { TestBed } from '@angular/core/testing';

import { OrderEventsService } from './order-events.service';

describe('OrderEventsService', () => {
  let service: OrderEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
