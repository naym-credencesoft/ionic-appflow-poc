import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OrderEventsService } from 'src/app/service/order-events.service';

@Component({
  selector: 'app-cancel-order-modal',
  templateUrl: './cancel-order-modal.component.html',
  styleUrls: ['./cancel-order-modal.component.scss'],
})
export class CancelOrderModalComponent {
  @Input() order: any;
  @Input() updatedBy: string = 'System';

  reason: string = '';

  constructor(private modalCtrl: ModalController,
          private changeDetectorRefs: ChangeDetectorRef,
            private orderEvents: OrderEventsService
  ) {

  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  ionViewWillEnter(){
        this.order.operatorNotes = null;
  }

  confirmCancel() {
    if (this.order.operatorNotes.trim() !== '') {
      this.modalCtrl.dismiss({
        reason: this.order.operatorNotes,
      });
              this.modalCtrl.dismiss();
                  this.closeSuccessDialog();
                this.orderEvents.notifyOrderUpdated(); // ✅ Notify
                this.modalCtrl.dismiss({ reason: this.reason }, 'updated');
                this.changeDetectorRefs.detectChanges();

    }
  }
    closeSuccessDialog() {
        this.modalCtrl.dismiss("done");
    }
}

  