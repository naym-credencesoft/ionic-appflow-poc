import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckedInDialogComponent } from './checked-in-dialog.component';

describe('CheckedInDialogComponent', () => {
  let component: CheckedInDialogComponent;
  let fixture: ComponentFixture<CheckedInDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckedInDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckedInDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
