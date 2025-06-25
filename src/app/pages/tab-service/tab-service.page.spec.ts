import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabServicePage } from './tab-service.page';

describe('TabServicePage', () => {
  let component: TabServicePage;
  let fixture: ComponentFixture<TabServicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabServicePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
