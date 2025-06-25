import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { BookingService } from 'src/app/service/manage-booking/booking-service.service';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Logger } from 'src/app/service/logger.service';
import { DateService } from 'src/app/service/DateService/date-service.service';

export interface RoomStatus {
    name: string;
    value: string,
  }

@Component({
  selector: 'app-room-status-change',
  templateUrl: './room-status-change.page.html',
  styleUrls: ['./room-status-change.page.scss'],
})
export class RoomStatusChangePage implements OnInit {

    roomstatusList : RoomStatus[] = [
        { value: 'OCCUPIED', name: 'OCCUPIED' },
        { value: 'NOT_READY', name: 'NOT READY' },
        { value: 'DO_NOT_DISTRUB', name: 'DO NOT DISTRUB' },
        { value: 'CLEANING_IN_PROGRESS', name: 'CLEANING IN PROGRESS' },
        { value: 'SLEEP_OUT', name: 'SLEEP OUT' },
        { value: 'ON_QUEUE', name: 'ON QUEUE' },
        { value: 'VACANT_READY', name: 'VACANT READY' },
        { value: 'LATE_CHECK_OUT', name: 'LATE CHECKOUT' },
        { value : 'BLOCKED' , name : 'BLOCKED'}
      ];

    roomStatus : string;
    onRoomChangeForm :  FormGroup;
    status: FormControl = new FormControl();
    isAvailable: FormControl = new FormControl();

    loader : boolean = false;
    roomDetailStatus: any;
  date: any;

  constructor(private formBuilder: FormBuilder,    
    private bookingService: BookingService,
    private acRoute: ActivatedRoute,
    private toastController: ToastController,
    private dateService : DateService,
    private locationBack: Location,) 
  { 
    this.onRoomChangeForm = this.formBuilder.group({
        status: ["", Validators.compose([Validators.required])],
        isAvailable: ["", Validators.compose([Validators.nullValidator])],
    });

  }

  ngOnInit() {

    this.acRoute.queryParams.subscribe(params => {

        if (params['room'] !== undefined) {
          this.roomDetailStatus = JSON.parse(params['room']);

          this.roomStatus = this.roomDetailStatus.roomStatus;
          this.date = params['date'];
  
          Logger.log('this.booking.roomBooking ' + JSON.stringify(this.roomDetailStatus));
  
        }
      });

  }


  setStatus(status)
  {
      Logger.log('status ' + this.roomStatus);
  }

  change()
  {
    this.roomDetailStatus.roomStatus = this.roomStatus;
    this.roomDetailStatus.date = this.date
    this.bookingService.updateRoomDetailStatus(this.roomDetailStatus)
      .subscribe(data => {
        // Logger.log('UpdateRoomDetailstatus '+JSON.stringify(data));
        this.presentToast('Room status changed successfully');
        this.back();
      },error=>{
        this.presentToast('Fail to update room status');
      });
  }

  back()
  {
      this.locationBack.back();
  }

  async presentToast(Message: string) {
    const toast = await this.toastController.create({
        message: Message,
        duration: 2000,
    });
    toast.present();
}

}
