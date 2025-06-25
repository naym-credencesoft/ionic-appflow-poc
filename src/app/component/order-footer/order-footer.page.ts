import { Component, Input, OnInit } from '@angular/core';
import { NavController, MenuController, PopoverController } from '@ionic/angular';
import { Logger } from 'src/app/service/logger.service';
import { TokenStorage } from 'src/app/token.storage';
import { ComponentListOptionMenuComponent } from '../booking-list/component-list-option-menu/component-list-option-menu.component';
import { OrderCreationOptionMenuComponent } from '../Order/order-creation-option-menu/order-creation-option-menu.component';

@Component({
  selector: 'app-order-footer',
  templateUrl: './order-footer.page.html',
  styleUrls: ['./order-footer.page.scss'],
})
export class OrderFooterPage implements OnInit {

    @Input() isOrderDetailPage: boolean;

    constructor(private navCtrl: NavController,
        private token: TokenStorage,
        private menuCtrl: MenuController,
        public popoverController: PopoverController) { }
    
      ngOnInit() { }
    
      Dashboard() {
        if (this.token.getProperty() != null && this.token.getProperty().businessType !== undefined
          && this.token.getProperty().businessType.toLocaleLowerCase() !== 'accommodation') {
          if (this.token.getProperty().plan === 'Business Starter') {
            this.navCtrl.navigateRoot('service-dashboard');
          }
          else {
            this.navCtrl.navigateRoot('service-dashboard');
          }
        }
        else {
          this.navCtrl.navigateRoot('home');
        }
    
      }
    //   async option(event: any) {
    //     const popover = await this.popoverController.create({
    //       component: ComponentListOptionMenuComponent,
    //       event: event,
    //       translucent: true,
    //     });
    //     return await popover.present();
    //   }
      menuClick() {
        Logger.log('manu click');
        this.menuCtrl.toggle();
      }

      async onCreateOrder()
      {
        //this.navCtrl.navigateRoot('checkout');
        const popover = await this.popoverController.create({
            component: OrderCreationOptionMenuComponent,
            event: event,
            translucent: true,
          });
          return await popover.present();
      }

      onOrderList()
      {
        this.navCtrl.navigateRoot('manage-order');
      }

      onKOT()
      {
        this.navCtrl.navigateRoot('kot'); 
      }
        
       onKOM()
       { 
         this.navCtrl.navigateRoot('kom');  
       }

      onOrderDashboard()
      {
        this.navCtrl.navigateRoot('order-dashboard'); 
      }
    
    onPlaceOrder()
    { 
        this.navCtrl.navigateRoot('checkout');  
    }
}
