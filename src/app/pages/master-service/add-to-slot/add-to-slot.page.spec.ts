import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToSlotPage } from './add-to-slot.page';

describe('AddToSlotPage', () => {
  let component: AddToSlotPage;
  let fixture: ComponentFixture<AddToSlotPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddToSlotPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToSlotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
