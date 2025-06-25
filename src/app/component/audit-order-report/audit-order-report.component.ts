import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExternalSiteList } from 'src/app/model/Booking/externalSiteList';
import { PropertiesOnlineTravelAgencies } from 'src/app/model/Booking/propertiesOTA';
import { CheckUserType } from 'src/app/model/checkUserType';
import { Booking } from 'src/app/model/manage-booking/Booking/Booking';
import { OTAChannelPropertyDTO } from 'src/app/model/otaPropertyDTO/ChannelManagerPropertyDTO';
import { Property } from 'src/app/model/property/Property';
import { Room } from 'src/app/model/room';
import { ApplicationUser } from 'src/app/model/user';
import { DateService } from 'src/app/service/DateService/date-service.service';
import { Audit } from 'src/app/service/audit';
import { AuthService } from 'src/app/service/auth.service';
import { BookingService } from 'src/app/service/manage-booking/booking-service.service';
import { PropertyService } from 'src/app/service/property/property.service';
import { ReportService } from 'src/app/service/report/report-service.service';
import { TokenStorage } from 'src/app/token.storage';
import { Location } from "@angular/common";

@Component({
  selector: 'app-audit-order-report',
  templateUrl: './audit-order-report.component.html',
  styleUrls: ['./audit-order-report.component.scss'],
})
export class AuditOrderReportComponent implements OnInit {

  pathString: string;
    propertyId: number;
    role: any[];
    dataSource: any;
    checkUserType: CheckUserType;
    properties: Property[] = [];
    isOrgAdmin: boolean;
    currency: any;
    property: Property;
  
    loader: boolean = false;
  
    bookings: Booking[] = [];
    bookingFilter: Booking[] = [];
  
    todayDate = new Date();
    fromDate: string;
    minToDate: Date;
    maxToDate: Date;
    reportfromDateString: string;
    reportToDateString: string;

    toDateMinMilliSeconds: number;
    toDateMaxMilliSeconds: number;
    booking: Booking;
  
    reportFromDate: FormControl = new FormControl();
    //reportToDate: FormControl = new FormControl();
    propertyControll: FormControl = new FormControl();
  
    roomName: any[] = [];
    BookingStatus: any[] = [];
    sourceOfBooking: any[] = [];
    BookingDate: string;
    CheckedInDate: string;
    CheckedOutDate: string;
  
    externalSite: FormControl = new FormControl();
    BookingStatusControll: FormControl = new FormControl();
    roomType: FormControl = new FormControl();
    bookingDateControll: FormControl = new FormControl();
    CheckedInDateControll: FormControl = new FormControl();
    CheckedOutDateControll: FormControl = new FormControl();
    searchByUserNameControl: FormControl = new FormControl();
    DueFilter: FormControl = new FormControl();
  
    rooms: Room[];
    externalSiteList: ExternalSiteList;
    propertyOTA: PropertiesOnlineTravelAgencies[];
    propertydetails: OTAChannelPropertyDTO;
  
    isDueAmount: boolean = false;
    date: Date;
    time: string;
  
    audits: Audit[] = [];  
    userData: ApplicationUser;
   constructor(
    public token: TokenStorage,
    private reportService: ReportService,
    private dateService: DateService,
    private propertyService: PropertyService,
    private bookingService: BookingService,
   
    // private locationBack: Location,
    public datepipe: DatePipe,
    private acRoute: ActivatedRoute,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService,
    private locationBack: Location,
   ){

    this.checkUserType = new CheckUserType();
    this.property = new Property();
    this.externalSiteList = new ExternalSiteList();
    this.propertydetails = new OTAChannelPropertyDTO();
    this.userData = new ApplicationUser();
   }
  
  
   ngOnInit() {
    const UserId = this.token.getUserId();
        this.authService.getUserByUserId(UserId).subscribe(data => {
          this.userData = data.body;
          this.loader = false;
          this.changeDetectorRefs.detectChanges();
    
        }, error => {
          this.loader = false;
        });
    this.acRoute.queryParams.subscribe((params) => {
        if (params['booking'] !== undefined) {
          let Id= params['booking'];
          this.getAllAuditByBookingId(Id);
        }
    })

    this.acRoute.queryParams.subscribe((params) => {
      if (params['order'] !== undefined) {
        let Id= params['order'];
        this.getAllAuditByOrderId(Id);
      }
  })
  
    if (this.acRoute.snapshot.params["id"] != null && this.acRoute.snapshot.params["id"] != undefined)
      {
        let Id = this.acRoute.snapshot.params["id"];
        this.getAllAuditByOrderId(Id);
      } 

    let booking = this.token.getBookingDetal();

    if (booking != null && booking != undefined)
    {
      let bookingId = booking.id;
      this.getAuditFReportByBookingId(bookingId);
    }

  }

  back() {
    // this.router.navigate(['/manage-order']);
    this.locationBack.back(); 
}

  // back() {
  //   this.locationBack.back();
  // }


  getAllAuditByBookingId(id){
    
    this.loader = true;
    this.propertyService.getAllAuditReportByBookingId(id).subscribe((response) => {

      this.audits = response;
      console.log("audits are4 " + JSON.stringify(this.audits))
      this.loader = false
      // this.dataSource = new MatTableDataSource(this.audits);
      this.changeDetectorRefs.detectChanges();
    }, error => {
      this.loader = false;
      this.changeDetectorRefs.detectChanges();
    });
  }
  getAuditFReportByBookingId(bookingId){
    this.loader = true;
    this.propertyService.getAllAuditReportByBookingId(bookingId).subscribe((response) => {

      this.audits = response;
      console.log("audits are " + JSON.stringify(this.audits))
      this.loader = false
      // this.dataSource = new MatTableDataSource(this.audits);
      this.changeDetectorRefs.detectChanges();
    }, error => {
      this.loader = false;
      this.changeDetectorRefs.detectChanges();
    });
  }

  getAllAuditByOrderId(id){
    this.loader = true;
    this.propertyService.getAllAuditReportByOrderId(id).subscribe((response) => {

      this.audits = response;
      this.loader = false
      // this.dataSource = new MatTableDataSource(this.audits);
      this.changeDetectorRefs.detectChanges();
    }, error => {
      this.loader = false;
      this.changeDetectorRefs.detectChanges();
    });
  }

}
