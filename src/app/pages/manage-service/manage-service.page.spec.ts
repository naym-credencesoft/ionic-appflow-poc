import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageServicePage } from './manage-service.page';

describe('ManageServicePage', () => {
  let component: ManageServicePage;
  let fixture: ComponentFixture<ManageServicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageServicePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
