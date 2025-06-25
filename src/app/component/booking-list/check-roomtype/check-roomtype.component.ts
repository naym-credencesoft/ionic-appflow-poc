import { Logger } from "../../../service/logger.service";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ModalController, NavParams, LoadingController, NavController } from "@ionic/angular";
import { AvailabilityService } from "./../../../service/AvailabilityService/availability.service";
import { Booking } from "./../../../model/manage-booking/Booking/Booking";
import { BookingService } from "./../../../service/manage-booking/booking-service.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Room } from "./../../../model/room";
import { TokenStorage } from "./../../../token.storage";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
} from "@angular/forms";
import { ToastController } from "@ionic/angular";
import { RoomDetailsOption } from "./../../../model/RoomDetails/RoomDetailsOption";
import { BedDetails } from "./../../../model/BedDetails/BedDetails";
import { BedDetailOption } from "./../../../model/BedDetails/BedDetailOption";
import { DatePipe } from "@angular/common";
import { AuthService } from "src/app/service/auth.service";
import { Message } from "src/app/model/manage-booking/Msg/Message";
import { DialogContentComponent } from "../DialogContent/DialogContent.component";
import { RoomDetails } from "src/app/model/RoomDetails/RoomDetails";
import { Audit } from "src/app/service/audit";
import { AUDIT_CHECK_IN, AUDIT_ROOM_ALLOCATION, AUDIT_ROOM_SHIFT } from "src/app/app.component";
import { PropertyService } from "src/app/service/property/property.service";
export interface AllRoomOption {
    room: Room;
    availableRoomData: any;
}
@Component({
    selector: "app-check-roomtype",
    templateUrl: "./check-roomtype.component.html",
    styleUrls: ["./check-roomtype.component.scss"],
})
export class CheckRoomtypeComponent implements OnInit {
    booking: Booking;
    roomAvailableOptions: AllRoomOption[];
    bookingId: number;
    roomStatus: boolean[];
    roomNumbers: any[];
    otherRoomNumberSelected: any;
    bedNumbers: string[];

    selectedRooms: RoomDetails[];
    roomData: RoomDetails;
    roomSequenceData: RoomDetails;

    isError: boolean;
    pageTitle: string;
    room: Room;
    rooms: Room[];
    loader = false;
    isProgressing:boolean = false;
    roomNumber: number;

    isDisabled: boolean = true;
    isSingleRoomAllocate: boolean;
    bookingRoomDetails: any[] = [];
    bookingStatus: any;
    role: any[];
    msgs: Message[] = [];

    constructor(
        private modalcntrler: ModalController,
        public navCtrl: NavController,
        private availabilityService: AvailabilityService,
        private bookingService: BookingService,
        private formBuilder: FormBuilder,
        private authService : AuthService,
        private propertyService: PropertyService,
        public datepipe: DatePipe,
        private changeDetectorRefs: ChangeDetectorRef,
        public loadingCtrl: LoadingController,
        private toastController: ToastController,
        private navParams: NavParams,
        private token: TokenStorage
    ) {
        this.roomAvailableOptions = [];
        this.roomNumbers = [];
        this.isSingleRoomAllocate = false;

        this.booking = new Booking();
        let BookingOb = this.navParams.get("booking");

        this.booking = BookingOb;
        this.rooms = this.token.getRoomTypes();
        this.room = this.rooms.find((room) => room.id === this.booking.roomId);
    }

    ngOnInit()
    { 
        this.bookingService.findBooking(this.booking.id).subscribe(response => {
            this.booking = response.body;
            this.booking.operatorNotes = null;
      
            this.getUserDetail();
      
            this.booking.fromDate =this.datepipe.transform(
              this.booking.fromDate,
              "yyyy-MM-dd"
            );
      
            this.booking.toDate =this.datepipe.transform(
              this.booking.toDate,
              "yyyy-MM-dd"
            );
      
            this.bookingStatus = this.booking.bookingStatus;
      
            if(this.isSingleRoomAllocate === false && this.booking.roomDetails != null && this.booking.roomDetails != undefined && this.booking.roomDetails.length >0)
            {
              this.bookingRoomDetails = this.booking.roomDetails;
              this.roomRealese(this.booking);
            }
            else
            {
              this.findRatesAndAvailabilityForAllRoomsByDate();
            }
      
          });
    }

