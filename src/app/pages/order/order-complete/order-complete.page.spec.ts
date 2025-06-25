import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderCompletePage } from './order-complete.page';

describe('OrderCompletePage', () => {
  let component: OrderCompletePage;
  let fixture: ComponentFixture<OrderCompletePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderCompletePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderCompletePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
