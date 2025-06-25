import { PropertyService } from 'src/app/service/property/property.service';
import { DateService } from 'src/app/service/DateService/date-service.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, LoadingController, ToastController, NavParams } from '@ionic/angular';
import { Booking } from 'src/app/model/manage-booking/Booking/Booking';
import { AvailabilityService } from 'src/app/service/AvailabilityService/availability.service';
import { Logger } from 'src/app/service/logger.service';
import { BookingService } from 'src/app/service/manage-booking/booking-service.service';
import { TokenStorage } from 'src/app/token.storage';
import { RatesAndAvailability } from 'src/app/model/manage-booking/rateandavailability/rateandavailability';
import { HttpErrorResponse } from '@angular/common/http';
import { NavigationExtras, Router } from '@angular/router';
import { AUDIT_CHECK_IN } from 'src/app/app.component';
import { DatePipe } from '@angular/common';
import { Audit } from 'src/app/service/audit';
// import { AUDIT_CHECK_IN } from 'app/app.component';

export interface PurposeData {
    data: string;
    value: string;
  }

@Component({
  selector: 'app-checked-in-dialog',
  templateUrl: './checked-in-dialog.component.html',
  styleUrls: ['./checked-in-dialog.component.css']
})
export class CheckedInDialogComponent implements OnInit {

    purposeData: PurposeData[] = [
        { data: 'Business', value: 'Business' },
        { data: 'Travel', value: 'Travel' },
        { data: 'Family Event', value: 'Family Event' },
        { data: 'Personal Event', value: 'Personal Event' },
        { data: 'Festival', value: 'Festival' },
      ];
    
    
    ratesAndAvailability: RatesAndAvailability = {
        id: 0,
        date: '',
        noOfAvailable: 0,
        noOfBooked: 0,
        noOfOnHold: 0,
        price: 0,
        propertyId: 0,
        propertyName: '',
        roomId: 0,
        roomName: '',
        totalNoRooms: 0,
        status: '',
        restriction: '',
        roomRatePlans: [],
        stopSellOBE: false,
        stopSellOTA: false,
      };
      
    booking: Booking;

    onCheckedInForm: FormGroup;
    PurposeOfVisit : FormControl = new FormControl();
    checkedinTime: FormControl = new FormControl();
    isCheckInPreviousDate : boolean = false;
    loader: boolean = false;
    roomDetailWithStatus: any;
    isAllRoomStatusVacntReady : boolean = true;
    role: any[];
    constructor(private modalcntrler: ModalController,
        private availabilityService: AvailabilityService,
        private bookingService: BookingService,
        private formBuilder: FormBuilder,
        private router: Router,
        private propertyService :PropertyService,
        private dateService : DateService,
        private changeDetectorRefs: ChangeDetectorRef,
        public loadingCtrl: LoadingController,
        public datepipe: DatePipe,
        private toastController: ToastController,
        private navParams: NavParams,
        private token: TokenStorage) 
        { 
            this.booking = new Booking();
            let BookingOb = this.navParams.get('booking');
            this.booking = BookingOb;
            
            this.onCheckedInForm = this.formBuilder.group({
                'checkedinTime': ['', Validators.compose([
                  Validators.required
                ])],
                'PurposeOfVisit': ['', Validators.compose([
                    Validators.nullValidator
                  ])],
                'ArrivingFrom': ['', Validators.compose([
                    Validators.nullValidator
                  ])],
                'DepartingTo': ['', Validators.compose([
                    Validators.nullValidator
                  ])],    
              });

            
        }

  ngOnInit(): void {

    this.booking.checkinTime = this.dateService.convertMillisecondsToYYMMDDTHHMMFormat(new Date().getTime());  
    this.dateCheck();
  }

  dateCheck()
  {
    let selecttedDate = this.dateService.convertMillisecondsToYYYMMDDFormat(this.booking.checkinTime);
    let checkedinDate = this.dateService.convertMillisecondsToYYYMMDDFormat(this.booking.fromDate);

    let selectedDateOb = new Date(selecttedDate);
    let checkedinDateOb = new Date(checkedinDate);

    if(selectedDateOb.getTime() === checkedinDateOb.getTime()){
      this.isCheckInPreviousDate = false;
    }
    else if(selectedDateOb.getTime() < checkedinDateOb.getTime()){
     // this.onCheckInForm.disable();
     this.isCheckInPreviousDate = true;
    }
    else if(selectedDateOb.getTime() > checkedinDateOb.getTime()){
      this.isCheckInPreviousDate = false;
    }

    this.ratesAndAvailability.propertyId =this.token.getProperty().id;
    this.ratesAndAvailability.roomId = this.booking.roomId;
    this.ratesAndAvailability.fromDate = this.dateService.convertMillisecondsToYYYMMDDFormat(selecttedDate);

    let toDateOb = new Date(selecttedDate);
    toDateOb.setDate(toDateOb.getDate()+1);

    this.ratesAndAvailability.toDate = this.dateService.convertMillisecondsToYYYMMDDFormat(toDateOb);

    this.getRatesForRoomByDate(this.ratesAndAvailability);
  }

