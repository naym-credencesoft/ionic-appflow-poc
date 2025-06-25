import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddOrUpdatePlanPage } from './add-or-update-plan.page';

describe('AddOrUpdatePlanPage', () => {
  let component: AddOrUpdatePlanPage;
  let fixture: ComponentFixture<AddOrUpdatePlanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrUpdatePlanPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddOrUpdatePlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
