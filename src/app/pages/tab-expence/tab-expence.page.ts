import { PaymentService } from "./../../service/payment/payment.service";
import { DateService } from "./../../service/DateService/date-service.service";
import { Payment } from "src/app/model/manage-booking/Payment/Payment";
import { RoomDetails } from "src/app/model/RoomDetails/RoomDetails";
import { BookingService } from "src/app/service/manage-booking/booking-service.service";
import { Booking } from "src/app/model/manage-booking/Booking/Booking";
import { ApplicationUser } from "src/app/model/user";
import { AuthService } from "src/app/service/auth.service";
import { Logger } from "../../service/logger.service";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { TokenStorage } from "./../../token.storage";
import { ExpenseService } from "./../../service/ExpenseService/expense-service.service";
import { Expense } from "../../model/Expense/Expense";
import { ExpenseModel } from "../../model/Expense/ExpenseModel";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
} from "@angular/forms";

export interface ExpenseItem {
    value: string;
    viewValue: string;
}

import { LoadingController } from "@ionic/angular";
import { FileService } from "./../../service/FileService/file.service";
import { ToastController } from "@ionic/angular";
import { PropertyExpenseList } from "src/app/model/property/propertyExpense";
import { CheckUserType } from "src/app/model/checkUserType";
import { MobileWallet } from "src/app/model/wallet/mobileWallet";
import { BankAccount } from "../business-setting/bank-details/BankAccount";
import { RoomImage } from "src/app/model/RoomDetails/roomImage";

@Component({
    selector: "app-tab-expence",
    templateUrl: "./tab-expence.page.html",
    styleUrls: ["./tab-expence.page.scss"],
})
export class TabExpencePage implements OnInit {
    expensesList: ExpenseItem[] = [
        { value: "Booking Refund", viewValue: "Booking Refund" },
        {
            value: "Brokerage/ThirdParty Expenses",
            viewValue: "Brokerage/ThirdParty Expenses",
        },
        { value: "Cleaning Fee", viewValue: "Cleaning Fee" },
        { value: "Convenience Fees", viewValue: "Convenience Fees" },
        {
            value: "Delivery Charge Refund",
            viewValue: "Delivery Charge Refund",
        },
        { value: "Fuel", viewValue: "Fuel" },
        {
            value: "Garden & Garden Maintenace",
            viewValue: "Garden & Garden Maintenace",
        },
        { value: "Grocery", viewValue: "Grocery" },
        {
            value: "Gym or Club Membership",
            viewValue: "Gym or Club Membership",
        },
        { value: "House Insurance", viewValue: "House Insurance" },
        {
            value: "Meal & Restaurant Bill",
            viewValue: "Meal & Restaurant Bill",
        },
        { value: "Miscellaneous", viewValue: "Miscellaneous" },
        { value: "Miscellaneous Damage", viewValue: "Miscellaneous Damage" },
        {
            value: "NetFlix , Amazon Prime ,Sportify,4G",
            viewValue: "NetFlix , Amazon Prime ,Sportify,4G",
        },
        { value: "Order Refund", viewValue: "Order Refund" },
        { value: "Property Damage", viewValue: "Property Damage" },
        { value: "Property Rent/Mortgage", viewValue: "Rent/Mortgage" },
        { value: "Property Tax", viewValue: "Property Tax" },
        { value: "Salary/Wages", viewValue: "Salary/Wages" },
        {
            value: "Tea or Coffee or Soft Beverages or Alcohol",
            viewValue: "Tea or Coffee or Soft Beverages or Alcohol",
        },
        { value: "Utility Bill", viewValue: "Utility Bill" },
        { value: "Vehicle Maintenance", viewValue: "Vehicle Maintenance" },
        { value: "Vehicle Insurance", viewValue: "Vehicle Insurance" },
    ];

    headerIcon: string = "add";
    headerTitle: string = "Add Expense";
    isCreateExpence: boolean = false;
    formData: FormData;
    expences: Expense[] = [];
    expence: ExpenseModel;
    BookingReferanceNo: string;
    receiptFlieList: RoomImage[];
    receiptFlie: RoomImage;
    onExpenceTab: FormGroup;
    imageUrl: any;
    roomNo: FormControl = new FormControl();
    paymentMode: FormControl = new FormControl();
    BillNo: FormControl = new FormControl();
    uploadFileFC: FormControl = new FormControl();
    date: FormControl = new FormControl();
    bookingId: FormControl = new FormControl();
    name: FormControl = new FormControl(new Date());
    description: FormControl = new FormControl();
    receiptNumber: FormControl = new FormControl();
    Amount: FormControl = new FormControl();
    externalReference: FormControl = new FormControl();
    isProgressing: boolean;