  getRatesForRoomByDate(rateAndAvailability: RatesAndAvailability) {
    this.loader = true;
    this.availabilityService.getAvailabilityForRoomByDate(rateAndAvailability).subscribe(resp => {
      this.loader = false;
      if (resp.body.length === 0) {
        this.presentToast(`Rates And Availability not setup for the dates,please load the rates.`);
      } else {

        this.roomDetailWithStatus = resp.body[0].roomDetails;
        this.isAllRoomStatusVacntReady = true;
        this.changeDetectorRefs.detectChanges();

      }
    });
  }

  getRoomStatus(roomNumber)
  {
    let room = this.roomDetailWithStatus.find(data => data.roomNumber === roomNumber);

    if(room != undefined && room.roomStatus != 'VACANT_READY')
    {
      this.isAllRoomStatusVacntReady = false;
    }

    return room.roomStatus;
  }


 

  onCheckIn()
  {
    if(this.booking.checkinTime != undefined && this.booking.checkinTime != null)
    {
      this.booking.checkinTime = new Date(this.booking.checkinTime).getTime().toString();
    }
    this.loader = true;
    this.booking.operatorNotes = "Checkin Booking Rev Id :"+this.booking.propertyReservationNumber;
    this.booking.auditType = AUDIT_CHECK_IN;
    this.bookingService.checkin(this.booking).subscribe(
      (response) => {
        if (response.status === 200) {
          this.presentToast("Guest Arrival Completed.");
          this.createAuditReport(this.booking);
          this.modalcntrler.dismiss("success");
          this.loader = false;
        }
      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 417) {
            this.loader = false;
            // this.openErrorSnackBar('Please proceed with offline room allocation and update the booking.');
            this.presentToast(
              "Please proceed with offline room allocation and update the booking.",
            );
          }
        }
      }
    );
    
  }
  createAuditReport(currentBooking : Booking)
  {
    this.role = [];
    JSON.parse(this.token.getRole()).forEach((item) => {
      this.role.push(item);
    });

    let audit = new Audit();

    audit.reservationId = currentBooking.propertyReservationNumber;
    audit.auditType = AUDIT_CHECK_IN;
    audit.bookingId = currentBooking.id;
    audit.propertyId = currentBooking.propertyId;
    audit.role = this.role[0];
    audit.updatedAt = new Date().getTime().toString();
    audit.updatedBy = currentBooking.operatorName;

    if (currentBooking != null && currentBooking != undefined)
    {
      audit.newValue =  this.datepipe.transform(currentBooking.checkinTime, 'yyyy-MM-dd');
    }

    audit.operatorNotes = "";
    audit.roomId = currentBooking.roomId;
    audit.updateType = "CHECKEDIN BOOKING";

    this.loader = true;
    this.propertyService.createAuditReport(audit).subscribe(
      (data) => {
        this.loader = false;
        this.changeDetectorRefs.detectChanges();
      },
      (error) => {
        this.loader = false;
      }
    );
  }

  onDateChange()
  {
    this.cancel();
    let navigationExtras: NavigationExtras = {
        queryParams: {
            booking: JSON.stringify(this.booking),
            status :'Date-Change',
        }
        };
    
    this.router.navigate(['menu-action-booking'], navigationExtras);
    //this.cancel();
  }

  onChangeRoomStatus(roomOption)
  {
    this.loader = true;
    roomOption.date = this.ratesAndAvailability.fromDate;
    roomOption.roomStatus = 'VACANT_READY';
    this.changeRoomStatus(roomOption);
  }

  changeRoomStatus(row)
  {
    this.loader = true;
    this.propertyService.updateRoomDetailStatusInCheckedInFrom(row)
      .subscribe(data => {
        this.loader = false;
        this.presentToast('Room status changed successfully');
        this.getRatesForRoomByDate(this.ratesAndAvailability);

      },error=>{
        this.presentToast('Fail to update room status');
      });
  }

  async presentToast(Message: string) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2000
    });
    toast.present();
  }

  cancel() {
    this.modalcntrler.dismiss();
  }

}
