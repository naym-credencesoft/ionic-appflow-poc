import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RoomRateAndAvailabilityPage } from './room-rate-and-availability.page';

describe('RoomRateAndAvailabilityPage', () => {
  let component: RoomRateAndAvailabilityPage;
  let fixture: ComponentFixture<RoomRateAndAvailabilityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomRateAndAvailabilityPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RoomRateAndAvailabilityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
