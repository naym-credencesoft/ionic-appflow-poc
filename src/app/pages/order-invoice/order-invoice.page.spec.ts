import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderInvoicePage } from './order-invoice.page';

describe('OrderInvoicePage', () => {
  let component: OrderInvoicePage;
  let fixture: ComponentFixture<OrderInvoicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderInvoicePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderInvoicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
