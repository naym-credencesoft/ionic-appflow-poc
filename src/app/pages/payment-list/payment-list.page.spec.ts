import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentListPage } from './payment-list.page';

describe('PaymentListPage', () => {
  let component: PaymentListPage;
  let fixture: ComponentFixture<PaymentListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
