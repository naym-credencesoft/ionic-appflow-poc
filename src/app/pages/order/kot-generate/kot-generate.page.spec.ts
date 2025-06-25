import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KotGeneratePage } from './kot-generate.page';

describe('KotGeneratePage', () => {
  let component: KotGeneratePage;
  let fixture: ComponentFixture<KotGeneratePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KotGeneratePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(KotGeneratePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
