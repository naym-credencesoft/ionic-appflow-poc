import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InHouseGuestPage } from './in-house-guest.page';

describe('InHouseGuestPage', () => {
  let component: InHouseGuestPage;
  let fixture: ComponentFixture<InHouseGuestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InHouseGuestPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InHouseGuestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
