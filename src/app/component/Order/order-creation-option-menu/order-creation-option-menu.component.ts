import { DateService } from "./../../../service/DateService/date-service.service";
import { Component, OnInit } from "@angular/core";
import { NavigationExtras } from "@angular/router";
import { NavController, PopoverController } from "@ionic/angular";
import { Order } from "src/app/model/Order/order";
import { Property } from "src/app/model/property/Property";
import { TokenStorage } from "src/app/token.storage";

@Component({
    selector: "app-order-creation-option-menu",
    templateUrl: "./order-creation-option-menu.component.html",
    styleUrls: ["./order-creation-option-menu.component.scss"],
})
export class OrderCreationOptionMenuComponent implements OnInit {
    property: Property;
    roomOrder: Order;

    constructor(
        private navCtrl: NavController,
        private dateService: DateService,
        private token: TokenStorage,
        private popover: PopoverController
    ) {
        this.property = new Property();
    }

    ngOnInit() {
        this.property = this.token.getProperty();
    }

    allOrder() {
        this.popover.dismiss();
        this.navCtrl.navigateRoot("checkout");
    }

    onQuickDineInOrder() {
        this.popover.dismiss();
        this.roomOrder = new Order();
        this.roomOrder.deliveryMethod = "Dine In";
        this.roomOrder.orderedDate =
            this.dateService.convertMillisecondsToYYYMMDDFormat(new Date());

        let navigationExtras: NavigationExtras = {
            queryParams: {
                quickDyneInOrder: JSON.stringify(this.roomOrder),
            },
        };

        this.navCtrl.navigateForward(["checkout"], navigationExtras);
    }
}
