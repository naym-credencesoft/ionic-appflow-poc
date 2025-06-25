import { Injectable } from '@angular/core';
import { BookingService } from '../../../app/service/manage-booking/booking-service.service';
import { TokenStorage } from './../../token.storage';
import { NavController, MenuController, LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class BookingListActionService {

  constructor( 
    public navCtrl: NavController,
    private toastController: ToastController,
    private bookingService: BookingService,
    private token: TokenStorage,)
   { }

   

   async presentToast(Message :string) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2000
    });
    toast.present();
  }

}
