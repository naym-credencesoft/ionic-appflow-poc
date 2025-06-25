import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RoomListPage } from './room-list.page';

describe('RoomListPage', () => {
  let component: RoomListPage;
  let fixture: ComponentFixture<RoomListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RoomListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
