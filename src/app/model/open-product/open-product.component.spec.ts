import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OpenProductComponent } from './open-product.component';

describe('OpenProductComponent', () => {
  let component: OpenProductComponent;
  let fixture: ComponentFixture<OpenProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenProductComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OpenProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
