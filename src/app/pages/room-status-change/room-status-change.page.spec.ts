import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RoomStatusChangePage } from './room-status-change.page';

describe('RoomStatusChangePage', () => {
  let component: RoomStatusChangePage;
  let fixture: ComponentFixture<RoomStatusChangePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomStatusChangePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RoomStatusChangePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
