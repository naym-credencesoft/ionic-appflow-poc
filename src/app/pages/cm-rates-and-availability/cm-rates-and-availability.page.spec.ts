import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CmRatesAndAvailabilityPage } from './cm-rates-and-availability.page';

describe('CmRatesAndAvailabilityPage', () => {
  let component: CmRatesAndAvailabilityPage;
  let fixture: ComponentFixture<CmRatesAndAvailabilityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmRatesAndAvailabilityPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CmRatesAndAvailabilityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