    cancel() {
        this.modalcntrler.dismiss();
    }

    getRoomName(roomId) {
        let room = this.rooms.find(data => data.id === roomId);
    
        if (room != undefined) {
          return room.name;
        }
        else
        {
          return '';
        }
      }
    
      getUserDetail() {
        this.authService
          .getUserByUserId(this.token.getUserId())
          .subscribe((resp) => {
            let user = resp.body;
             this.booking.operatorName = user.firstName + " " + user.lastName;
          });
      }
    
      findRatesAndAvailabilityForAllRoomsByDate() {
        this.roomAvailableOptions = [];
        //this.roomNumbers = [];
        if (this.rooms.length > 0) {
          this.rooms.sort(this.token.roomSequenceByRanking(true));
          for (let num = 0; num < this.rooms.length; num++) {
            const room = this.rooms[num];
    
            if(room.id === this.room.id){
              this.getAllAvailableRoomsForBooking(this.booking.id);
            }
            else
            {
              this.getAllAvailableRoomsByDateAndRoomIdAndPropertyId(this.booking, room);
            }
          }
        }
      }
    
      getAllAvailableRoomsForBooking(bookingId: number) {
        this.availabilityService.getAvailableRooms(bookingId).subscribe(
          resp1 => {
            if (resp1.body.length === 0) {
              //this.dialogRef.close();
              this.bookingErrorDialog("error", 'Booking', 'Room Allocation Error', "No rooms found for room allocation, Check other roomtype.", null, 'Cancel');
            } else {
              let availableRoomDetail = resp1.body;
              availableRoomDetail = this.sortTodaysArray(availableRoomDetail);
    
              let availableOb :AllRoomOption= {
                room : this.room,
                availableRoomData : availableRoomDetail,
              }
    
              this.roomAvailableOptions.push(availableOb);
    
              if( this.otherRoomNumberSelected != null &&  this.otherRoomNumberSelected != undefined)
              {
                let roomOb = availableRoomDetail.find((data) => data.roomNumber === this.otherRoomNumberSelected.roomNumber);
                this.roomNumbers.push(roomOb);
                this.otherRoomNumberSelected = null;
              }
    
            //   if( this.bookingRoomDetails != null &&  this.bookingRoomDetails != undefined &&  this.bookingRoomDetails.length >0)
            //   {
            //     for(let i =0 ; i< this.bookingRoomDetails.length ; i++)
            //     {
            //       let roomOb = availableRoomDetail.find((data) => data.roomNumber === this.bookingRoomDetails[i].roomNumber);
            //       if (roomOb != null && roomOb != undefined)
            //       {
            //         this.roomNumbers.push(roomOb);
            //       }
            //     }
            //   }
    
            }
          }
        );
      }
    
    
      getAllAvailableRoomsByDateAndRoomIdAndPropertyId(booking: Booking, room : Room) {
        this.availabilityService
          .getAvailableBookingRoomsByRoomId(
            booking,
            room.id
          )
          .subscribe((resp1) => {
            if (resp1.body.length === 0) {
    
            } else {
              let availableRoomDetail = resp1.body;
    
              availableRoomDetail = this.sortTodaysArray(availableRoomDetail);
    
              let availableOb :AllRoomOption= {
                room : room,
                availableRoomData : availableRoomDetail,
              }
              this.roomAvailableOptions.push(availableOb);
    
    
              if( this.bookingRoomDetails != null &&  this.bookingRoomDetails != undefined &&  this.bookingRoomDetails.length >0)
              {
                for(let i =0 ; i< this.bookingRoomDetails.length ; i++)
                {
                  let roomOb = availableRoomDetail.find((data) => data.roomNumber === this.bookingRoomDetails[i].roomNumber);
                  if (roomOb != null && roomOb != undefined)
                  {
                    this.roomNumbers.push(roomOb);
                  }
                }
              }
            }
          });
      }
    
