import { TestBed } from '@angular/core/testing';

import { CountryConfigService } from './countryConfig.service';

describe('CountryConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CountryConfigService = TestBed.get(CountryConfigService);
    expect(service).toBeTruthy();
  });
});
