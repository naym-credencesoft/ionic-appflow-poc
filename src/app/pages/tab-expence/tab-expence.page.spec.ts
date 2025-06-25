import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabExpencePage } from './tab-expence.page';

describe('TabExpencePage', () => {
  let component: TabExpencePage;
  let fixture: ComponentFixture<TabExpencePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabExpencePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabExpencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
