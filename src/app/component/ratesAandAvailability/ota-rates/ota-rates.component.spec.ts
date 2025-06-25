import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OtaRatesComponent } from './ota-rates.component';

describe('OtaRatesComponent', () => {
  let component: OtaRatesComponent;
  let fixture: ComponentFixture<OtaRatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtaRatesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OtaRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
