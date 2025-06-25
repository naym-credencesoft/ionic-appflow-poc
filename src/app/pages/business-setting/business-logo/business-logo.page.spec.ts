import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessLogoPage } from './business-logo.page';

describe('BusinessLogoPage', () => {
  let component: BusinessLogoPage;
  let fixture: ComponentFixture<BusinessLogoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessLogoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessLogoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
