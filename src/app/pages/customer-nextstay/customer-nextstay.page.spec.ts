import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerNextstayPage } from './customer-nextstay.page';

describe('CustomerNextstayPage', () => {
  let component: CustomerNextstayPage;
  let fixture: ComponentFixture<CustomerNextstayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerNextstayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerNextstayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
