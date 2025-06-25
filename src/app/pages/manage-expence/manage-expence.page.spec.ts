import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageExpencePage } from './manage-expence.page';

describe('ManageExpencePage', () => {
  let component: ManageExpencePage;
  let fixture: ComponentFixture<ManageExpencePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageExpencePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageExpencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
