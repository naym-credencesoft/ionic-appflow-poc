import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderDashboardPage } from './order-dashboard.page';

describe('OrderDashboardPage', () => {
  let component: OrderDashboardPage;
  let fixture: ComponentFixture<OrderDashboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDashboardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
