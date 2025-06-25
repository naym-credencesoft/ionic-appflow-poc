import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KomPage } from './kom.page';

describe('KomPage', () => {
  let component: KomPage;
  let fixture: ComponentFixture<KomPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KomPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(KomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
