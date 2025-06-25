import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGroupPage } from './product-group.page';

describe('ProductGroupPage', () => {
  let component: ProductGroupPage;
  let fixture: ComponentFixture<ProductGroupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductGroupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductGroupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