    propertyExpenseList: PropertyExpenseList[] = [];
    bankAccount: BankAccount;
    mobileWallet: MobileWallet;
    checkUserType: CheckUserType;
    role: any[];
    isPropAdmin: boolean;
    isWalletAvailable: boolean;
    isBankAvailable: boolean;
    businessPlan: string;
    user: ApplicationUser;
    loader: boolean = false;
    booking: Booking;

    roomDetails: RoomDetails[] = [];
    roomDetail: RoomDetails;
    payment: Payment;

    constructor(
        private expenseService: ExpenseService,
        private dateService: DateService,
        public token: TokenStorage,
        private paymentService: PaymentService,
        public bookingService: BookingService,
        private authService: AuthService,
        private changeDetectorRefs: ChangeDetectorRef,
        private fileService: FileService,
        public loadingCtrl: LoadingController,
        private toastController: ToastController,
        private formBuilder: FormBuilder
    ) {
        this.expence = new ExpenseModel();
        this.booking = new Booking();
        this.bankAccount = new BankAccount();
        this.mobileWallet = new MobileWallet();
        this.checkUserType = new CheckUserType();
        this.user = new ApplicationUser();
        this.payment = new Payment();

        this.bankAccount = this.token.getProperty().bankAccount;
        this.mobileWallet = this.token.getProperty().mobileWallet;

        this.onExpenceTab = this.formBuilder.group({
            roomNo: ["", Validators.compose([Validators.nullValidator])],
            paymentMode: ["", Validators.compose([Validators.required])],
            BillNo: ["", Validators.compose([Validators.nullValidator])],
            date: ["", Validators.compose([Validators.required])],
            bookingId: ["", Validators.compose([Validators.nullValidator])],
            name: ["", Validators.compose([Validators.required])],
            description: ["", Validators.compose([Validators.nullValidator])],
            receiptNumber: ["", Validators.compose([Validators.nullValidator])],
            uploadFileFC: ["", Validators.compose([Validators.nullValidator])],
            externalReference: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            Amount: ["", Validators.compose([Validators.required])],
        });
    }

    ngOnInit() {
        this.role = [];
        JSON.parse(this.token.getRole()).forEach((item) => {
            this.role.push(item);
        });

        if (this.checkUserType.isPropAdmin(this.role[0]) == true) {
            this.isPropAdmin = true;
        } else {
            this.isPropAdmin = false;
        }
        this.receiptFlieList = [];
        
        if (
          this.expence.receiptList != null &&
          this.expence.receiptList != undefined &&
          this.expence.receiptList.length > 0
        ) {
          this.receiptFlieList = this.expence.receiptList;
        } else if (
          this.expence.receiptUrl != null &&
          this.expence.receiptUrl != undefined
        ) {
          this.receiptFlie = new RoomImage();
          this.receiptFlie.url = this.expence.receiptUrl;
          this.receiptFlie.name = this.expence.receiptUrl;
          this.receiptFlie.mainImage = false;
          this.receiptFlieList.push(this.receiptFlie);
        }
      
    
        if (this.mobileWallet != undefined && this.mobileWallet != null) {
            this.isWalletAvailable = true;
        } else {
            this.isWalletAvailable = false;
        }

        if (this.bankAccount != undefined && this.bankAccount != null) {
            this.isBankAvailable = true;
        } else {
            this.isBankAvailable = false;
        }

        this.businessPlan = this.token.getProperty().plan;
        this.refreshExpenses();
        this.BookingReferanceNo = String(this.token.getBookingId());
        this.expence.bookingId = Number(this.token.getBookingId());

        if (
            this.token.getBookingId() != null &&
            this.token.getBookingId() != undefined
        ) {
            this.getBookingById();
        }

        this.getPropertyExpense(this.token.getProperty().id);

        this.authService
            .getUserByUserId(this.token.getUserId())
            .subscribe((resp) => {
                this.user = resp.body;
                // console.log(' this.user'+ JSON.stringify( this.user));
            });
    }

