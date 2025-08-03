import { Logger } from "../../../service/logger.service";
import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import {
    ActionSheetController,
    IonModal,
    NavController,
    ToastController,
} from "@ionic/angular";
import { Invoice } from "../../../model/invoice/invoice";
import { DateService } from "../../../service/DateService/date-service.service";
import { InvoiceService } from "../../../service/invoice/invoice.service";
import { TokenStorage } from "../../../token.storage";
import { NavigationExtras } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Property } from "src/app/model/property/Property";

@Component({
    selector: "app-invoice-list",
    templateUrl: "./invoice-list.page.html",
    styleUrls: ["./invoice-list.page.scss"],
})
export class InvoiceListPage implements OnInit {
    @ViewChild("fromModal", { static: false }) fromModal: IonModal;
    @ViewChild("toModal", { static: false }) toModal: IonModal;
    onSeachForm: FormGroup;
    property: Property;
    invoices: Invoice[];
    invoicesFilter: Invoice[];
    loader: boolean = false;
    p: number = 1;
    toMinDate: string;
    toMaxDate: string;
    currentMonth: string;
    currentDay: string;

    fromDate: string;
    toDate: string;
    openedCardIndex: number | null = null;
    formattedDate: string;

         isFromModalOpen = false;
    isToModalOpen = false;
    
    constructor(
        private invoiceService: InvoiceService,
        private formBuilder: FormBuilder,
        private changeDetectorRefs: ChangeDetectorRef,
        private toastController: ToastController,
        private actionSheetController: ActionSheetController,
        private navCtrl: NavController,
        public dateService: DateService,
        public token: TokenStorage
    ) {
        this.property = new Property();
        this.onSeachForm = this.formBuilder.group({
  rateAndAvailFromDate: [new Date().toISOString().split("T")[0],
                Validators.compose([Validators.required])],
  rateAndAvailToDate: [new Date().toISOString().split("T")[0],
                Validators.compose([Validators.required])],
});


        // this.onSeachForm = this.formBuilder.group({
        //     rateAndAvailFromDate: [ new Date(),
                
        //         Validators.compose([Validators.required]),
        //     ],
        //     rateAndAvailToDate: [new Date(), Validators.compose([Validators.required])],
        // });
    }

    ngOnInit() {
        // this.currentMonthInterval();
        this.currentDateInterval();
        this.property = this.token.getProperty();
        console.log("property details", this.property)
    }

    navigateToPage() {
        this.navCtrl.navigateForward('/service-dashboard');
      }
    // currentMonthInterval() {
    //     this.toDate = this.dateService.convertMillisecondsToYYYMMDDFormat(
    //         new Date()
    //     );

    //     let currentdate = new Date();

    //     currentdate.setDate(currentdate.getDate() - 1);
    //     currentdate.setMonth(currentdate.getMonth() - 1);

    //     this.fromDate =
    //         this.dateService.convertMillisecondsToYYYMMDDFormat(currentdate);

    //     this.fromDateChange();
    //     this.getInvoiceByPropertyAnddateRange(
    //         Number(this.token.getPropertyId()),
    //         this.fromDate,
    //         this.toDate
    //     );
    // }
    currentDateInterval() {
        const currentDate = new Date();
        // this.onSeachForm.get('rateAndAvailFromDate')?.setValue(currentDate);
        // this.onSeachForm.get('rateAndAvailToDate')?.setValue(currentDate);
        this.formattedDate  = this.dateService.convertMillisecondsToYYYMMDDFormat(currentDate);
        this.toDate = this.dateService.convertMillisecondsToYYYMMDDFormat(currentDate);
       
        this.getInvoiceByPropertyAnddateRange(
            Number(this.token.getPropertyId()),
            this.formattedDate,
            this.formattedDate
        )
    }

    onReset() {
    // Clear your data variables
    this.invoices = [];
    this.p = 1;

    // Reset the form controls so UI updates
    this.onSeachForm.reset();

    // Reset min/max dates if needed
    this.fromDate = '';
    this.toDate = '';
    this.toMinDate = '';

    // Optionally close modals if open
    //   this.isFromModalOpen = false;
    //   this.isToModalOpen = false;
    }

    toggleCardBody(index: number): void {
        // Toggle the card body visibility
        this.openedCardIndex = this.openedCardIndex === index ? null : index;
      }

    onSearch() {
       const fromDateValue = this.onSeachForm.get('rateAndAvailFromDate')?.value;
        const toDateValue = this.onSeachForm.get('rateAndAvailToDate')?.value;

        if (!fromDateValue || !toDateValue) {
            this.presentToast("Please select both From and To dates.");
            return;
        }

        const formattedFromDate = this.dateService.convertMillisecondsToYYYMMDDFormat(fromDateValue);
        const formattedToDate = this.dateService.convertMillisecondsToYYYMMDDFormat(toDateValue);

        this.getInvoiceByPropertyAnddateRange(
            Number(this.token.getPropertyId()),
            formattedFromDate,
            formattedToDate
        );
    }



    setFromDateOpen(isOpen: boolean) {
    this.isFromModalOpen = isOpen;
  }

