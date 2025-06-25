import { Logger } from '../../service/logger.service';
import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { ComponentListOptionMenuComponent } from '../../component/booking-list/component-list-option-menu/component-list-option-menu.component';
import { PopoverController } from '@ionic/angular';
import { TokenStorage } from '../../token.storage';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  constructor(private navCtrl: NavController,
    private token: TokenStorage,
    private menuCtrl: MenuController,
    public popoverController: PopoverController) { }

  ngOnInit() { }

  Dashboard() {
    if (this.token.getProperty() != null && this.token.getProperty().businessType !== undefined
      && this.token.getProperty().businessType.toLocaleLowerCase() !== 'accommodation') {
      if (this.token.getProperty().plan === 'Business Starter') {
        Logger.log('dashboard');
        this.navCtrl.navigateRoot('service-dashboard');
      }
      else {
        Logger.log('dashboard');
        this.navCtrl.navigateRoot('service-dashboard');
      }

    }
    else {
      Logger.log('dashboard');
      this.navCtrl.navigateRoot('home');
    }

  }
  async option(event: any) {
    const popover = await this.popoverController.create({
      component: ComponentListOptionMenuComponent,
      event: event,
      translucent: true,
    });
    return await popover.present();
  }
  menuClick() {
    Logger.log('manu click');
    this.menuCtrl.toggle();
  }

}