    getBookingById() {
        this.loader = true;
        this.bookingService
            .findBooking(Number(this.token.getBookingId()))
            .subscribe(
                (response1) => {
                    this.roomDetails = [];
                    this.booking = response1.body;

                    if (
                        this.booking.roomDetails != null &&
                        this.booking.roomDetails.length > 0
                    ) {
                        this.roomDetails = this.booking.roomDetails;
                    }

                    this.loader = false;

                    this.changeDetectorRefs.detectChanges();
                },
                (error) => {
                    this.loader = false;
                    this.changeDetectorRefs.detectChanges();
                }
            );
    }

    setExpense(roomNo) {
        this.roomDetail = new RoomDetails();

        this.roomDetail = this.roomDetails.find(
            (data) => data.roomNumber === roomNo
        );

        if (this.roomDetail != undefined) {
            this.expence.roomId = this.roomDetail.roomId;
            this.changeDetectorRefs.detectChanges();
        }
    }

    onSelectExpDep(expenseItem) {
        this.expence.department = expenseItem.type;
    }

    onUnSelectExpDep() {
        this.expence.department = undefined;
    }

    getPropertyExpense(propertyId: number) {
        this.expenseService
            .findPropertyExpenseByPropertyId(propertyId)
            .subscribe(
                (data) => {
                    this.propertyExpenseList = data.body;
                    this.changeDetectorRefs.detectChanges();
                },
                (error) => {}
            );
    }

    onAmountChange(amount: number) {}

    uploadFile(event, file) {
        const file1 = event.target.files[0];
        file["value"] = file1 ? file1.name : "";
        this.expence.receiptFileName = file1.name;
        this.formData = new FormData();
        this.formData.append("file", file1, this.expence.receiptFileName);
        Logger.log("File Data" + JSON.stringify(this.formData));
        this.fileService
            .fileUploadToCloud(this.formData)
            .subscribe((fileUploadResponse) => {
                this.expence.receiptUrl = null;
                this.expence.receiptFileName = null;
      
                this.receiptFlie = new RoomImage();
                this.receiptFlie.url = fileUploadResponse.url;
                this.receiptFlie.name = fileUploadResponse.name;
                this.receiptFlie.mainImage = false;
                this.receiptFlieList.push(this.receiptFlie);
      
                this.loader = false;
                this.changeDetectorRefs.detectChanges();
                this.presentToast("File Uploaded Successfully");
            });
    }

    async presentToast(Message: string) {
        const toast = await this.toastController.create({
            message: Message,
            duration: 2000,
        });
        toast.present();
    }

    refreshExpenses() {
        this.isProgressing = true;
        this.expenseService
            .findAllExpensesByBookingId((this.token.getBookingId()))
            .subscribe((res) => {
                this.expences = res;
                this.isProgressing = false;
                Logger.log("ExPence :" + JSON.stringify(this.expences));
            });
    }

