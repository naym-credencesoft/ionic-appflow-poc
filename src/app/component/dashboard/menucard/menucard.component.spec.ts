import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenucardComponent } from './menucard.component';

describe('MenucardComponent', () => {
  let component: MenucardComponent;
  let fixture: ComponentFixture<MenucardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenucardComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenucardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
