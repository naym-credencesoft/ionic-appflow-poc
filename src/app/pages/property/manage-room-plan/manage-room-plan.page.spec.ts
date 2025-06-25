import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManageRoomPlanPage } from './manage-room-plan.page';

describe('ManageRoomPlanPage', () => {
  let component: ManageRoomPlanPage;
  let fixture: ComponentFixture<ManageRoomPlanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageRoomPlanPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageRoomPlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
