import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NightAuditReportPage } from './night-audit-report.page';

describe('NightAuditReportPage', () => {
  let component: NightAuditReportPage;
  let fixture: ComponentFixture<NightAuditReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NightAuditReportPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NightAuditReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
