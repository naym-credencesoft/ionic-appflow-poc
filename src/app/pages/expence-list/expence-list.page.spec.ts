import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenceListPage } from './expence-list.page';

describe('ExpenceListPage', () => {
  let component: ExpenceListPage;
  let fixture: ComponentFixture<ExpenceListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenceListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenceListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
