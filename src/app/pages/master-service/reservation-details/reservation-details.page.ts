import { TokenStorage } from './../../../token.storage';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessService } from 'src/app/model/Reservation/businessServic';
import { SlotReservation } from 'src/app/model/Reservation/slotReservation';
import { ReservationService } from 'src/app/service/ReservationService/reservation-service.service';
import { Logger } from '../../../service/logger.service';

@Component({
  selector: 'app-reservation-details',
  templateUrl: './reservation-details.page.html',
  styleUrls: ['./reservation-details.page.scss'],
})
export class ReservationDetailsPage implements OnInit {
  slotReservation: SlotReservation;
  loader = false;
    customerAddress: any;
    businessService: BusinessService;
    businessAddressName: string;
    customerAddressName: string;
    
  constructor(
    private router: Router,
    public token : TokenStorage,
    private reservationService: ReservationService,
    private changeDetectorRefs: ChangeDetectorRef,
    private acRoute: ActivatedRoute
  ) {
    this.slotReservation = new SlotReservation();
    this.businessService = new BusinessService();
  }

  ngOnInit() {
    const reservationId = this.acRoute.snapshot.params.id;

    this.getReservationDetailsById(reservationId);
  }
  getReservationDetailsById(reservationId) {
    this.loader = true;
    this.reservationService.getReservationByReservationId(reservationId).subscribe(
      (data) => {
        this.slotReservation = data.body;

        if (this.slotReservation.customerDtoList != null && this.slotReservation.customerDtoList != undefined && this.slotReservation.customerDtoList.length > 0) {
            if (this.slotReservation.customerDtoList[0].address != null && this.slotReservation.customerDtoList[0].address != undefined) {
              this.customerAddress = this.slotReservation.customerDtoList[0].address;
            }
          }
  
          if (this.slotReservation.slotReservationDtos != null && this.slotReservation.slotReservationDtos != undefined && this.slotReservation.slotReservationDtos.length > 0) {
            if (this.slotReservation.slotReservationDtos[0].businessServiceId != null && this.slotReservation.slotReservationDtos[0].businessServiceId != undefined) {
              this.getAllBusinessService(this.slotReservation.slotReservationDtos[0].businessServiceId);
            }
          }

        this.changeDetectorRefs.detectChanges();
        this.loader = false;
      },
      (error) => {
        this.loader = false;
      }
    );
  }

  getAllBusinessService(serviceId: number) {
    this.loader = true;
    this.reservationService.getBusinessServiceByServiceId(String(serviceId)).subscribe(data => {
      this.businessService = data.body;
      this.loader = false;

      if (this.businessService.businessLocationName != null && this.businessService.businessLocationName != undefined) {
        this.businessAddressName = this.businessService.businessLocationName;
        this.changeDetectorRefs.detectChanges();
      }
      else {
        this.businessAddressName = "Business";
        this.changeDetectorRefs.detectChanges();
      }

      if (this.businessService.customerLocationName != null && this.businessService.customerLocationName != undefined) {
        this.customerAddressName = this.businessService.customerLocationName;
        this.changeDetectorRefs.detectChanges();
      }
      else {
        this.customerAddressName = "Customer";
        this.changeDetectorRefs.detectChanges();
      }

        Logger.log('service : '+JSON.stringify( this.businessService));
    }, error => {
      this.loader = false;
    });
  }

  capitalize(word) {
    return word[0].toUpperCase() + word.slice(1).toLowerCase();
  }
}
