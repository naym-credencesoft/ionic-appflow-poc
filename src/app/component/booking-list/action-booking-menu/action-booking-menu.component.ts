import { TokenStorage } from "src/app/token.storage";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import {
    AlertController,
    LoadingController,
    ModalController,
    NavController,
    ToastController,
} from "@ionic/angular";
import { Booking } from "src/app/model/manage-booking/Booking/Booking";
import { BookingService } from "src/app/service/manage-booking/booking-service.service";
import { CheckedInDialogComponent } from "../checked-in-dialog/checked-in-dialog.component";
import { CheckoutDialogComponent } from "../checkout-dialog/checkout-dialog.component";
import { CheckRoomtypeComponent } from "../check-roomtype/check-roomtype.component";
import { DatePipe } from "@angular/common";
import { AvailabilityService } from "src/app/service/AvailabilityService/availability.service";
import { RoomDetails } from "src/app/model/RoomDetails/RoomDetails";
import { RatesAndAvailability } from "src/app/model/manage-booking/rateandavailability/rateandavailability";
import { Audit } from "src/app/service/audit";
import { PropertyService } from "src/app/service/property/property.service";
import { AUDIT_BOOKING_CANCELLED, AUDIT_ROOM_RELEASE } from "src/app/app.component";

@Component({
    selector: "app-action-booking-menu",
    templateUrl: "./action-booking-menu.component.html",
    styleUrls: ["./action-booking-menu.component.css"],
})
export class ActionBookingMenuComponent implements OnInit {
    booking: Booking;
    isProgressing: boolean = false;
    isSuccess: boolean = false;
    isCheckout: boolean = false;
    isMultiBooking: boolean = false;
    availableRoomDetail: RoomDetails[];

    ratesAndAvailability: RatesAndAvailability;
    ratesAndAvailabilitySingleObject: RatesAndAvailability;
    ratesAndAvailabilities: any[];
    role: any[];
    constructor(
        public modalController: ModalController,
        private router: Router,
        private propertyService: PropertyService,
        private token: TokenStorage,
        private availabilityService : AvailabilityService,
        private changeDetectorRefs: ChangeDetectorRef,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        public datepipe: DatePipe,
        private toastController: ToastController,
        private alertCtrl: AlertController,
        private bookingService: BookingService
    ) {
        this.booking = new Booking();
        this.ratesAndAvailability = new RatesAndAvailability();
    }

    ngOnInit() {
    }

    getBookingById(bookingId: any) {
        this.isProgressing = true
        this.bookingService
            .findBooking(bookingId)
            .toPromise()
            .then((b) => {
                this.booking = b.body;
                this.changeDetectorRefs.detectChanges();
                this.isProgressing = false;
            })
            .catch((e) => {});
    }

    addOnService() {
        this.close();
        this.token.saveBookingDetal(this.booking);
        let navigationExtras: NavigationExtras = {
            queryParams: {
                status: "AddOnService",
            },
        };

        this.router.navigate(["tab-service"], navigationExtras);
        this.successDialogClose()
    }

    confirmBooking(row) {
    
        this.close();
        let bookingURLOB = new Booking();
    
        bookingURLOB = row;
        // this.bookingURLOB.id = row.id;
        bookingURLOB.bookingId = row.id;
        bookingURLOB.changeType = "confirmBooking";
        bookingURLOB.roomBooking = true;
    
        let navigationExtras: NavigationExtras = {
          queryParams: {
            bookingOb: JSON.stringify(bookingURLOB),
            status: "confirmBooking",
          },
        };
        this.router.navigate(["booking"], navigationExtras);
      }

