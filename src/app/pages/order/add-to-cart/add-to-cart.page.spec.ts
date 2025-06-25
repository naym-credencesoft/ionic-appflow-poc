import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToCartPage } from './add-to-cart.page';

describe('AddToCartPage', () => {
  let component: AddToCartPage;
  let fixture: ComponentFixture<AddToCartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddToCartPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToCartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
