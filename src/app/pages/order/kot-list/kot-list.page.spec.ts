import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KotListPage } from './kot-list.page';

describe('KotListPage', () => {
  let component: KotListPage;
  let fixture: ComponentFixture<KotListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KotListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(KotListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
