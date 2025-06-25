import { PaymentService } from "./../../service/payment/payment.service";
import { BookingService } from "src/app/service/manage-booking/booking-service.service";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import {
    LoadingController,
    NavController,
    ToastController,
} from "@ionic/angular";
import { CheckUserType } from "src/app/model/checkUserType";
import { PropertyExpenseList } from "src/app/model/property/propertyExpense";
import { RoomDetails } from "src/app/model/RoomDetails/RoomDetails";
import { ApplicationUser } from "src/app/model/user";
import { MobileWallet } from "src/app/model/wallet/mobileWallet";
import { AuthService } from "src/app/service/auth.service";
import { ExpenseModel } from "../../model/Expense/ExpenseModel";
import { DateService } from "../../service/DateService/date-service.service";
import { Logger } from "../../service/logger.service";
import { BankAccount } from "../business-setting/bank-details/BankAccount";
import { ExpenseItem } from "../tab-expence/tab-expence.page";
import { ExpenseService } from "./../../service/ExpenseService/expense-service.service";
import { FileService } from "./../../service/FileService/file.service";
import { TokenStorage } from "./../../token.storage";
import { Booking } from "src/app/model/manage-booking/Booking/Booking";
import { Payment } from "src/app/model/manage-booking/Payment/Payment";
import { Property } from "src/app/model/property/Property";

@Component({
    selector: "app-manage-expence",
    templateUrl: "./manage-expence.page.html",
    styleUrls: ["./manage-expence.page.scss"],
})
export class ManageExpencePage implements OnInit {
    property: Property;
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

    expence: ExpenseModel;
    formData: FormData;
    onExpenceForm: FormGroup;
    isView: boolean = false;

    permission: string;

    submitText: string = "Submit";
    p: number = 1;

    paymentMode: FormControl = new FormControl();
    BillNo: FormControl = new FormControl();
    date: FormControl = new FormControl();
    bookingId: FormControl = new FormControl();
    name: FormControl = new FormControl(new Date());
    description: FormControl = new FormControl();
    receiptNumber: FormControl = new FormControl();
    amount: FormControl = new FormControl();
    externalReference: FormControl = new FormControl(new Date());

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

    roomDetails: RoomDetails[] = [];
    roomDetail: RoomDetails;
    loader: boolean = false;
    booking: Booking;
    payment: Payment;

    constructor(
        private expenseService: ExpenseService,
        private navCtrl: NavController,
        private token: TokenStorage,
        private authService: AuthService,
        private bookingService: BookingService,
        private dateService: DateService,
        private paymentService: PaymentService,
        private changeDetectorRefs: ChangeDetectorRef,
        private fileService: FileService,
        private route: ActivatedRoute,
        public loadingCtrl: LoadingController,
        private toastController: ToastController,
        private formBuilder: FormBuilder
    ) {
        this.property = new Property();
        this.expence = new ExpenseModel();
        this.booking = new Booking();
        this.bankAccount = new BankAccount();
        this.mobileWallet = new MobileWallet();
        this.checkUserType = new CheckUserType();
        this.user = new ApplicationUser();
        this.payment = new Payment();

        this.bankAccount = this.token.getProperty().bankAccount;
        this.mobileWallet = this.token.getProperty().mobileWallet;

        this.onExpenceForm = this.formBuilder.group({
            BillNo: ["", Validators.compose([Validators.nullValidator])],
            paymentMode: ["", Validators.compose([Validators.nullValidator])],
            date: ["", Validators.compose([Validators.required])],
            bookingId: ["", Validators.compose([Validators.nullValidator])],
            name: ["", Validators.compose([Validators.required])],
            description: ["", Validators.compose([Validators.nullValidator])],
            receiptNumber: ["", Validators.compose([Validators.nullValidator])],
            externalReference: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            amount: ["", Validators.compose([Validators.required])],
        });
    }

