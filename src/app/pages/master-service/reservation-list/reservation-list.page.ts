import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ActionSheetController, NavController, ToastController } from '@ionic/angular';
import { SlotReservation } from '../../../model/Reservation/slotReservation';
import { DateService } from '../../../service/DateService/date-service.service';
import { Logger } from '../../../service/logger.service';
import { ReservationService } from '../../../service/ReservationService/reservation-service.service';
import { TokenStorage } from '../../../token.storage';
import { Property } from "src/app/model/property/Property";

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.page.html',
  styleUrls: ['./reservation-list.page.scss'],
})
export class ReservationListPage implements OnInit {
    property: Property;
  loader: boolean = false;
  slotReservations: SlotReservation[];
  slotReservationsFilterOb: SlotReservation[];
    plan: string;
    openedCardIndex: number | null = null;

    p: number = 1;

  constructor(
    private reservationService: ReservationService,
    public token: TokenStorage,
    private actionSheetController: ActionSheetController,
    private navCtrl: NavController,
    private toastController: ToastController,
    private acRoute: ActivatedRoute,
    public dateService: DateService,
    private changeDetectorRefs: ChangeDetectorRef) 
    { 
        this.plan = this.token.getProperty().plan;
        this.property = new Property();
    }

  ngOnInit() {
    this.getResarvationList();
    this.property = this.token.getProperty();
    console.log("property details", this.property)
  }

  navigateToPage() {
    this.navCtrl.navigateForward('/service-dashboard');
  }

  getResarvationList() {
    this.loader = true;
    this.reservationService.getAllSlotReservationByPropertyId(this.token.getPropertyId()).subscribe(data => {
      this.slotReservations = data.body;
      this.slotReservations.reverse();
      this.slotReservationsFilterOb = data.body;
      Logger.log(JSON.stringify(data));

      this.loader = false;
      this.changeDetectorRefs.detectChanges();
    }, error => {
      this.loader = false;
    });
  }

  toggleCardBody(index: number): void {
    // Toggle the card body visibility
    this.openedCardIndex = this.openedCardIndex === index ? null : index;
  }

  async onMenu(row) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Manage Reservation',
      cssClass: 'action-sheets-basic-page',
      mode: 'md',
      buttons:
        [{
          text: 'Details',
          icon: 'document',
          handler: () => {
            Logger.log(JSON.stringify(row));
            let navigationExtras: NavigationExtras = {
              queryParams: {
                reservationOb: JSON.stringify(row),
                //permission: 1,
              }
            };

            this.navCtrl.navigateForward(['reservation-details/' + row.id]);
          }
        },
        {
          text: 'Cancel Reservation',
          icon: 'close',
          handler: () => {

            if (row.bookingStatus.toLowerCase() === 'cancelled') {
              this.presentToast('Already cancelled');
            }
            else {
              this.onCancel(row.id);
            }

          }
        },
        {
          text: 'Add Reservation',
          icon: 'add',
          handler: () => {

            Logger.log(JSON.stringify(row));
            let navigationExtras: NavigationExtras = {
              queryParams: {
                reservationOb: JSON.stringify(row),
                //permission: 1,
              }
            };

            this.navCtrl.navigateForward(['add-reservation',]);

          }
        },

        ]
    });
    await actionSheet.present();
  }

  onCancel(ReservationId: string) {
    this.loader = true;
    this.reservationService.cancelReservation(ReservationId).subscribe(data => {

      //  Logger.log(JSON.stringify(data));
      this.presentToast('Reservation Cancel successfully');
      this.getResarvationList();
      this.loader = false;
      this.changeDetectorRefs.detectChanges();
    }, error => {
      this.loader = false;
      // Logger.log(JSON.stringify(error));
    });
  }

  async presentToast(Message: string) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2000
    });
    toast.present();
  }

  getItems(ev: any) {

    const val = ev.target.value;


    this.slotReservations = this.slotReservationsFilterOb;

    this.slotReservations = this.slotReservations.filter((item) => {

      const searchResult = (
        (item.firstName != null && item.lastName && (item.firstName + ' ' + item.lastName).toLowerCase().trim().indexOf(val.trim().toLowerCase().trim()) > -1) ||
        (item.bookingStatus != null && item.bookingStatus.toLowerCase().indexOf(val.toLowerCase().trim()) > -1) ||
        (item.businessName != null && item.businessName.toLowerCase().indexOf(val.toLowerCase().trim()) > -1) ||
        (item.businessReservationNumber != null && String(item.businessReservationNumber).toLowerCase().trim().indexOf(val.toLowerCase().trim()) > -1) ||
        (item.date != null && this.dateService.convertMillisecondsToDateFormat(item.date).indexOf(val.trim()) > -1) ||
        (item.locationName != null && item.locationName.toLowerCase().indexOf(val.toLowerCase().trim()) > -1) ||
        (item.resourceName != null && item.resourceName.toLowerCase().indexOf(val.toLowerCase().trim()) > -1)
      )
      return searchResult;
    })

  }

  clear(event) {

  }

  createReservation() {
    this.navCtrl.navigateForward('add-reservation');
  }

}
