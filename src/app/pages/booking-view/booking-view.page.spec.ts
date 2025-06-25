import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BookingViewPage } from './booking-view.page';

describe('BookingViewPage', () => {
  let component: BookingViewPage;
  let fixture: ComponentFixture<BookingViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BookingViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
