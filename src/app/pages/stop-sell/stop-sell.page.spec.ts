import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StopSellPage } from './stop-sell.page';

describe('StopSellPage', () => {
  let component: StopSellPage;
  let fixture: ComponentFixture<StopSellPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StopSellPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StopSellPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