  dismissFromDateModal() {
    this.isFromModalOpen = false;
  }

      setToDateOpen(isOpen: boolean) {
    this.isToModalOpen = isOpen;
  }

      dismissToDateModal() {
    this.isToModalOpen = false;
    }
    

    fromDateChange() {
       const fromDateControl = this.onSeachForm.get('rateAndAvailFromDate');
        const fromDateValue = fromDateControl?.value;

        if (fromDateValue) {
            Logger.log("From Date changed: " + fromDateValue);
            const toDate = new Date(fromDateValue);
            toDate.setDate(toDate.getDate() + 1);
            this.toMinDate = this.getDate(toDate);
        }

    }
    onCancel() {
    // console.log("Date selection cancelled");
    // Handle cancel action
    }

    
    toDateChange(){

        setTimeout(() => {
            this.toModal?.dismiss();
        }, 100);
    }

    getDate(date: Date) {
        if (date.getDate().toString().length == 1) {
            this.currentDay = "0" + date.getDate();
        } else {
            this.currentDay = "" + date.getDate();
        }

        if ((date.getMonth() + 1).toString().length == 1) {
            this.currentMonth = "0" + (date.getMonth() + 1);
        } else {
            this.currentMonth = "" + (date.getMonth() + 1);
        }

        return (
            date.getFullYear() + "-" + this.currentMonth + "-" + this.currentDay
        );
    }

    getInvoiceByPropertyAnddateRange(
        propertyId: number,
        from: string,
        to: string
    ) {
        this.loader = true;
        this.invoices = [];
        this.invoicesFilter = [];
        this.invoiceService
            .getInvoiceListByPropertyIdandDateRange(propertyId, from, to)
            .subscribe(
                (data) => {
                    this.invoices = data.body;
                    this.invoicesFilter = data.body;

                    this.invoices.reverse();
                    this.invoicesFilter.reverse();

                    this.loader = false;

                    Logger.log("this.orders" + JSON.stringify(data.body));
                    this.changeDetectorRefs.detectChanges();
                },
                (error) => {
                    this.loader = false;
                }
            );
    }

    getItems(ev: any) {
        const val = ev.target.value;

        this.invoices = this.invoicesFilter;

        this.invoices = this.invoices.filter((item) => {
            const searchResult =
                (item.propertyReservationId != null &&
                    item.propertyReservationId
                        .toString()
                        .toLowerCase()
                        .indexOf(val.toLowerCase().trim()) > -1) ||
                (item.invoiceNo != null &&
                    String(item.invoiceNo)
                        .trim()
                        .indexOf(val.toLowerCase().trim()) > -1) ||
                (item.invoiceDate != null &&
                    this.dateService
                        .convertMillisecondsToDateFormat(
                            String(item.invoiceDate)
                        )
                        .indexOf(val.trim()) > -1);
            return searchResult;
        });
    }

    clear(event) {}

    async onMenu(row) {
        const actionSheet = await this.actionSheetController.create({
            header: "Manage Invoice",
            cssClass: "action-sheets-basic-page",
            mode: "md",
            buttons: [
                // {
                //     text: 'Invoice',
                //    // icon: 'close',
                //     handler: () => {

                // }
                // },
                //    {
                //     text: 'Invoice Download',
                //    // icon: 'close',
                //     handler: () => {

                //         this.downloadInvoice(this.token.getPropertyId(),row.id);

                //     }
                //    },
                {
                    text: "Invoice Details",
                    // icon: 'close',
                    handler: () => {
                        this.invoiceDetails(row);
                    },
                },
                {
                    text: "Email Invoice",
                    // icon: 'close',
                    handler: () => {
                        this.emailInvoice(this.token.getPropertyId(), row.id);
                    },
                },
            ],
        });
        await actionSheet.present();
    }
    invoiceDetails(row) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                // paymentOb: JSON.stringify(payment),
                id: row.id,
            },
        };

        this.navCtrl.navigateForward(["invoice-details"], navigationExtras);
    }

    emailInvoice(propertyId: string, invoiceId: string) {
        this.loader = true;
        this.invoiceService.getEmailInvoice(propertyId, invoiceId).subscribe(
            (data) => {
                if (data.status === 200) {
                    this.presentToast("Email invoice send successfully");
                } else {
                    this.presentToast("Fail");
                }

                this.loader = false;
                this.changeDetectorRefs.detectChanges();
            },
            (error) => {
                this.loader = false;
            }
        );
    }

    invoiceDetail(url: string) {
        window.open(url, "_blank");
    }

    public downloadInvoice(propertyId: string, invoiceId: string) {
        this.loader = true;
        this.invoiceService.downloadInvoice(propertyId, invoiceId).subscribe(
            (data) => {
                //  this.loader = false;

                Logger.log("data : " + JSON.stringify(data));
            },
            (error) => {
                this.loader = false;
                Logger.log("data : " + JSON.stringify(error));
            }
        );
    }

    async presentToast(Message: string) {
        const toast = await this.toastController.create({
            message: Message,
            duration: 2000,
        });
        toast.present();
    }
}
