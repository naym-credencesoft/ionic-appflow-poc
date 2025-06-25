import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserServicePage } from './user-service.page';

describe('UserServicePage', () => {
  let component: UserServicePage;
  let fixture: ComponentFixture<UserServicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserServicePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
