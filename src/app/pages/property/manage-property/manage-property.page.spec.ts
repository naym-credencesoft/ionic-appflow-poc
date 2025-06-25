import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManagePropertyPage } from './manage-property.page';

describe('ManagePropertyPage', () => {
  let component: ManagePropertyPage;
  let fixture: ComponentFixture<ManagePropertyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePropertyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManagePropertyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
