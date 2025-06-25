import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VariationListPage } from './variation-list.page';

describe('VariationListPage', () => {
  let component: VariationListPage;
  let fixture: ComponentFixture<VariationListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariationListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VariationListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
