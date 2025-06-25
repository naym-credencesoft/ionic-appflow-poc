import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerStatusPage } from './customer-status.page';

describe('CustomerStatusPage', () => {
  let component: CustomerStatusPage;
  let fixture: ComponentFixture<CustomerStatusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerStatusPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