      onChangeRoomCatagory(roomNumbers,isInventoryUpdate) {
        for (let num = 0; num < roomNumbers.length; num++) {
          roomNumbers[num].fromRoomId = roomNumbers[num].roomId;
          roomNumbers[num].toRoomId = this.booking.roomId;
          roomNumbers[num].roomId = this.booking.roomId;
        }
    
       let bookingToDate =  new Date(this.booking.toDate);
        bookingToDate.setDate(bookingToDate.getDate()+1);
    
        let toDate  =this.datepipe.transform(
          bookingToDate,
          "yyyy-MM-dd"
        );
    
    
        this.isProgressing = true;
        this.bookingService
          .changeRoomCategoryWithInventoryUpdate(
            this.booking.fromDate,
          //this.booking.toDate,
            toDate,
            roomNumbers,
            isInventoryUpdate
          )
          .subscribe(
            (response) => {
              if (response.status === 200) {
                this.presentToast("Room category changed successfully");
                this.findRatesAndAvailabilityForAllRoomsByDate();
                this.isProgressing = false;
              }
            },
            (error) => {
              this.isProgressing = false;
              if (error instanceof HttpErrorResponse) {
                if (error.status === 417) {
                  this.isProgressing = false;
                    this.modalcntrler.dismiss();
                  this.presentToast(
                    "Please proceed with offline room allocation and update the booking."
                  );
                }
              }
            }
          );
      }
    
      async checkAvailabilty(roomOption, isInventoryUpdate) {
    
        const loader = await this.loadingCtrl.create({
            duration: 5000,
        });

        loader.present();
        this.msgs = [];
    
        let booking = new Booking();
        booking.propertyId = this.token.getProperty().id;
    
        booking.fromDate = this.datepipe.transform(
          this.booking.fromDate,
          "yyyy-MM-dd"
        );
        booking.toDate = this.datepipe.transform(
          this.booking.toDate,
          "yyyy-MM-dd"
        );
    
        booking.noOfRooms = 1;
        booking.roomId = roomOption.roomId;
        booking.groupBooking = false;
    
        booking.planCode = "";
    
        const checkAvailabilityObsrv = this.bookingService
          .checkAvailability(booking)
          .subscribe(
            (response) => {

              if (response.status === 200)
              {
                booking = response.body;
                if (booking.available === false) {
                  this.msgs.push({
                    severity: "warn",
                    summary:
                    booking.noOfRooms+" room is not available for selected room catagory",
                  });
                  loader.dismiss();
                } else {
    
                  let roomData= [];
                  roomData.push(roomOption);
                  this.otherRoomNumberSelected = roomOption;
                    this.onChangeRoomCatagory(roomData, isInventoryUpdate);
               
                }
              } else {
                loader.dismiss();
                this.msgs.push({
                  severity: "error",
                  summary: response.status + ":" + response.statusText,
                });
              }
            }
          );
      }
    
      showOptions(data) {
    
        if (this.roomNumbers.indexOf(data) > -1) {
          const index: number = this.roomNumbers.indexOf(data);
          if (index !== -1) {
            this.roomNumbers.splice(index, 1);
          }
        }
        else {
          this.roomNumbers.push(data);
        }
    
    
        if (this.roomNumbers.length === this.booking.noOfRooms) {
          this.isDisabled = true;
        }
        else {
          this.isDisabled = false;
        }
      }
    
      otherRoomSelected(roomOption, room) {
    
        if (this.isDataExist(roomOption.roomNumber) === false)
        {
          this.completeDialog(
            "error",
            "Room Catagory Change",
            "Room Catagory Change",
            `Do you want to change the room catagory ${room.name} to ${this.room.name} that will affect room inventory. Or you can only change catagory without without inventory change.`,
            "Change Catagory with Inventory",
            "Change Catagory without Inventory",
            "Cancel",
            roomOption
          );
        }
        else
        {
          this.showOptions(roomOption);
        }
      }
    
