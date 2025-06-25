import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CheckUserType } from '../../model/checkUserType';
import { Notifications } from '../../model/Notification/notification';
import { OrderService } from '../../service/Order/order.service';
import { TokenStorage } from '../../token.storage';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

    // @Input() notificPanel;

    roleArray: any = [];
    role: any = [];

    checkUserType: CheckUserType;

    notifications: Notifications[];
    notificationNew: Notifications[];
    timeIntevalSeconds = 90;

    cancel: string = 'warn';
    confirm: string = 'success';

    message: string;

    constructor(
        private router: Router,
        private orderService: OrderService,
        public navCtrl: NavController,
        private token: TokenStorage
      ) {
        this.roleArray = this.token.getRole();
        this.checkUserType = new CheckUserType();

        this.role = [];
        JSON.parse(this.token.getRole()).forEach(item => {
          this.role.push(item);
        });

        const filters = {
          roles: roles => roles.find(x => this.roleArray.includes(x.toUpperCase())),
        };


        if (this.checkUserType.isHotelAdmin(this.role[0]) == true)
        {
          if (this.token.getProperty().propertyStatus === "COMPLETED")
          {
            this.callNotification();
          }
        }

      }

    ngOnInit() {
      this.router.events.subscribe((routeChange) => {
          if (routeChange instanceof NavigationEnd) {
            // this.notificPanel.close();/
          }
      });

    }

    callNotification()
    {
      this.getNotification();

       let refreshIntervalId = setInterval(() => {
        this.getNotification();
        if (this.token.getProperty() === null || this.token.getProperty() === undefined)
        {
          clearInterval(refreshIntervalId);
        }
      }, this.timeIntevalSeconds * 1000);
    }

    onRoutePage(row) {

      row.notificationStatus = 'Read';
      this.saveNotification(row);
      this.onRoutePageRedrect(row);
    }

    onRoutePageRedrect(row) {

      row.notificationStatus = 'Read';
      this.saveNotification(row);

      if (row.notificationType.toLowerCase() === 'order') {
        let navigationExtras: NavigationExtras = {
          queryParams: {
            orderId: row.referenceId,
          }
        };
        this.navCtrl.navigateForward(['order-details'] , navigationExtras);
      } else if (row.notificationType.toLowerCase() === 'invoice') {
        this.router.navigate(['/invoice/invoice-list'] );
      } else if (row.notificationType.toLowerCase() === 'booking') {
        this.router.navigate(['/bookone/manage-booking/list'] );
      } else if (row.notificationType.toLowerCase() === 'payment') {
        this.router.navigate(['/bookone/manage-payment'] );
      } else if (row.notificationType.toLowerCase() === 'reservation') {
        this.navCtrl.navigateForward(['reservation-details/' + row.referenceId] );
      } else if (row.notificationType.toLowerCase() === 'availability') {
        this.router.navigate(['/bookone/manage-rates-availability'] );
      }

    }
    clearAll(e) {
      e.preventDefault();
      this.notifications = [];
    }
    getNotification() {
      this.notificationNew = [];
      this.orderService.getNotificationForProperty(+this.token.getPropertyId()).subscribe(resp => {
        this.notifications = resp.body;

        this.notificationNew = resp.body;
        this.notificationNew.reverse();

        this.notificationNew = this.notificationNew.filter((item) => {

          const searchResult = (
            (item.notificationStatus != null && item.notificationStatus.toString().toLocaleLowerCase().indexOf('new') > -1));
            return searchResult;
          });


      });
    }

    saveNotification(notifications) {
      this.orderService.saveNotification(notifications).subscribe(resp => {
        this.notifications = resp.body;
        this.getNotification() ;

      });
    }

}
