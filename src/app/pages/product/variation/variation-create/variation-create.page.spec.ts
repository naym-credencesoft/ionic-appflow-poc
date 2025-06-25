import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VariationCreatePage } from './variation-create.page';

describe('VariationCreatePage', () => {
  let component: VariationCreatePage;
  let fixture: ComponentFixture<VariationCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariationCreatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VariationCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