      async completeDialog(
        statusText: string,
        title: string,
        subTitle: string,
        message: string,
        buttonText: string,
        buttonText2 : string,
        cancel: string,
        roomOption : any
      ) {
          
        const modal = await this.modalcntrler.create({
            component: DialogContentComponent,
            cssClass: "my-custom-class",
            swipeToClose: true,
            componentProps: {
                message: message,
                title: title,
                subTitle: subTitle,
                buttonText: buttonText,
                buttonText2: buttonText2,
                cancelText: cancel,
                status: statusText,
            },
        });

        modal.onDidDismiss().then((data) => {
            console.log("list  modal dismissed", data);
            if (data != undefined && data != null && data.data === "submit") {
                this.checkAvailabilty(roomOption, true);
            } else if (
                data != undefined &&
                data != null &&
                data.data === "submit2"
            ) {
                this.checkAvailabilty(roomOption, false);
            }else if (
                data != undefined &&
                data != null &&
                data.data === "cancel"
            ) {
               
            }
        });
        return await modal.present();
      }
    
      isDataExist(roomNumber)
      {
        return  this.roomNumbers.some((data) => data.roomNumber === roomNumber);
      }
    
      guestRoomAllocation() {
        // Logger.log('Room Number : '+JSON.stringify(this.roomNumbers));
        this.selectedRooms = [];
    
        this.isProgressing = true;
    
        for (let num = 0; num < this.roomNumbers.length; num++) {
    
          this.roomData = new RoomDetails();
          this.roomData = this.roomNumbers[num];
    
          this.roomData.available = false;
          this.roomData.guestName = this.booking.firstName + ' ' + this.booking.lastName;
          this.roomData.bookingId =  this.booking.id;
          this.roomData.roomStatus = 'BLOCKED';
    
          this.roomSequenceData = new RoomDetails();
          this.roomSequenceData = this.room.roomDetails.find(room =>
            room.roomNumber === this.roomData.roomNumber
          );
          if(this.roomSequenceData != null && this.roomSequenceData != undefined)
          {
            this.roomData.roomSequenceNumber = this.roomSequenceData.roomSequenceNumber;
          }
    
          this.selectedRooms.push(this.roomData);
        }
    
        this.bookingService.groupRoomAllocation(this.selectedRooms[0]).subscribe(response => {
          if (response.status === 200) {
    
            this.bookingErrorDialog("success", 'Add Room', 'Guest Room Allocation', "Room Allocation Completed.", null, 'OK');
    
            this.isProgressing = false;
            this.modalcntrler.dismiss();
          }
        },
          error => {
            if (error instanceof HttpErrorResponse) {
              if (error.status === 417) {
                this.isProgressing = false;
    
                this.bookingErrorDialog("error", 'Booking', 'Room Allocation Error', "Please proceed with offline room allocation and update the booking.", null, 'Cancel');
                this.modalcntrler.dismiss();
              }
            }
          }
        );
      }
    
