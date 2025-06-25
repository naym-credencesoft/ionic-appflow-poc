import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KotPage } from './kot.page';

describe('KotPage', () => {
  let component: KotPage;
  let fixture: ComponentFixture<KotPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KotPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(KotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
