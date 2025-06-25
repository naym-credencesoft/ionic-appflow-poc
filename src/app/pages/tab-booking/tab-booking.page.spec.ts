import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabBookingPage } from './tab-booking.page';

describe('TabBookingPage', () => {
  let component: TabBookingPage;
  let fixture: ComponentFixture<TabBookingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabBookingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
