import { Logger } from "../../service/logger.service";
import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { NavController } from "@ionic/angular";
import { TokenStorage } from "./../../token.storage";
import { CustomerService } from "../../service/Customer/customer.service";
import { ToastController } from "@ionic/angular";
import { TranslateProvider } from "../../providers";
import { Customer } from "../../model/Customer/customer";
import { ActionSheetController } from "@ionic/angular";
import { ActivatedRoute, NavigationExtras } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Property } from "src/app/model/property/Property";
import { PhoneNumberEXP } from "src/app/app.component";
import { CountryCode } from "src/app/model/countryCode";

@Component({
    selector: "app-manage-customer",
    templateUrl: "./manage-customer.page.html",
    styleUrls: ["./manage-customer.page.scss"],
})
export class ManageCustomerPage implements OnInit {
    loader = false;
    customers: Customer[];
    customersSearchOb: Customer[];
    p: number = 1;

    selecion: string = "fn";

    customerSearchSelection: string = "find";
    property: Property;
    onEmailCheckForm: FormGroup;
    onPhoneCheckForm: FormGroup;

    countryCode: CountryCode;

    customer: Customer;
    CodeNumber: string;
    CustomerMobileNumber: string;
    isCustomercheck: boolean = false;
    isShowNameList: boolean = false;
    searchResult: string;
    fromHomeTab: any;

    constructor(
        private navCtrl: NavController,
        private customerService: CustomerService,
        private token: TokenStorage,
        private acRoute : ActivatedRoute,
        private formBuilder: FormBuilder,
        private actionSheetController: ActionSheetController,
        private changeDetectorRefs: ChangeDetectorRef,
        private toastController: ToastController,
        private translate: TranslateProvider
    ) {
        this.acRoute.queryParams.subscribe(params => {
     
          
            if(params["managecustomer"] != undefined)
                {
                   this.fromHomeTab = params["managecustomer"];
                //    console.log("booking tab" +   this.fromBookingTab)
                }
    
          
           
        });
        this.property = new Property();
        this.customer = new Customer();
        this.property = this.token.getProperty();
        this.countryCode = new CountryCode();

        this.onPhoneCheckForm = this.formBuilder.group({
            countryCodeC: ["", Validators.compose([Validators.required])],
            CodeNumberControll: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            PhoneC: [
                "",
                Validators.compose([
                    Validators.required,
                    Validators.pattern(PhoneNumberEXP),
                ]),
            ],
        });

        this.onEmailCheckForm = this.formBuilder.group({
            EmailCheck: ["", Validators.compose([Validators.email])],
        });
    }

    ngOnInit() {
        this.customerChanged();
        this.checkDefaultCountryCode();
    }

    navigateToPage() {
        if(this.fromHomeTab !=null && this.fromHomeTab != undefined){
            this.navCtrl.navigateForward('/home');
        }else{
            this.navCtrl.navigateForward('/service-dashboard');
        }
       
      }

    applyFilterName(ev: any) {
        let filterValue = ev.target.value;

        //console.log("search -- " + filterValue);
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches

        if (filterValue === "") {
            // this.businessServicesFilter = this.businessServices;
            // this.isShowServiceList = false;
            this.isShowNameList = false;
            this.customers = [];
            this.changeDetectorRefs.detectChanges();
        } else if (
            filterValue != null &&
            filterValue != undefined &&
            filterValue.length > 2
        ) {
            let namefilter = filterValue;
            let nameLine = namefilter.split(" ");
            if (nameLine.length === 1) {
                if (this.selecion === "fn") {
                    this.searchCustomerByFirstName(filterValue);
                } else if (this.selecion === "ln") {
                    this.searchCustomerByLastName(filterValue);
                }
            } else {
            }
        } else {
            this.changeDetectorRefs.detectChanges();
        }
    }

