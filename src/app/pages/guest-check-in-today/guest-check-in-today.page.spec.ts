import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestCheckInTodayPage } from './guest-check-in-today.page';

describe('GuestCheckInTodayPage', () => {
  let component: GuestCheckInTodayPage;
  let fixture: ComponentFixture<GuestCheckInTodayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestCheckInTodayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestCheckInTodayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
