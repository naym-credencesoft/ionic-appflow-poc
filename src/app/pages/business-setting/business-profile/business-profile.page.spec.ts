import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessProfilePage } from './business-profile.page';

describe('BusinessProfilePage', () => {
  let component: BusinessProfilePage;
  let fixture: ComponentFixture<BusinessProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessProfilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