      roomAllocation() {
        this.booking.auditType = AUDIT_ROOM_ALLOCATION;
        this.isProgressing = true;
    
        let roomNo = [];
        for (let num = 0; num < this.roomNumbers.length; num++)
        {
          roomNo.push( this.roomNumbers[num].roomNumber);
        }
    
        this.selectedRooms = [];
    
        if (this.roomNumbers.length !== this.booking.noOfRooms) {
          this.isError = true;
          this.isProgressing = false;
    
          this.bookingErrorDialog("error", 'Booking', 'Invalid room selection', `Rooms Booked: ${this.booking.noOfRooms} but selected: ${this.roomNumbers.length}`, null, 'Cancel');
    
    
        } else {
          for (let num = 0; num < this.roomNumbers.length; num++) {
    
            this.roomData = new RoomDetails();
            this.roomData = this.roomNumbers[num];
            this.roomData.available = false;
            this.roomData.guestName = this.booking.firstName + ' ' + this.booking.lastName;
            this.roomData.bookingId =  this.booking.id;
            this.roomData.roomStatus = 'BLOCKED';
    
            this.roomSequenceData = new RoomDetails();
            this.roomSequenceData = this.room.roomDetails.find(room =>
              room.roomNumber === this.roomData.roomNumber
            );
    
            if(this.roomSequenceData != null && this.roomSequenceData != undefined)
            {
              this.roomData.roomSequenceNumber = this.roomSequenceData.roomSequenceNumber;
            }
    
            this.selectedRooms.push(this.roomData);
          }
          this.booking.roomDetails = this.selectedRooms;
    
          this.bookingService.roomAllocation(this.booking).subscribe(response => {
            if (response.status === 200) {
                this.createAuditReport(this.bookingRoomDetails, this.booking);
              if (this.booking.groupBooking != null && this.booking.groupBooking === true) {
                this.bookingSuccessDialog("success", 'Booking', 'Booking Room Allocation', "Room Allocation Completed.", null, 'Go to Guest List', this.booking);
                this.navCtrl.navigateForward("booking-list");
                this.modalcntrler.dismiss();
              }
              else if (this.booking.groupBooking === null || this.booking.groupBooking === false) {
                this.bookingErrorDialog("success", 'Booking', 'Booking Room Allocation', "Room Allocation Completed.", null, 'OK');
                this.navCtrl.navigateForward("booking-list");
                this.modalcntrler.dismiss();
              }
              
    
              if(this.bookingStatus != null && this.bookingStatus != undefined && this.bookingStatus ==='CHECKEDIN')
              {
                this.onCheckIn();
              }
              else
              {
                this.modalcntrler.dismiss();
              }

              this.isProgressing = false;
    
            }
          },
            error => {
              if (error instanceof HttpErrorResponse) {
                if (error.status === 417) {
                  this.isProgressing = false;
    
                  this.bookingErrorDialog("error", 'Booking', 'Room Allocation Error', "Please proceed with offline room allocation and update the booking.", null, 'Cancel');
                  this.modalcntrler.dismiss();
                }
              }
            }
          );
         }
      }

    
      async bookingSuccessDialog(statusText: string, title: string, subTitle: string, message: string, buttonText: string, cancel: string, booking: Booking) {
        // const dialogRef = this.dialog.open(BookingDialogComponent, {
        //   width: '60%',
        //   panelClass: 'custom-dialog-container',
        //   data: {
        //     message: message,
        //     title: title,
        //     subTitle: subTitle,
        //     buttonText: buttonText,
        //     cancelText: cancel,
        //     status: statusText
        //   }
        // });
        // dialogRef.afterClosed().subscribe(result => {
        //   dialogRef.close();
        //   if (result != undefined) {
    
        //     this.onGuestList(booking);
    
        //   }
          // });
          
          const modal = await this.modalcntrler.create({
            component: DialogContentComponent,
            cssClass: "my-custom-class",
            swipeToClose: true,
            componentProps: {
                message: message,
                title: title,
                subTitle: subTitle,
                buttonText: buttonText,
                cancelText: cancel,
                status: statusText
            },
        });

        modal.onDidDismiss().then((data) => {
            console.log("list  modal dismissed", data);
          
        });
        return await modal.present();
      }
    
      async bookingErrorDialog(statusText: string, title: string, subTitle: string, message: string, buttonText: string, cancel: string) {

          const modal = await this.modalcntrler.create({
            component: DialogContentComponent,
            cssClass: "my-custom-class",
            swipeToClose: true,
            componentProps: {
                message: message,
                title: title,
                subTitle: subTitle,
                buttonText: buttonText,
                cancelText: cancel,
                status: statusText
            },
        });

        modal.onDidDismiss().then((data) => {
            console.log("list  modal dismissed", data);
          
        });
        return await modal.present();
      }
    
