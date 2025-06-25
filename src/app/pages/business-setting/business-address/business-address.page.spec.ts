import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessAddressPage } from './business-address.page';

describe('BusinessAddressPage', () => {
  let component: BusinessAddressPage;
  let fixture: ComponentFixture<BusinessAddressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessAddressPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessAddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