    searchCustomerByFirstName(firstName: string) {
        this.customerService
            .getCustomerDetailsByFirstNameAndPropertyId(
                firstName,
                this.token.getProperty().id
            )
            .subscribe(
                (data) => {
                    this.customers = [];
                    this.isShowNameList = true;
                    this.customers = data.body;

                    this.loader = false;

                    this.changeDetectorRefs.detectChanges();
                },
                (_error) => {
                    if (_error.status === 404) {
                    }
                    this.customers = [];
                    this.isShowNameList = false;
                    this.loader = false;
                    this.changeDetectorRefs.detectChanges();
                }
            );
    }

    searchCustomerByLastName(lastName: string) {
        this.customerService
            .getCustomerDetailsByLastNameAndPropertyId(
                lastName,
                this.token.getProperty().id
            )
            .subscribe(
                (data) => {
                    this.customers = [];
                    this.isShowNameList = true;
                    this.customers = data.body;

                    this.loader = false;
                    this.changeDetectorRefs.detectChanges();
                },
                (_error) => {
                    if (_error.status === 404) {
                    }
                    this.customers = [];
                    this.isShowNameList = false;
                    this.loader = false;
                    this.changeDetectorRefs.detectChanges();
                }
            );
    }

    countryCodePicker(event) {
        if (this.CodeNumber != undefined) {
            Logger.log(this.CodeNumber);
            this.customer.mobile = undefined;
        }
    }

    checkUser() {
        this.customerLookup();
    }

    customerLookup() {
        this.loader = true;
        this.isCustomercheck = false;

        if (this.selecion === "Email") {
            this.customerService
                .getCustomerDetailsByEmail(this.customer.email)
                .subscribe(
                    (data) => {
                        this.onEmailCheckForm.reset();
                        this.onPhoneCheckForm.reset();
                        this.checkDefaultCountryCode();

                        this.customers = [];
                        this.customersSearchOb = [];
                        this.customer = data.body;

                        this.customers.push(this.customer);
                        this.customersSearchOb = this.customers;

                        if (
                            this.customer.mobile != null &&
                            this.customer.mobile != undefined
                        ) {
                            this.setMobileNumberByCode(this.customer.mobile);
                        }

                        this.isCustomercheck = true;
                        this.loader = false;
                    },
                    (_error) => {
                        if (_error.status === 404) {
                            Logger.log("_error 404");
                        }
                        this.isCustomercheck = true;
                        this.loader = false;
                    }
                );
        } else if (this.selecion === "Phone") {
            this.customer.mobile = this.CodeNumber + this.CustomerMobileNumber;
            this.customerService
                .getCustomerDetailsByMobile(this.customer.mobile)
                .subscribe(
                    (data) => {
                        this.onEmailCheckForm.reset();
                        this.onPhoneCheckForm.reset();
                        this.checkDefaultCountryCode();

                        this.customers = [];
                        this.customersSearchOb = [];
                        this.customer = data.body;

                        this.customers.push(this.customer);
                        this.customersSearchOb = this.customers;

                        if (
                            this.customer.mobile != null &&
                            this.customer.mobile != undefined
                        ) {
                            this.setMobileNumberByCode(this.customer.mobile);
                        }

                        this.isCustomercheck = true;
                        this.loader = false;
                    },
                    (_error) => {
                        if (_error.status === 404) {
                            Logger.log("_error 404");
                        }
                        this.isCustomercheck = true;
                        this.loader = false;
                    }
                );
        }
    }

    setMobileNumberByCode(phoneNumber) {
        let countryOb = this.countryCode.countries.find(
            (data) => data.code === phoneNumber.substring(0, data.code.length)
        );

        if (countryOb != undefined) {
            this.CodeNumber = countryOb.code;
            this.CustomerMobileNumber = phoneNumber.substring(
                this.CodeNumber.length
            );
            this.changeDetectorRefs.detectChanges();
        }
    }

    clear(e) {}

    ionViewWillEnter() {
        this.customerChanged();
    }

