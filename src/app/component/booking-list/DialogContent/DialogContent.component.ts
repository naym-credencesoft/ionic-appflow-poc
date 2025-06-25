import { Component, OnInit } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";

@Component({
    selector: "app-DialogContent",
    templateUrl: "./DialogContent.component.html",
    styleUrls: ["./DialogContent.component.scss"],
})
export class DialogContentComponent implements OnInit {
    message: string;
    title: string;
    submitButtonText: string;
    submitButtonText2: string;
    cancelButtonText: string;
    subTitleText: string;
    status: string;

    constructor(private modalcntrler: ModalController,
        private navParams: NavParams,)
    { 

    }

    ngOnInit()
    { 
        this.message = this.navParams.get("message");
        this.title = this.navParams.get("title");
        this.subTitleText = this.navParams.get("subTitle");
        this.submitButtonText = this.navParams.get("buttonText");
        this.submitButtonText2 = this.navParams.get("buttonText2");
        this.cancelButtonText = this.navParams.get("cancelText");
        this.status = this.navParams.get("status");
    }

    onSubmit() {
        this.modalcntrler.dismiss('submit');
      }
    
      onSubmit2() {
        this.modalcntrler.dismiss('submit2');
      }
    
    
      onCancel() {
        this.modalcntrler.dismiss('cancel');
      }
}
