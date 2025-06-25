import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerLoyalityPage } from './customer-loyality.page';

describe('CustomerLoyalityPage', () => {
  let component: CustomerLoyalityPage;
  let fixture: ComponentFixture<CustomerLoyalityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerLoyalityPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerLoyalityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
