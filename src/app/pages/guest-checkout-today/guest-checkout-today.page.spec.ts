import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestCheckoutTodayPage } from './guest-checkout-today.page';

describe('GuestCheckoutTodayPage', () => {
  let component: GuestCheckoutTodayPage;
  let fixture: ComponentFixture<GuestCheckoutTodayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestCheckoutTodayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestCheckoutTodayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
