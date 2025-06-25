import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalReservationPage } from './external-reservation.page';

describe('ExternalReservationPage', () => {
  let component: ExternalReservationPage;
  let fixture: ComponentFixture<ExternalReservationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalReservationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalReservationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
