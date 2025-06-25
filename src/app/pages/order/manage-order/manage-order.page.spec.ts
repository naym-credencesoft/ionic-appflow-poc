import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrderPage } from './manage-order.page';

describe('ManageOrderPage', () => {
  let component: ManageOrderPage;
  let fixture: ComponentFixture<ManageOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageOrderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
