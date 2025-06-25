import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessManagerPage } from './business-manager.page';

describe('BusinessManagerPage', () => {
  let component: BusinessManagerPage;
  let fixture: ComponentFixture<BusinessManagerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessManagerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessManagerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
