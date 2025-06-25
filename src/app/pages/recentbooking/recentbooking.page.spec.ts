import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentbookingPage } from './recentbooking.page';

describe('RecentbookingPage', () => {
  let component: RecentbookingPage;
  let fixture: ComponentFixture<RecentbookingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentbookingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentbookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