    selection(event) {
        this.customers = [];
        this.customersSearchOb = [];
        this.onEmailCheckForm.reset();
        this.onPhoneCheckForm.reset();
        this.checkDefaultCountryCode();
        this.isShowNameList = false;
        this.searchResult = "";
    }

    checkDefaultCountryCode() {
        if (
            this.property.address != undefined &&
            this.property.address != null &&
            this.property.address.country != null &&
            this.property.address.country != undefined
        ) {
            let code = this.countryCode.countries.find(
                (data) =>
                    data.name.toLowerCase() ===
                    this.property.address.country.toLowerCase()
            ).code;

            if (code != undefined) {
                this.CodeNumber = code;
            }
        }
    }

    customerChanged() {
        // if (this.customerSearchSelection === "find") {
        //     this.customers = [];
        //     this.customersSearchOb = [];
        //     //this.findPayment();
        // } else if (this.customerSearchSelection === "all") {
        //     this.getCustomer();
        // }
        // if (this.selecion === "fn" || this.selecion === "ln") {
        // } else if (this.selecion === "Phone" || this.selecion === "Email") {
        //     this.customerLookup();
        // }
    }

    getCustomer() {
        this.customers = [];
        this.customersSearchOb = [];
        this.loader = true;
        this.customerService
            .getAllCustomerByPropertyId(+this.token.getPropertyId())
            .subscribe(
                (data) => {
                    this.customers = data.body;
                    this.customersSearchOb = data.body;
                    this.loader = false;
                    this.changeDetectorRefs.detectChanges();
                },
                (error) => {
                    this.loader = false;
                }
            );
    }

    createCustomer() {
        //  this.navCtrl.navigateForward('add-customer-details');

        const navigationExtras: NavigationExtras = {
            queryParams: {
                isDetails: false,
            },
        };

        this.navCtrl.navigateForward(
            ["add-customer-details"],
            navigationExtras
        );
    }

    clearSearch(event: any) {}
    getItems(ev: any) {
        const val = ev.target.value;

        Logger.log("search -- " + val);

        if (val === "") {
            this.getCustomer();
        } else {
            this.customers = this.customersSearchOb;

            this.customers = this.customers.filter((item) => {
                const searchResult =
                    (item.firstName != null &&
                        item.firstName
                            .toLowerCase()
                            .trim()
                            .indexOf(val.trim().toLowerCase().trim()) > -1) ||
                    (item.lastName != null &&
                        item.lastName
                            .toLowerCase()
                            .trim()
                            .indexOf(val.trim().toLowerCase().trim()) > -1) ||
                    (item.email != null &&
                        item.email
                            .toLowerCase()
                            .trim()
                            .indexOf(val.trim().toLowerCase().trim()) > -1) ||
                    (item.mobile != null &&
                        item.mobile
                            .toLowerCase()
                            .trim()
                            .indexOf(val.trim().toLowerCase().trim()) > -1);

                return searchResult;
            });
        }
    }

    async onMenu(customer) {
        const actionSheet = await this.actionSheetController.create({
            header: "Menu",
            cssClass: "action-sheets-basic-page",
            mode: "md",
            buttons: [
                // {
                //     text: 'Close',
                //     role: 'cancel',
                //     icon :'close',
                //     handler: () => {

                //         actionSheet.dismiss();
                //     }
                // },
                {
                    text: "Details",
                    icon: "create",
                    handler: () => {
                        const navigationExtras: NavigationExtras = {
                            queryParams: {
                                customerOb: JSON.stringify(customer),
                                isDetails: true,
                            },
                        };

                        this.navCtrl.navigateForward(
                            ["customer-details"],
                            navigationExtras
                        );
                    },
                },
            ],
        });
        await actionSheet.present();
    }

    onCustomerDetails(customer) {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                customerOb: JSON.stringify(customer),
                isDetails: true,
            },
        };

        this.navCtrl.navigateForward(["customer-details"], navigationExtras);
    }
}
