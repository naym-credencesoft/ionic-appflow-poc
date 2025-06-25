import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuActionBookingPage } from './menu-action-booking.page';

describe('MenuActionBookingPage', () => {
  let component: MenuActionBookingPage;
  let fixture: ComponentFixture<MenuActionBookingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuActionBookingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuActionBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
