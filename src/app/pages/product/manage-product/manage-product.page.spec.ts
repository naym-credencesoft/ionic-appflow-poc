import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManageProductPage } from './manage-product.page';

describe('ManageProductPage', () => {
  let component: ManageProductPage;
  let fixture: ComponentFixture<ManageProductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageProductPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
