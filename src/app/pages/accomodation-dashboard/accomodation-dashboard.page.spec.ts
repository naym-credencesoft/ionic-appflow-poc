import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AccomodationDashboardPage } from './accomodation-dashboard.page';

describe('AccomodationDashboardPage', () => {
  let component: AccomodationDashboardPage;
  let fixture: ComponentFixture<AccomodationDashboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccomodationDashboardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccomodationDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
