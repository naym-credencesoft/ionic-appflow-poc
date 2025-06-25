import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SlotReservation } from "../../../model/Reservation/slotReservation";
import { Logger } from "../../../service/logger.service";
import { TokenStorage } from "../../../token.storage";

@Component({
    selector: "app-add-to-slot",
    templateUrl: "./add-to-slot.page.html",
    styleUrls: ["./add-to-slot.page.scss"],
})
export class AddToSlotPage implements OnInit {
    loader = false;
    slotReservation: SlotReservation;
    totalQuantity: number;
    pGroupINumber: number = 0;

    isCartFromMenu: boolean = false;
    isclickG = false;

    constructor(
        public token: TokenStorage,
        //private menuCtrl: MenuController,
        private router: Router
    ) {
        this.slotReservation = new SlotReservation();
        this.slotReservation = this.token.getSlotBookData();

        Logger.log(JSON.stringify(this.slotReservation));
    }

    ngOnInit() {
        // this.slotReservation = this.token.getSlotBookData();
        this.calculateTotal();
    }
    onBookingClick() {
        this.token.clearADDToSlotCart();
        this.token.saveSlotBookData(this.slotReservation);
        // this.token.saveSlotData(this.slotReservation.businessServiceTypes);
        this.router.navigate(["/slot-checkout"]);
    }
    removeSlot(i, r, b) {
        this.slotReservation.businessServiceTypes[i].slots[0].resourceList[
            r
        ].bookedTimings.splice(b, 1);
        this.token.clearADDToSlotCart();
        this.token.saveSlotBookData(this.slotReservation);
        // this.reservationSlotRemoved.emit(this.resourceIndex);
        Logger.log("resourceIndex " + (i + r + b));
        this.calculateTotal();
    }
    removeTimeSlot(i, r, b) {
        if (
            this.slotReservation.businessServiceTypes[i].slots[0].resourceList[
                r
            ].bookedTimings.length === 0
        ) {
            this.slotReservation.businessServiceTypes.splice(i, 1);
            this.token.clearADDToSlotCart();
            this.token.saveSlotBookData(this.slotReservation);
        }
        this.calculateTotal();
    }
    calculateTotal() {
        this.slotReservation.totalAmount = 0;
        this.slotReservation.beforeTaxAmount = 0;

        for (const serviceTypes of this.slotReservation.businessServiceTypes) {
            let tempSlotCount = 0;
            for (const resource of serviceTypes.slots[0].resourceList) {
                for (const time of resource.bookedTimings) {
                    tempSlotCount += 1;
                }
            }
            this.slotReservation.totalAmount +=
                serviceTypes.slots[0].price * tempSlotCount;
            this.slotReservation.beforeTaxAmount +=
                serviceTypes.slots[0].beforeTax * tempSlotCount;
        }
        this.slotReservation.taxAmount =
            this.slotReservation.totalAmount -
            this.slotReservation.beforeTaxAmount;
        this.slotReservation.afterTaxAmount = this.slotReservation.totalAmount;
    }
}