    ngOnInit() {
        this.property = this.token.getProperty();
        console.log("property details", this.property)
        this.route.queryParams.subscribe((params) => {
            if (params["permission"] != undefined) {
                this.permission = params["permission"];
                Logger.log("this.permission" + this.permission);
                if (this.permission === "1") {
                    this.isView = true;
                    this.submitText = "Update";
                    Logger.log("expense permission: view");
                } else if (this.permission === "2") {
                    Logger.log("expense permission: edit");
                    this.isView = false;
                    this.submitText = "Update";
                }
            }

            if (params["expenseOb"] != undefined) {
                this.expence = JSON.parse(params["expenseOb"]);

                if (
                    this.expence.paymentId != undefined &&
                    this.expence.paymentId != null &&
                    this.expence.paymentId > 0
                ) {
                    this.getPaymentById(this.expence.paymentId);
                }

                if (
                    this.expence.bookingId != null &&
                    this.expence.bookingId != undefined
                ) {
                    this.getBookingById();
                }
                this.expence.date =
                    this.dateService.convertMillisecondsToYYYMMDDFormat(
                        this.expence.date
                    );
            }
        });

        this.role = [];
        JSON.parse(this.token.getRole()).forEach((item) => {
            this.role.push(item);
        });

        if (this.checkUserType.isPropAdmin(this.role[0]) == true) {
            this.isPropAdmin = true;
        } else {
            this.isPropAdmin = false;
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

        this.getPropertyExpense(this.token.getProperty().id);
    }

    navigateToPage() {
        this.navCtrl.navigateForward('/expence-list');
      }

    getPaymentById(paymentid: number) {
        this.paymentService.findPaymentById(paymentid).subscribe((data) => {
            this.payment = data.body;

            this.changeDetectorRefs.detectChanges();
        });
    }

    getBookingById() {
        this.loader = true;
        this.bookingService.findBooking(this.expence.bookingId).subscribe(
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

    onSelectExpDep(expenseItem) {
        this.expence.department = expenseItem.type;
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

    edit() {
        this.isView = false;
    }

    reset() {
        this.onExpenceForm.reset();
        this.expence = new ExpenseModel();
    }

    onUnSelectExpDep() {
        this.expence.department = undefined;
    }

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
                if (fileUploadResponse.status === 200) {
                    this.expence.receiptUrl = fileUploadResponse.url;
                    this.expence.receiptFileName = fileUploadResponse.name;
                    this.presentToast("File Uploaded Successfully");
                } else {
                    this.presentToast("File upload Error");
                }
            });
    }

    async FormSubMit() {
        const loader = await this.loadingCtrl.create({
            duration: 5000,
        });

        loader.present();

        //this.expence.bookingId = Number(this.token.getBookingId());
        this.expence.propertyId = this.token.getProperty().id;
        this.expence.date = this.getUTCDateToDate(this.expence.date);
        this.expence.submittedBy = this.user.username;
        this.expence.email = this.user.username;
        this.expence.status = "SUBMITTED";
        this.expence.businessEmail = this.token.getProperty().email;

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
                    this.presentToast(`Service payment created`);
                    this.expence.paymentId = this.payment.id;
                    this.createOrUpdateExpense();
                } else {
                    this.presentToast(`Error in updating payment details`);
                }
            });
        });
    }

    async createOrUpdateExpense() {
        const loader = await this.loadingCtrl.create({
            duration: 5000,
        });

        loader.present();
        if (this.expence.id != undefined && this.expence.id != null) {
            this.expenseService.updateExpense(this.expence).subscribe(
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
                                    if (
                                        this.permission != undefined &&
                                        this.permission === "1"
                                    ) {
                                        this.presentToast(
                                            "Expense updated successfully"
                                        );
                                    } else {
                                        this.presentToast(
                                            "Expense created successfully"
                                        );
                                    }

                                    this.onExpenceForm.reset();
                                    this.expenceList();
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
        } else {
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
                                    if (
                                        this.permission != undefined &&
                                        this.permission === "1"
                                    ) {
                                        this.presentToast(
                                            "Expense updated successfully"
                                        );
                                    } else {
                                        this.presentToast(
                                            "Expense created successfully"
                                        );
                                    }

                                    this.onExpenceForm.reset();
                                    this.expenceList();
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
    }

    expenceList() {
        setTimeout(() => {
            this.navCtrl.navigateForward("expence-list");
        }, 2000);
    }

    cancel() {
        this.navCtrl.navigateForward("expence-list");
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

    async presentToast(Message: string) {
        const toast = await this.toastController.create({
            message: Message,
            duration: 2000,
        });
        toast.present();
    }
}
