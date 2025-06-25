import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderFooterPage } from './order-footer.page';

describe('OrderFooterPage', () => {
  let component: OrderFooterPage;
  let fixture: ComponentFixture<OrderFooterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderFooterPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderFooterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
