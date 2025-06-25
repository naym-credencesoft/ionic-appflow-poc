import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerLaststayPage } from './customer-laststay.page';

describe('CustomerLaststayPage', () => {
  let component: CustomerLaststayPage;
  let fixture: ComponentFixture<CustomerLaststayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerLaststayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerLaststayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