    cancelRequest(booking) {
        this.isProgressing = true;
        this.bookingService.cancel(booking.id).subscribe(
            (response) => {
                if (response.status === 200) {
                    this.isProgressing = false;
                    this.presentToast(
                        "Booking Cancelled,Please check the expense section."
                    );
                    this.successDialogClose();
                    this.createAuditReportOne(booking);
                }
            },
            (error) => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 417) {
                        this.isProgressing = false;
                        this.presentToast(
                            "Cancellation Error,Please check booking status ,only confirmed booking can be cancelled"
                        );
                        
                    this.successDialogClose();
                    }
                    this.isProgressing = false;
                }
            }
        );
    }

    addRemoveGuest() {
        // if (
        //     this.booking.roomDetails != null &&
        //     this.booking.roomDetails != undefined &&
        //     this.booking.roomDetails.length > 0
        // ) {
        //     this.alertReleaseRoom("Add/Remove-Guest", this.booking);
        // } else {
        //     this.close();
        //     let navigationExtras: NavigationExtras = {
        //         queryParams: {
        //             booking: JSON.stringify(this.booking),
        //             status: "Add/Remove-Guest",
        //         },
        //     };

        //     this.router.navigate(["menu-action-booking"], navigationExtras);
        // }
        this.close();
        let navigationExtras: NavigationExtras = {
            queryParams: {
                booking: JSON.stringify(this.booking),
                status: "Add/Remove-Guest",
            },
        };

        this.router.navigate(["menu-action-booking"], navigationExtras);
        this.successDialogClose()
    }

    onView(booking) {
        this.close();
        let navigationExtras: NavigationExtras = {
            queryParams: {
                booking: JSON.stringify(this.booking),
            },
        };

        this.router.navigate(["booking-view"], navigationExtras);
        this.successDialogClose()
    }

    close() {
        if (this.isSuccess) {
            this.successDialogClose();
        } else if (this.isCheckout) {
            this.modalController.dismiss("checkout");
        } else {
            this.modalController.dismiss();
        }
    }

    //
    async alertReleaseRoom(haeder: string, booking: any) {
        
        const alert = await this.alertCtrl.create({
            header: haeder,
            message:
                "Rooms are already allocated, please release the room numbers and perform this operation",

            backdropDismiss: false,
            buttons: [
                {
                    text: "Cancel",
                    role: "cancel",
                    cssClass: "secondary",
                    handler: () => {},
                },
                {
                    text: "Release Room",
                    handler: () => {
                        this.roomRealese(booking);
                    },
                },
            ],
        });
        await alert.present();
    }

    roomRealese(row) {
        this.isProgressing = true;
        row.checkoutTime = new Date();
        row.auditType = AUDIT_ROOM_RELEASE;
        this.bookingService.roomRealese(row).subscribe(
            (response) => {
                if (response.status === 200) {
                    this.createAuditReport(row)
                    this.isProgressing = false;
                    this.presentToast("Room Release Done");
                    this.successDialogClose();
                }
            },
            (error) => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 417) {
                        this.isProgressing = false;
                        this.presentToast(
                            "CheckOut Error,Please check booking status and outstanding amount in booking details section"
                        );
                    }
                    this.isProgressing = false;
                    this.successDialogClose()
                }
            }
        );
    }

    createAuditReportOne(currentBooking : Booking)
    {
      this.role = [];
      JSON.parse(this.token.getRole()).forEach((item) => {
        this.role.push(item);
      });
  
      let audit = new Audit();
  
      audit.reservationId = currentBooking.propertyReservationNumber;
      audit.auditType = AUDIT_BOOKING_CANCELLED;
      audit.bookingId = currentBooking.id;
      audit.propertyId = currentBooking.propertyId;
      audit.role = this.role[0];
      audit.updatedAt = new Date().getTime().toString();
      audit.updatedBy = currentBooking.operatorName;
  
      audit.previousValue = "";
  
      if (currentBooking != null && currentBooking != undefined && currentBooking.roomDetails != null && currentBooking.roomDetails.length > 0)
      {
        let roomNo2 = [];
        for (let num = 0; num < currentBooking.roomDetails.length; num++)
        {
          roomNo2.push(currentBooking.roomDetails[num].roomNumber);
        }
        audit.newValue = roomNo2.toString();
      }
  
      audit.operatorNotes = currentBooking.operatorNotes;
      audit.roomId = currentBooking.roomId;
      audit.updateType = "Booking Cancelled";
  
    //   this.loader = true;
      this.propertyService.createAuditReport(audit).subscribe(
        (data) => {
        //   this.loader = false;
        //   this.createAudit(currentBooking);
          this.changeDetectorRefs.detectChanges();
        },
        (error) => {
        //   this.loader = false;
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
    audit.auditType = AUDIT_ROOM_RELEASE;
    audit.bookingId = currentBooking.id;
    audit.propertyId = currentBooking.propertyId;
    audit.role = this.role[0];
    audit.updatedAt = new Date().getTime().toString();
    audit.updatedBy = currentBooking.operatorName;

    audit.previousValue = "";

    if (currentBooking != null && currentBooking != undefined && currentBooking.roomDetails != null && currentBooking.roomDetails.length > 0)
    {
      let roomNo2 = [];
      for (let num = 0; num < currentBooking.roomDetails.length; num++)
      {
        roomNo2.push(currentBooking.roomDetails[num].roomNumber);
      }
      audit.newValue = roomNo2.toString();
    }

    audit.operatorNotes = currentBooking.operatorNotes;
    audit.roomId = currentBooking.roomId;
    audit.updateType = "Room Release";

    // this.loader = true;
    this.propertyService.createAuditReport(audit).subscribe(
      (data) => {
        // this.loader = false;
        this.changeDetectorRefs.detectChanges();
      },
      (error) => {
        // this.loader = false;
      }
    );
  }

    async sendPaymentLink() {
        const loader = await this.loadingCtrl.create({});

        loader.present();
        this.bookingService.sendPaymentLink(this.booking.id).subscribe(
            (response) => {
                if (response.status === 200) {
                    if (response.body === true) {
                        this.presentToast("Payment Link Sent");
                        loader.dismiss();
                        this.close();
                        this.successDialogClose();
                    } else {
                        this.presentToast(
                            "Problem in sending the payment link"
                        );
                        loader.dismiss();
                        this.close();
                        this.successDialogClose()
                    }
                }
            },
            (error) => {
                if (error instanceof HttpErrorResponse) {
                    loader.dismiss();
                    this.close();
                    this.successDialogClose()
                    if (error.status === 417 || error.status === 500) {
                        this.presentToast("Paymentlink sent Error");
                    }
                }
            }
        );
    }

    sendConfirmationEmail() {
        this.isProgressing = true;
        this.bookingService.sendBookingConfirmation(this.booking.id).subscribe(
            (response) => {
                this.isProgressing = false;
                if (response.status === 200) {
                    if (response.body === true) {
                        this.isProgressing = false;
                        this.presentToast("Booking Confirmation Sent");
                        this.close();
                        this.successDialogClose()
                    } else {
                        this.isProgressing = false;
                        // this.openErrorSnackBar('Problem in sending the payment link');
                        this.presentToast(
                            "Problem in sending booking confirmation"
                        );
                        this.close();
                        this.successDialogClose()
                    }
                }
            },
            (error) => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 417 || error.status === 500) {
                        this.isProgressing = false;
                        // this.openErrorSnackBar('Paymentlink sent Error');
                        this.presentToast("Booking confirmation sent Error");
                        this.close();
                        this.successDialogClose()
                    }
                }
            }
        );
    }

    onInvoice() {
        window.open(this.booking.invoiceUrl, "_blank");
    }

    async noShow() {
        const loader = await this.loadingCtrl.create({});

        this.bookingService.noShowBooking(this.booking.id).subscribe(
            (response) => {
                if (response.status === 200) {
                    this.presentToast("successfully completed.");
                    loader.dismiss();
                    this.successDialogClose();
                }
            },
            (error) => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 417) {
                        loader.dismiss();
                        this.successDialogClose();
                    }
                }
            }
        );
    }

    async voidBooking() {
        const loader = await this.loadingCtrl.create({});
        this.bookingService.VoidBooking(this.booking.id).subscribe(
            (response) => {
                if (response.status === 200) {
                    this.presentToast("Booking void successfully.");
                    loader.dismiss();
                    this.successDialogClose();
                }
            },
            (error) => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 417) {
                        loader.dismiss();
                        this.successDialogClose();
                    }
                }
            }
        );
    }

    successDialogClose() {
        this.modalController.dismiss("done");
    }

    checkOutCheck()

    { 
        
      this.isProgressing = true  
        this.bookingService
        .checkOutStandingAmountByBookingId(this.booking.id)
        .subscribe((response) => {
          if (response.status === 200) {
            let data = response.body as any;
            this.isProgressing = false;
  
              if (data.value < 0) {
                this.isProgressing = false;
                this.successDialogClose();
                this.token.saveBookingDetal(this.booking);
                this.navCtrl.navigateForward(["checkout-detail"]);
            } else {
                this.checkoutDialog();
                this.isProgressing = false;
            }
          }
        }); 
    }

    singleBookingcheckOutCheck()
    { 
        
       // this.successDialogClose()
        this.bookingService
        .checkOutStandingAmountByBookingId(this.booking.id)
        .subscribe((response) => {
          if (response.status === 200) {
            let data = response.body as any;
  
            if (data.value < 0) {
               // this.close();
             //   this.successDialogClose()
                this.token.saveBookingDetal(this.booking);
                this.navCtrl.navigateForward(["checkout-detail"]);
            } else {
                this.singleBookingCheckOutDialog();
                //this.successDialogClose()
            }
          }
        }); 
    }


    async checkoutDialog() {
this.isProgressing = true
        const modal = await this.modalController.create({
            component: CheckoutDialogComponent,

            componentProps: {
                booking: this.booking,
            },
        });
        modal.onDidDismiss().then((data) => {
            console.log("data.data ===!" + JSON.stringify(data.data));
            if (data.data === "success") {
                this.isCheckout = true;
                this.isProgressing = false
                this.getRatesAndAvailability(this.booking, true);
                this.getBookingById(this.booking.id);
            }
        });
        return await modal.present();
    }

    onDetails() {
        this.close();
        this.token.saveBookingDetal(this.booking);
        this.navCtrl.navigateForward("booking-list-details/bookingTab");
        this.successDialogClose()
    }

    async roomallocate() {
        
        // this.successDialogClose()
        this.isProgressing = true;
        const modal = await this.modalController.create({
            component: CheckRoomtypeComponent,

            componentProps: {
                booking: this.booking,
            },
        });
        modal.onDidDismiss().then((data) => {

            this.getBookingById(this.booking.id);
            this.isProgressing = false;
        });
        return await modal.present();
    }

    onPlanChange() {
        this.close();
        let navigationExtras: NavigationExtras = {
            queryParams: {
                booking: JSON.stringify(this.booking),
                status: "Plan-Change",
            },
        };

        this.router.navigate(["menu-action-booking"], navigationExtras);
        this.successDialogClose()
    }
    onAuditReportClick() {
        
        this.close();
        let navigationExtras: NavigationExtras = {
            queryParams: {
                booking: JSON.stringify(this.booking.id),
                
            },
        };

        this.router.navigate(["audit-report"], navigationExtras);
        this.successDialogClose()
    }

    onRoomChange() {
        this.close();
        let navigationExtras: NavigationExtras = {
            queryParams: {
                booking: JSON.stringify(this.booking),
                status: "Room-Change",
            },
        };

        this.router.navigate(["menu-action-booking"], navigationExtras);
        this.successDialogClose()
    }

    onDateChange() {
        this.close();
        let navigationExtras: NavigationExtras = {
            queryParams: {
                booking: JSON.stringify(this.booking),
                status: "Date-Change",
            },
        };

        this.router.navigate(["menu-action-booking"], navigationExtras);
        this.successDialogClose()
        //this.navCtrl.navigateForward('menu-action-booking');
    }

    copyBooking() {
        this.close();
        let navigationExtras: NavigationExtras = {
            queryParams: {
                booking: JSON.stringify(this.booking),
                status: "Copy",
            },
        };

        this.router.navigate(["menu-action-booking"], navigationExtras);
    }

    groupBookingList(groupBookingId)
    {
        this.close();
        let navigationExtras: NavigationExtras = {
            queryParams: {
                groupBookingId: groupBookingId,
            },
        };

        this.router.navigate(["multibookinglist"], navigationExtras);
    }

    async onCheckin() {
        const modal = await this.modalController.create({
            component: CheckedInDialogComponent,

            componentProps: {
                booking: this.booking,
            },
        });
        modal.onDidDismiss().then((data) => {
            if (data.data === "success") {
                this.isSuccess = true;
                this.getBookingById(this.booking.id);
                this.successDialogClose()
            }
        });
        return await modal.present();
    }

    markAsPaid(row){
        this.bookingService
        .updateBookingStatus(row.id,"Paid")
        .subscribe(
          (data) => {
            this.getBookingById(this.booking.id);
            this.isSuccess = true;
            this.close();
          },
          (error) => {
          }
        );
      }
    

    isRoomAllocatedInGroupBooking(row) {
        let isRoomAvailable: boolean = false;
        if (row.roomDetails != null && row.roomDetails != undefined) {
            for (let i = 0; i < row.roomDetails.length; i++) {
                if (
                    row.roomDetails[i].roomNumber != null &&
                    row.roomDetails[i].roomNumber != undefined
                ) {
                    isRoomAvailable = true;
                }
            }
        }

        return isRoomAvailable;
    }

    singleBookingCheckOutDialog(){
        this.singleCheckoutDialog(); 
    }




    async singleCheckoutDialog() {
        const modal = await this.modalController.create({
            component: CheckoutDialogComponent,

            componentProps: {
                booking: this.booking,
                isMultiBooking : true,
            },
        });
        modal.onDidDismiss().then((data) => {
            console.log("data.data !" + JSON.stringify(data.data));
            if (data.data != null && data.data != undefined) {
                this.roomReleaseAndBookingStatusChange(this.booking,data.data);
                this.successDialogClose()
                
            }
        });
        return await modal.present();
    }

    roomReleaseAndBookingStatusChange(row,checkoutTime){

        row.checkoutTime = new Date().getTime();
        this.bookingService.roomRealese(row).subscribe(
          (response) => {
            if (response.status === 200) {
    
              this.bookingService.updateBookingStatusByBookingId(row.id,"CHECKEDOUT",checkoutTime).subscribe(
                (response) => {
                  this.presentToast("Booking checkout successfully");

                  this.isSuccess = true;
                  this.close();
                  this.successDialogClose();
                },
                (error) => {
                  if (error instanceof HttpErrorResponse) {
                    if (error.status === 417) {
    
                    }
                  }
                }
              );
    
            }
          },
          (error) => {
            if (error instanceof HttpErrorResponse) {
              if (error.status === 417) {
                this.isSuccess = true;
                this.close();
                this.successDialogClose()
                this.presentToast(
                  "Please check booking status and outstanding amount in booking details section"
                );
                // this.openErrorSnackBar(
                //   'CheckOut Error,Please check booking status and outstanding amount in booking details section'
                // );
              }
            }
          }
        );
      }
    
      isUndoCheckoutAvailable(row) {
        let isUndoAvailable = false;
        let checkoutDateTime = this.datepipe.transform(
          row.checkoutTime,
          "yyyy-MM-dd hh:mm"
        );
        let checkoutUndoDateTimeOb = new Date(checkoutDateTime);
        checkoutUndoDateTimeOb.setDate(checkoutUndoDateTimeOb.getDate() + 1);
    
        let currentDateTime = this.datepipe.transform(
          new Date().getTime(),
          "yyyy-MM-dd hh:mm"
        );
        let currentDateTimeOb = new Date(currentDateTime);
    
        if (checkoutUndoDateTimeOb.getTime() > currentDateTimeOb.getTime()) {
          isUndoAvailable = true;
        } else {
          isUndoAvailable = false;
        }
    
        return isUndoAvailable;
      }
    
      undoCheckout(row) {
        if (row.roomNumbers != null && row.roomNumbers != undefined) {
          let roomNumberArray = row.roomNumbers.split(",");
          this.getAllAvailableRoomsForBooking(row.id, roomNumberArray, row);
        }
      }
      getAllAvailableRoomsForBooking(bookingId: number, roomlist: any, row: any) {
        this.isProgressing = true;
        this.availabilityService.getAvailableRooms(bookingId).subscribe((resp1) => {
          if (resp1.body.length === 0) {
            this.presentToast(
              roomlist.toString() + " room not avaiable for this moment"
            );
            this.isProgressing = false;

          } else {
            this.availableRoomDetail = resp1.body;
    
              this.changeDetectorRefs.detectChanges();
    
            let selectedRooms = [];
    
            for (let i = 0; i < roomlist.length; i++) {
              for (let j = 0; j < this.availableRoomDetail.length; j++) {
                if (roomlist[i] === this.availableRoomDetail[j].roomNumber) {
                  this.availableRoomDetail[j].guestName =
                    row.firstName + " " + row.lastName;
                  this.availableRoomDetail[j].available = false;
                  this.availableRoomDetail[j].bookingId = row.id;
                  this.availableRoomDetail[j].roomStatus = row.roomStatus;
                  this.availableRoomDetail[j].customerId = row.customerId;
    
                  selectedRooms.push(this.availableRoomDetail[j]);
                }
              }
            }
    
            row.roomDetails = selectedRooms;
    
            this.bookingService.roomAllocation(row).subscribe(
              (response) => {
                if (response.status === 200) {
                  this.bookingService.undoCheckout(row).subscribe(
                    (response) => {
                      this.presentToast(
                        "Undo checkout successfully completed"
                      );
                    this.getBookingById(this.booking.id);
                    this.getRatesAndAvailability(this.booking, false);
                    },
                    (error) => {
                      this.changeDetectorRefs.detectChanges();
                    }
                  );
                  this.isProgressing = false;
                  //  this.refresh();
                }
              },
              (error) => {
                if (error instanceof HttpErrorResponse) {
                  if (error.status === 417) {
                  }
                  this.changeDetectorRefs.detectChanges();
                  this.isProgressing = false;
                }
              }
            );
          }
        });
      }
    
      getRatesAndAvailability(row, isCheckOut: boolean) {


        let currentDate: Date = new Date();
        let currentDateString = this.datepipe.transform(currentDate, "yyyy-MM-dd");
    
          this.ratesAndAvailability.fromDate = currentDateString;
          
        if (this.singleDayBooking(row) === false) {
          this.ratesAndAvailability.toDate = this.datepipe.transform(
            row.toDate,
            "yyyy-MM-dd"
          );
        } else {
          let todate = new Date(row.toDate);
          todate.setDate(todate.getDate() + 1);
          this.ratesAndAvailability.toDate = this.datepipe.transform(
            todate.getTime(),
            "yyyy-MM-dd"
          );
        }
    
        this.ratesAndAvailability.propertyId = this.token.getProperty().id;
        this.ratesAndAvailability.roomId = row.roomId;
        this.getRatesForRoomByDate(this.ratesAndAvailability, isCheckOut, row);
      }
    
      getRatesForRoomByDate(
        rateAndAvailability: RatesAndAvailability,
        isCheckOut: boolean,
        booking: Booking
      ) {
        this.ratesAndAvailabilities = [];
    
        this.availabilityService
          .getAvailabilityForRoomByDate(rateAndAvailability)
          .subscribe((resp) => {
              if (resp.body.length === 0) {
                  this.successDialogClose();
            } else {
              if (isCheckOut === true) {
                for (let num = 0; num < resp.body.length; num++) {
                  this.ratesAndAvailabilitySingleObject = new RatesAndAvailability();
    
                  this.ratesAndAvailabilitySingleObject = resp.body[num];
                  this.ratesAndAvailabilitySingleObject.noOfAvailable =
                    resp.body[num].noOfAvailable + booking.noOfRooms;
                  // this.ratesAndAvailabilitySingleObject.noOfBooked =
                  //   resp.body[num].noOfBooked - booking.noOfRooms;
    
                  if (this.ratesAndAvailabilitySingleObject.noOfBooked > -1) {
                    this.save(this.ratesAndAvailabilitySingleObject, resp.body.length,num);
                  }
                }
              } else {
                for (let num = 0; num < resp.body.length; num++) {
                  this.ratesAndAvailabilitySingleObject = new RatesAndAvailability();
    
                  this.ratesAndAvailabilitySingleObject = resp.body[num];
                  this.ratesAndAvailabilitySingleObject.noOfAvailable =
                    resp.body[num].noOfAvailable - booking.noOfRooms;
                  // this.ratesAndAvailabilitySingleObject.noOfBooked =
                  //   resp.body[num].noOfBooked + booking.noOfRooms;
    
                  if (this.ratesAndAvailabilitySingleObject.noOfAvailable > -1) {
                    this.save(this.ratesAndAvailabilitySingleObject, resp.body.length,num);
                  }
                }
              }
  
            }
          });
      }
    
      save(ratesAndAvailability: RatesAndAvailability, totalNumber, currentNumber) {
        this.availabilityService
          .updateRatesAvailability(ratesAndAvailability)
          .subscribe(
              (response) => {
                  if (totalNumber === currentNumber + 1)
                  { 
                      this.successDialogClose();
                  }
            },
            (error) => {
   
            }
          );
      }
    
      singleDayBooking(row) {
        if (row === null || row === undefined) {
          return false;
        } else if (
          row.fromDate != undefined &&
          row.fromDate != null &&
          row.fromDate != "NaN-NaN-NaN" &&
          row.toDate != null &&
          row.toDate != undefined &&
          row.toDate != "NaN-NaN-NaN" &&
          this.datepipe.transform(row.toDate, "yyyy-MM-dd") ===
            this.datepipe.transform(row.fromDate, "yyyy-MM-dd")
        ) {
          return true;
        } else {
          return false;
        }
      }
    
    

    async presentToast(Message: string) {
        const toast = await this.toastController.create({
            message: Message,
            duration: 2000,
        });
        toast.present();
    }
}