      roomRealese(row) {
        this.isProgressing = true;
        row.checkoutTime = new Date().getTime();
        this.bookingService.roomRealese(row).subscribe(
          (response) => {
            if (response.status === 200) {
              this.isProgressing = false;
              this.findRatesAndAvailabilityForAllRoomsByDate();
            }
          },
          (error) => {
            if (error instanceof HttpErrorResponse) {
              if (error.status === 417) {
                this.isProgressing = false;
    
              }
            }
          }
        );
      }
    
      onCheckIn()
      {
        if(this.booking.checkinTime != undefined && this.booking.checkinTime != null)
        {
          this.booking.checkinTime = new Date(this.booking.checkinTime).getTime().toString();
        }
    
        this.checkin(this.booking);
      }
    
      checkin(row) {
        this.isProgressing = true;
        this.bookingService.checkin(row).subscribe(
          (response) => {
            if (response.status === 200) {
               
                this.modalcntrler.dismiss();
              this.isProgressing = false;
            }
          },
          (error) => {
            if (error instanceof HttpErrorResponse) {
              if (error.status === 417) {
                this.isProgressing = false;
                // this.openErrorSnackBar('Please proceed with offline room allocation and update the booking.');
                this.presentToast(
                  "Please proceed with offline room allocation and update the booking.",
                );
              }
            }
          }
        );
      }
      createAuditReport(prevRoomDetails, currentBooking : Booking)
      {
        this.role = [];
        JSON.parse(this.token.getRole()).forEach((item) => {
          this.role.push(item);
        });
    
        let audit = new Audit();
    
        audit.reservationId = currentBooking.propertyReservationNumber;
        audit.bookingId = currentBooking.id;
        audit.propertyId = currentBooking.propertyId;
        audit.role = this.role[0];
        audit.updatedAt = new Date().getTime().toString();
        audit.updatedBy = currentBooking.operatorName;
    
        if (prevRoomDetails != null && prevRoomDetails != undefined && prevRoomDetails.length > 0)
        {
          let roomNo = [];
          for (let num = 0; num < prevRoomDetails.length; num++)
          {
            roomNo.push(prevRoomDetails[num].roomNumber);
          }
          audit.previousValue = `Room:${roomNo.toString()}, Date:${this.datepipe.transform(currentBooking.fromDate, "dd-MM-yyyy")} to ${this.getCurrentRoomChangeDate(currentBooking)} `;
        }
    
        if (currentBooking != null && currentBooking != undefined && currentBooking.roomDetails != null && currentBooking.roomDetails.length > 0)
        {
          let roomNo2 = [];
          for (let num = 0; num < currentBooking.roomDetails.length; num++)
          {
            roomNo2.push(currentBooking.roomDetails[num].roomNumber);
          }
    
          if (prevRoomDetails != null && prevRoomDetails != undefined && prevRoomDetails.length > 0)
          {
            audit.newValue =  `Room:${roomNo2.toString()}, Date:${this.getCurrentRoomChangeDate(currentBooking)} to ${this.datepipe.transform(currentBooking.toDate, "dd-MM-yyyy")}`;
            audit.updateType = "Room Shift";
            audit.auditType = AUDIT_ROOM_SHIFT;
          }
          else
          {
            audit.newValue = roomNo2.toString();
            audit.updateType = "Room Allocation";
            audit.auditType = AUDIT_ROOM_ALLOCATION;
          }
        }
    
        audit.operatorNotes = currentBooking.operatorNotes;
        audit.roomId = currentBooking.roomId;
    
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
    
      cancelRoomChange(){
    
        if (
          this.bookingRoomDetails != null &&
          this.bookingRoomDetails != undefined
        ) {
          this.roomNumbers = this.bookingRoomDetails;
          this.resetRoomAllocation();
        }
        else
        {
            this.modalcntrler.dismiss();
        }
    
      }
    
      resetRoomAllocation() {
        this.selectedRooms = [];
    
        this.isProgressing = true;
    
        if (this.roomNumbers.length > 0) {
          for (let num = 0; num < this.roomNumbers.length; num++) {
            this.roomData = new RoomDetails();
            this.roomData = this.roomNumbers[num];
            this.roomData.available = false;
            this.roomData.guestName =
              this.booking.firstName + " " + this.booking.lastName;
            this.roomData.bookingId = this.booking.id;
            this.roomData.roomStatus = "BLOCKED";
    
            this.roomSequenceData = new RoomDetails();
            this.roomSequenceData = this.room.roomDetails.find(
              (room) => room.roomNumber === this.roomData.roomNumber
            );
    
            if (
              this.roomSequenceData != null &&
              this.roomSequenceData != undefined
            ) {
              this.roomData.roomSequenceNumber =
                this.roomSequenceData.roomSequenceNumber;
            }
    
            this.selectedRooms.push(this.roomData);
          }
          this.booking.roomDetails = this.selectedRooms;
    
          this.bookingService.roomAllocation(this.booking).subscribe(
            (response) => {
              if (response.status === 200) {
             
                this.isProgressing = false;
    
                if (
                  this.bookingStatus != null &&
                  this.bookingStatus != undefined &&
                  this.bookingStatus === "CHECKEDIN"
                ) {
                  this.onCheckIn();
                } else {
                    this.modalcntrler.dismiss();
                }
              }
            },
            (error) => {
              if (error instanceof HttpErrorResponse) {
                if (error.status === 417) {
                  this.isProgressing = false;
    
                  this.bookingErrorDialog(
                    "error",
                    "Booking",
                    "Room Allocation Error",
                    "Please proceed with offline room allocation and update the booking.",
                    null,
                    "Cancel"
                  );
                  this.modalcntrler.dismiss();
                }
              }
            }
          );
        } else {
          this.modalcntrler.dismiss();
        }
      }
    
      sortTodaysArray(array) {
        let sequenceArray = [],
          nonSequenceArray = [];
    
        if (array != null && array != undefined)
        {
          for (var i = 0; i < array.length; i++) {
            if (
              array[i].roomSequenceNumber != null &&
              array[i].roomSequenceNumber != undefined
            ) {
              sequenceArray.push(array[i]);
            } else {
              nonSequenceArray.push(array[i]);
            }
          }
    
          sequenceArray = this.sortArraySqToday(sequenceArray);
          nonSequenceArray = this.sortArrayNonSqToday(nonSequenceArray);
    
          for (let i = 0; i < nonSequenceArray.length; i++) {
            sequenceArray.push(nonSequenceArray[i]);
          }
        }
    
        return sequenceArray;
      }
    
      sortArraySqToday(array) {
        var temp = 0;
        if (array != null && array != undefined)
        {
          for (var i = 0; i < array.length; i++) {
            for (var j = i; j < array.length; j++) {
              if (
                array[j].roomSequenceNumber <
                array[i].roomSequenceNumber
              ) {
                temp = array[j];
                array[j] = array[i];
                array[i] = temp;
              }
            }
          }
        }
    
        return array;
      }
      sortArrayNonSqToday(array) {
        var temp = 0;
        if (array != null && array != undefined) {
          for (var i = 0; i < array.length; i++) {
            for (var j = i; j < array.length; j++) {
              if (array[j].roomNumber < array[i].roomNumber) {
                temp = array[j];
                array[j] = array[i];
                array[i] = temp;
              }
            }
          }
        }
    
        return array;
      }
    
    
      getCurrentRoomChangeDate(booking)
      {
        let bookingTodate = this.datepipe.transform(booking.toDate, "yyyy-MM-dd");
        let bookingFromDate = this.datepipe.transform(booking.fromDate, "yyyy-MM-dd");
    
        if (new Date(bookingFromDate).getTime() >= new Date().getTime())
        {
          return this.datepipe.transform(booking.fromDate, "dd-MM-yyyy");
        }
        else if (new Date(bookingTodate).getTime() <= new Date().getTime())
        {
          return this.datepipe.transform(booking.toDate, "dd-MM-yyyy");
        }
        else if (new Date(bookingFromDate).getTime() < new Date().getTime() &&
        new Date(bookingTodate).getTime() > new Date().getTime())
        {
          return  this.datepipe.transform(new Date(), "dd-MM-yyyy");
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
