import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderReportsPage } from './order-reports.page';

describe('OrderReportsPage', () => {
  let component: OrderReportsPage;
  let fixture: ComponentFixture<OrderReportsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderReportsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderReportsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
