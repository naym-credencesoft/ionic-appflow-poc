import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MultibookinglistPage } from './multibookinglist.page';

describe('MultibookinglistPage', () => {
  let component: MultibookinglistPage;
  let fixture: ComponentFixture<MultibookinglistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultibookinglistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MultibookinglistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
