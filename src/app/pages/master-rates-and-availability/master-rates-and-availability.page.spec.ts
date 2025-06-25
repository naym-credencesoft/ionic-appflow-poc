import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MasterRatesAndAvailabilityPage } from './master-rates-and-availability.page';

describe('MasterRatesAndAvailabilityPage', () => {
  let component: MasterRatesAndAvailabilityPage;
  let fixture: ComponentFixture<MasterRatesAndAvailabilityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterRatesAndAvailabilityPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MasterRatesAndAvailabilityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