    fileChange(event): void {
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            const file = fileList[0];
            this.formData = new FormData();
            this.expence.receiptFileName = file.name;
            this.formData.append("file", file, file.name);
            Logger.log(this.formData);
        }
    }

    toggleLayout() {
        this.expence.bookingId = Number(this.token.getBookingId());
        if (this.isCreateExpence == false) {
            this.headerIcon = "list";
            this.headerTitle = "Expense List";
            this.isCreateExpence = true;
        } else {
            this.headerIcon = "add";
            this.headerTitle = "Add Expense";
            this.isCreateExpence = false;
        }
    }

    reset() {
        this.onExpenceTab.controls["date"].reset();
        this.onExpenceTab.controls["name"].reset();
        this.onExpenceTab.controls["description"].reset();
        this.onExpenceTab.controls["receiptNumber"].reset();
        this.onExpenceTab.controls["Amount"].reset();
        this.onExpenceTab.controls["externalReference"].reset();
        //this.onExpenceTab.reset();
        this.expence = new ExpenseModel();
        this.payment = new Payment();
        //this.BookingReferanceNo = this.token.getBookingId();
    }

    async FormSubMit() {
        const loader = await this.loadingCtrl.create({
            duration: 5000,
        });

        loader.present();

        this.expence.bookingId = Number(this.token.getBookingId());
        this.expence.propertyId = this.token.getProperty().id;
        this.expence.date = this.getUTCDateToDate(this.expence.date);
        this.expence.submittedBy = this.user.username;
        this.expence.email = this.user.username;
        this.expence.status = "SUBMITTED";
        this.expence.businessEmail = this.token.getProperty().email;
        this.expence.receiptList = this.receiptFlieList;
        this.expence.date = this.dateService.convertMillisecondsToYYYMMDDFormat(
            this.expence.date
        );
        this.expence.submittedBy = this.user.username;

        this.payment.businessServiceName = this.expence.name;
        this.payment.referenceNumber = this.booking.propertyReservationNumber;
        this.payment.name = this.token.getProperty().name;
        this.payment.businessEmail = this.token.getProperty().email;
        this.payment.email = this.booking.email;
        if (
            this.token.getProperty().localCurrency != null &&
            this.token.getProperty().localCurrency != undefined
        ) {
            this.payment.currency = this.token
                .getProperty()
                .localCurrency.toLocaleLowerCase();
        }
        this.payment.description = this.expence.name + " expense payment";
        this.payment.status = "NotPaid";
        this.payment.paymentMode = this.expence.paymentMode;
        this.payment.date = this.expence.date;
        this.payment.propertyId = this.token.getProperty().id;
        this.payment.roomNumber = this.expence.roomNumber;

        this.payment.netReceivableAmount = this.expence.amount;
        this.payment.transactionAmount = this.expence.amount;
        this.payment.taxAmount = 0;
        this.payment.amount = this.expence.amount;
        this.payment.transactionChargeAmount = this.expence.amount;

        if (this.payment.id != null && this.payment.id != undefined) {
            this.payment.lastModifiedDate =
                this.dateService.convertMillisecondsToYYYMMDDFormat(
                    new Date().getTime()
                );
            this.payment.lastModifiedBy = this.token.getUserName();
        } else {
            this.payment.createdDate =
                this.dateService.convertMillisecondsToYYYMMDDFormat(
                    new Date().getTime()
                );
            this.payment.createdBy = this.token.getUserName();
        }
        loader.dismiss();
        this.processPayment(this.payment);
    }

    async processPayment(payment: Payment) {
        payment.date = this.dateService.convertMillisecondsToYYYMMDDFormat(
            payment.date
        );

        const loader = await this.loadingCtrl.create({
            duration: 5000,
        });

        loader.present();
        this.paymentService.processPayment(payment).subscribe((data) => {
            this.payment = data.body;
            loader.dismiss();
            this.payment.date =
                this.dateService.convertMillisecondsToYYYMMDDFormat(
                    payment.date
                );

            this.paymentService.savePayment(this.payment).subscribe((res) => {
                if (res.status === 200) {
                    this.presentToast(`Expence payment created.For total booking payment, please use the balance calculator in payment details page before proceeding.`);
                    this.expence.paymentId = this.payment.id;
                    this.createExpense();
                } else {
                    this.presentToast(`Error in updating expence payment details`);
                }
            });
        });
    }
    deleteFile(index: number) {
        this.receiptFlieList.splice(index, 1);
      }
    

    isImage(url) {
        if (url != null && url != undefined) {
          return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
        } else {
          return false;
        }
      }
    async createExpense() {
        const loader = await this.loadingCtrl.create({
            duration: 5000,
        });

        loader.present();

        this.expenseService.saveExpense(this.expence).subscribe(
            (response) => {
                loader.dismiss();
                Logger.log(response);
                if (
                    response.id !== undefined &&
                    response.id != null &&
                    response.id !== 0
                ) {
                    this.payment.expenseId = response.id;
                    this.paymentService
                        .savePayment(this.payment)
                        .subscribe((res) => {
                            if (res.status === 200) {
                                this.presentToast(
                                    "Expense created,ID#" + response.id
                                );
                                this.reset();
                                this.refreshExpenses();
                                this.toggleLayout();
                            } else {
                                this.presentToast(
                                    `Error in updating payment details`
                                );
                            }
                        });
                }
            },
            (error) => {
                loader.dismiss();
                this.presentToast(`Error Code ${error.message}`);
            }
        );
    }

    getUTCDateToDate(dateString: string) {
        var yearAndMonth = dateString.split("-", 3);
        Logger.log(yearAndMonth + " --" + yearAndMonth[2].split("T", 1));

        return (
            yearAndMonth[0] +
            "-" +
            yearAndMonth[1] +
            "-" +
            yearAndMonth[2].split("T", 1)
        );
    }
}
