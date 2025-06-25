import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionBookingMenuComponent } from './action-booking-menu.component';

describe('ActionBookingMenuComponent', () => {
  let component: ActionBookingMenuComponent;
  let fixture: ComponentFixture<ActionBookingMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionBookingMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionBookingMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
