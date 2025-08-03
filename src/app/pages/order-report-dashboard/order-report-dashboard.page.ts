import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { IonModal, NavController } from "@ionic/angular";
import { Property } from "src/app/model/property/Property";
import { TokenStorage } from "src/app/token.storage";
import { OutOfStock_Status } from "../order/status";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { CheckUserType } from "src/app/model/checkUserType";
import { Order } from "src/app/model/Order/order";
import { BusinessService } from "src/app/model/Reservation/businessServic";
import { PointOfSale } from "src/app/model/Pos/pointOfSale";
import { ReportService } from "src/app/service/report/report-service.service";
import { DateService } from "src/app/service/DateService/date-service.service";
import { PropertyService } from "src/app/service/property/property.service";
import { ReservationService } from "src/app/service/ReservationService/reservation-service.service";
import { DatePipe } from "@angular/common";

import { HttpResponse } from "@angular/common/http";
import { GroupServiceService } from "src/app/service/user-group/group-service.service";

export interface OrderItemInReport {
  
    bookOneOrderId: string;
    orderedDate: string;
    name: string;
    email: string;
    phone: string;
    orderStatus: string;
    productName: string;
    productCode: string;
    sellUnitPrice: number;
    unitsInOrder: number;
    discountedPrice: number;
    notes: string;
    status: string;
    resourceName: string;
}

@Component({
    selector: "app-order-report-dashboard",
    templateUrl: "./order-report-dashboard.page.html",
    styleUrls: ["./order-report-dashboard.page.scss"],
})
export class OrderReportDashboardPage implements OnInit {
  @ViewChild("fromModal", { static: false }) fromModal: IonModal;
  @ViewChild("toModal", { static: false }) toModal: IonModal;

    property: Property;
    propertyId: number;
    currency: string;
    selectedCol: string = "";
    loader: boolean = false;
    productLineDtos: any[] = [];
    productLineFilterDtos: any[] = [];
    productNameList: any[] = [];
    productGroupNameList: any[] = [];
    reportFromDate: FormControl = new FormControl();
    reportToDate: FormControl = new FormControl();
    propertyControll: FormControl = new FormControl();
    reportfromDateString: string;
    reportToDateString: string;
    isOrgAdmin: boolean;
    role: any[];
    checkUserType: CheckUserType;
    properties: Property[] = [];
    OutOfStock_Status: string = OutOfStock_Status;
    toDateMinMilliSeconds: number;
    toDateMaxMilliSeconds: number;

    minToDate: Date;
    maxToDate: Date;
    value: Date;

    orders: Order[] = [];
    ordersFilter: Order[] = [];
    complimentaryOrdersAferFilter: Order[] = [];

    deliveryMethod: any[] = [];
    source: any[] = [];
    OrderStatus: any[] = [];
    reportType: string = "Order Report";
    productName: any[] = [];
    resource: any[] = [];
    productGroupName: any[] = [];

    resourceName: any[] = [];
    serviceId: any = 0;
    operatorName: string;
    filterOrderDateString: string;
    Controller1: FormControl = new FormControl();
    OrderStatusFilterControll: FormControl = new FormControl();
    ProductGroupNameFilterControll: FormControl = new FormControl();

    ProductNameFilterControll: FormControl = new FormControl();
    ResourceFilterControll: FormControl = new FormControl();
    BusinessServicesFilterControll: FormControl = new FormControl();
    DeliveryMethodFilterControll: FormControl = new FormControl();
    SourceFilterControll: FormControl = new FormControl();
    OPFilterControll: FormControl = new FormControl();
    onFilterForm: FormGroup;
    businessServices: BusinessService[];

    pointOfSaleList: PointOfSale[];
    pointOfSale: PointOfSale;

    operatorNameList: string[];
    complimentaryMethodType: boolean = false;
    fileName = "order-report.xlsx";
    currentDay: string;
    currentMonth: string;

    toMinDate: string;
    toMaxDate: string;
    isRowVisible: boolean = false;
    isAllDataActive: boolean = true;
    isTotalActive: boolean = false;
    serviceSelected = false;
    p: number = 1;
    openedCardIndex: number | null = null;
    isFromModalOpen = false;
    isToModalOpen = false;
    constructor(
        private navCtrl: NavController,
        private formBuilder: FormBuilder,
        public token: TokenStorage,
        private reportService: ReportService,
        public dateService: DateService,
        private propertyService: PropertyService,
        private reservationService: ReservationService,
        private groupService: GroupServiceService,
        public datepipe: DatePipe,
        private changeDetectorRefs: ChangeDetectorRef
    ) {
        this.checkUserType = new CheckUserType();
        this.property = new Property();
        this.pointOfSale = new PointOfSale();
        this.onFilterForm = this.formBuilder.group({
            OrderStatusFilterControll: this.OrderStatusFilterControll,
            ProductNameFilterControll: this.ProductNameFilterControll,
            ResourceFilterControll: this.ResourceFilterControll,
            BusinessServicesFilterControll: this.BusinessServicesFilterControll,
            OPFilterControll: this.OPFilterControll,
            DeliveryMethodFilterControll: this.DeliveryMethodFilterControll,
            ProductGroupNameFilterControll: this.ProductGroupNameFilterControll,
            SourceFilterControll: this.SourceFilterControll,
        });
    }

    ngOnInit() {
        this.property = this.token.getProperty();
        this.propertyId = this.token.getProperty().id;
        this.role = [];
        JSON.parse(this.token.getRole()).forEach((item) => {
            this.role.push(item);
        });
        if (this.checkUserType.isAnyOrgAdmin(this.role[0]) == true) {
            this.isOrgAdmin = true;
            this.getAllOrganizationPropertyByOrgId(
                this.token.getOrganizationId()
            );
        } else {
            this.isOrgAdmin = false;
            this.property = this.token.getProperty();
            if (
                this.token.getProperty().localCurrency != null &&
                this.token.getProperty().localCurrency != undefined
            ) {
                this.currency = this.token
                    .getProperty()
                    .localCurrency.toUpperCase();
                //this.getAllBusinessService(this.token.getProperty().id);
                this.getAllBusinessService(this.property.id);
            }
        }
        const today = new Date();


    }


  setFromModalOpen(isOpen: boolean) {
    this.isFromModalOpen = isOpen;
  }
    setToModalOpen(isOpen: boolean) {
    this.isToModalOpen = isOpen;
  }
    dismissFromModal() {
    this.isFromModalOpen = false;
    }
    dismissToModal() {
    this.isToModalOpen = false;
    }

    ionViewWillEnter() {
        this.serviceId = null;
        this.selectedCol = "";
        this.onSearchReset();
        this.reset();
        this.onResetDate();
    }
    toggleCardBody(index: number): void {
        // Toggle the card body visibility
        this.openedCardIndex = this.openedCardIndex === index ? null : index;
    }

    setActiveButton(button: string): void {
        if (button === "allData") {
            this.isAllDataActive = true;
            this.isTotalActive = false;
        } else if (button === "total") {
            this.isAllDataActive = false;
            this.isTotalActive = true;
        }
    }

    menuAction() {
        this.navCtrl.navigateForward(["/order-reports"]);
    }
    selectCol(col: string) {
        this.selectedCol = this.selectedCol === col ? "" : col;
    }
    clear(event) {}

    selectReportType(type: string) {
        this.reportType = type;
        this.ReportfilterByDropdown();
        this.p = 1;
    }

    getPOSInformation(propertyId: number) {
        let counterName =
            this.token.getProperty().name + "-" + this.token.getProperty().id;
        this.propertyService.getAllPointOfSale(propertyId).subscribe(
            (dataOb) => {
                this.pointOfSaleList = dataOb;
                if (
                    this.pointOfSaleList != null &&
                    this.pointOfSaleList != undefined &&
                    this.pointOfSaleList.length > 0
                ) {
                    this.pointOfSale = this.pointOfSaleList.find(
                        (data) => data.counterName === counterName
                    );

                    if (
                        this.pointOfSale != null &&
                        this.pointOfSale != undefined
                    ) {
                        this.operatorNameList = this.pointOfSale.operatorName;
                    }
                }
            },
            (error) => {}
        );
    }

    checkStatus(product) {
        if (
            product.productStatus === null ||
            product.productStatus === undefined ||
            product.productStatus === ""
        ) {
            return (product.productStatus = "Available");
        }

        return product.productStatus;
    }

    getAllBusinessService(propertyId: number) {
        this.loader = true;
        this.businessServices = [];
        this.reservationService
            .getAllBusinessServiceByPropertyId(String(propertyId))
            .subscribe(
                (data) => {
                    this.businessServices = data.body;
                    this.loader = false;
                    this.changeDetectorRefs.detectChanges();
                    // Logger.log(JSON.stringify( this.businessServices));
                },
                (error) => {
                    this.loader = false;
                }
            );
    }

    getAllOrganizationPropertyByOrgId(orgId: string) {
        this.loader = true;
        this.properties = [];
        this.groupService
            .getPropertyByOrganizationIdAndBusinesType(orgId, "Accommodation")
            .subscribe(
                (data) => {
                    this.properties = data;
                    this.loader = false;
                    this.changeDetectorRefs.detectChanges();
                    // Logger.log("org property "+JSON.stringify(data));
                },
                (error) => {
                    this.loader = false;
                }
            );
    }

    fromDateChange() {
      const fromDateValue = this.reportFromDate.value;

      if (fromDateValue) {
        const toDate = new Date(fromDateValue);

        this.toMinDate = this.datepipe.transform(toDate, 'yyyy-MM-dd');

        toDate.setMonth(toDate.getMonth() + 1);
        this.toMaxDate = this.datepipe.transform(toDate, 'yyyy-MM-dd');

        const toDateValue = this.reportToDate.value;
        if (toDateValue && (toDateValue < this.toMinDate || toDateValue > this.toMaxDate)) {
          this.reportToDate.reset();
        }
      }
          setTimeout(() => {
            this.fromModal?.dismiss();
        }, 100);
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

    // setToDate(type: string, event: any) {
    //   const fromDateMilliSeconds = event.value.getTime();
    //   this.toDateMinMilliSeconds = fromDateMilliSeconds; // + 86400000;
    //   this.toDateMaxMilliSeconds = fromDateMilliSeconds + 86400000 * 30;
    //   this.minToDate = new Date(this.toDateMinMilliSeconds);
    //   this.maxToDate = new Date(this.toDateMaxMilliSeconds);
    // }

    setProperty(propertyId: number) {
        this.property = this.properties.find(
            (property) => property.id === propertyId
        );
        this.currency = this.property.localCurrency.toUpperCase();
        //this.getAllBusinessService(propertyId);

        this.getAllBusinessService(this.property.id);
    }

    reset() {
        this.onFilterForm.reset();
        this.p = 1;

        this.OrderStatus = [];
        // this.PaymentStatus = 'All';
        // this.ModeOfPayment = 'All';
        // this.counterNumber = 'All';
        // this.operatorName = 'All';
    }
    onResetDate() {
        this.reportFromDate.reset();
        this.reportFromDate.reset();
        this.reportToDate.reset();
        this.reportToDate.reset();
        this.isRowVisible = false;

        this.orders = [];
        this.resource = [];
        this.ordersFilter = [];
        this.onSearchReset();
    }
    onSearchReset() {
        this.serviceId = undefined;
        this.operatorName = undefined;
        this.deliveryMethod = [];
        this.OrderStatus = [];
        this.productName = [];
        this.resourceName = [];
        // this.CheckedInDate = undefined;
        // this.CheckedOutDate = undefined;
        this.complimentaryMethodType = false;
        this.filterByDropdown();
    }
    anyDateSelected() {
        if (
            this.reportFromDate.value != null &&
            this.reportFromDate.value != undefined
        ) {
            return true;
        } else if (
            this.reportToDate.value != null &&
            this.reportToDate.value != undefined
        ) {
            return true;
        } else {
            return false;
        }
    }

    onSearchDate() {
        this.reset();
        this.serviceId = "0";
        this.isRowVisible = false;
        // this.reportToDateString = this.datepipe.transform(
        //     this.reportToDate.value,
        //     "yyyy-MM-dd"
        // );
        // this.reportfromDateString = this.datepipe.transform(
        //     this.reportFromDate.value,
        //     "yyyy-MM-dd"
        // );

        // if (this.reportToDateString == null) {
        //     this.reportToDateString = this.reportfromDateString;
        // }
        const fromDateValue = this.datepipe.transform(this.reportFromDate.value, "yyyy-MM-dd"); 
        const toDateValue = this.datepipe.transform(this.reportToDate.value, "yyyy-MM-dd"); 
        if (this.isOrgAdmin === false) {
            this.propertyId = this.token.getProperty().id;
        }
        this.getOrderReportsByPropertyIdAndDateRange(
            String(this.propertyId),
            fromDateValue,
            toDateValue
        );
        this.getOrderedProductReportByPropertyIdAndDateRange(
            String(this.propertyId),
            fromDateValue,
            toDateValue
        );
        this.getPOSInformation(this.propertyId);

    }

    getOrderReportsByPropertyIdAndDateRange(
        propertyId: string,
        formDate: string,
        toDate: string
    ) {
        this.loader = true;
        this.orders = [];
        this.ordersFilter = [];
        this.resource = [];
        this.reportService
            .getOrderReportsByPropertyIdAndDateRange(
                propertyId,
                formDate,
                toDate
            )
            .subscribe(
                (data) => {
                    this.orders = data.body;
                    this.ordersFilter = data.body;

                    for (let i = 0; i < this.orders.length; i++) {
                        if (
                            this.orders[i].resourceName != null &&
                            this.orders[i].resourceName != undefined &&
                            this.orders[i].resourceName.length > 0
                        ) {
                            if (
                                this.resource.indexOf(
                                    this.orders[i].resourceName
                                ) === -1
                            ) {
                                this.resource.push(this.orders[i].resourceName);
                            }
                        }
                    }
                    this.loader = false;
                    this.changeDetectorRefs.detectChanges();
                },
                (error) => {
                    this.loader = false;
                }
            );
    }

    getOrderedProductReportByPropertyIdAndDateRange(
        propertyId: string,
        formDate: string,
        toDate: string
    ) {
        this.loader = true;
        this.productLineFilterDtos = [];
        this.productLineDtos = [];
        this.productNameList = [];
        this.productGroupNameList = [];
        this.reportService
            .getOrderedProductReportByPropertyIdAndDateRange(
                propertyId,
                formDate,
                toDate
            )
            .subscribe(
                (data) => {
                    this.productLineDtos = data.body;
                    this.productLineFilterDtos = data.body;

                    for (let j = 0; j < this.productLineDtos.length; j++) {
                        if (
                            this.productNameList.indexOf(
                                this.productLineDtos[j].productName
                            ) === -1
                        ) {
                            this.productNameList.push(
                                this.productLineDtos[j].productName
                            );
                        }
                        if (
                            this.productGroupNameList.indexOf(
                                this.productLineDtos[j].productGroupName
                            ) === -1
                        ) {
                            this.productGroupNameList.push(
                                this.productLineDtos[j].productGroupName
                            );
                        }
                    }

                    this.loader = false;
                    this.changeDetectorRefs.detectChanges();
                },
                (error) => {
                    this.loader = false;
                }
            );
    }

    checkProductGroupName(data) {
        return (
            this.productLineDtos.some(
                (m) =>
                    m.productGroupName != null &&
                    m.productGroupName != undefined &&
                    m.productGroupName.toLowerCase() === data.toLowerCase()
            ) === true
        );
    }
    getOrderFileName(response: HttpResponse<Blob>) {
        let filename: string;
        try {
            const contentDisposition: string = response.headers.get(
                "content-disposition"
            );
            const r = /(?:filename=")(.+)(?:;")/;
            filename = r.exec(contentDisposition)[1];
        } catch (e) {
            filename = "orderReport.xlsx";
        }
        return filename;
    }

    // downloadOrderReportInExcel() {
    //     this.reportToDateString = this.datepipe.transform(
    //         this.reportToDate.value,
    //         "yyyy-MM-dd"
    //     );
    //     this.reportfromDateString = this.datepipe.transform(
    //         this.reportFromDate.value,
    //         "yyyy-MM-dd"
    //     );

    //     if (this.reportToDateString == null) {
    //         this.reportToDateString = this.reportfromDateString;
    //     }

    //     if (this.isOrgAdmin === false) {
    //         this.propertyId = this.token.getProperty().id;
    //     }

    //     this.reportService
    //         .downloadOrderReport(
    //             String(this.propertyId),
    //             this.reportfromDateString,
    //             this.reportToDateString
    //         )
    //         .subscribe((response: HttpResponse<Blob>) => {
    //             let filename: string = this.getOrderFileName(response);
    //             let binaryData = [];
    //             binaryData.push(response.body);
    //             let downloadLink = document.createElement("a");
    //             downloadLink.href = window.URL.createObjectURL(
    //                 new Blob(binaryData, { type: "blob" })
    //             );
    //             downloadLink.setAttribute("download", filename);
    //             document.body.appendChild(downloadLink);
    //             downloadLink.click();
    //         });
    // }

    getGSTFileName(response: HttpResponse<Blob>) {
        let filename: string;
        try {
            const contentDisposition: string = response.headers.get(
                "content-disposition"
            );
            const r = /(?:filename=")(.+)(?:;")/;
            filename = r.exec(contentDisposition)[1];
        } catch (e) {
            filename = "GSTReport.xlsx";
        }
        return filename;
    }

    // downloadOrderGSTReportInExcel() {
    //     this.reportToDateString = this.datepipe.transform(
    //         this.reportToDate.value,
    //         "yyyy-MM-dd"
    //     );
    //     this.reportfromDateString = this.datepipe.transform(
    //         this.reportFromDate.value,
    //         "yyyy-MM-dd"
    //     );

    //     if (this.reportToDateString == null) {
    //         this.reportToDateString = this.reportfromDateString;
    //     }

    //     if (this.isOrgAdmin === false) {
    //         this.propertyId = this.token.getProperty().id;
    //     }

    //     this.reportService
    //         .downloadOrderGSTReport(
    //             String(this.propertyId),
    //             this.reportfromDateString,
    //             this.reportToDateString
    //         )
    //         .subscribe((response: HttpResponse<Blob>) => {
    //             let filename: string = this.getGSTFileName(response);
    //             let binaryData = [];
    //             binaryData.push(response.body);
    //             let downloadLink = document.createElement("a");
    //             downloadLink.href = window.URL.createObjectURL(
    //                 new Blob(binaryData, { type: "blob" })
    //             );
    //             downloadLink.setAttribute("download", filename);
    //             document.body.appendChild(downloadLink);
    //             downloadLink.click();
    //         });
    // }

    // downloadProductReportInExcel() {
    //     this.reportToDateString = this.datepipe.transform(
    //         this.reportToDate.value,
    //         "yyyy-MM-dd"
    //     );
    //     this.reportfromDateString = this.datepipe.transform(
    //         this.reportFromDate.value,
    //         "yyyy-MM-dd"
    //     );

    //     if (this.reportToDateString == null) {
    //         this.reportToDateString = this.reportfromDateString;
    //     }

    //     if (this.isOrgAdmin === false) {
    //         this.propertyId = this.token.getProperty().id;
    //     }

    //     this.reportService
    //         .downloadOrderedProductReport(
    //             String(this.propertyId),
    //             this.reportfromDateString,
    //             this.reportToDateString
    //         )
    //         .subscribe((response: HttpResponse<Blob>) => {
    //             let filename: string = this.getProductFileName(response);
    //             let binaryData = [];
    //             binaryData.push(response.body);
    //             let downloadLink = document.createElement("a");
    //             downloadLink.href = window.URL.createObjectURL(
    //                 new Blob(binaryData, { type: "blob" })
    //             );
    //             downloadLink.setAttribute("download", filename);
    //             document.body.appendChild(downloadLink);
    //             downloadLink.click();
    //         });
    // }

    getProductFileName(response: HttpResponse<Blob>) {
        let filename: string;
        try {
            const contentDisposition: string = response.headers.get(
                "content-disposition"
            );
            const r = /(?:filename=")(.+)(?:;")/;
            filename = r.exec(contentDisposition)[1];
        } catch (e) {
            filename = "OrderedProductReport.xlsx";
        }
        return filename;
    }

    getCustomerName(row) {
        if (row.firstName != null && row.firstName != undefined) {
            row.firstName + " " + row.lastName;
        } else if (row.firstName === null || row.firstName === undefined) {
            return row.customerName;
        }
    }

    getTotalPax() {
        let sum = 0;
        if (this.orders.length > 0) {
            for (let i = 0; i < this.orders.length; i++) {
                if (
                    this.orders[i].noOfPerson != null &&
                    this.orders[i].noOfPerson != undefined
                ) {
                    sum = sum + this.orders[i].noOfPerson;
                }
            }
        }
        return sum;
    }

    getNetAmount() {
        // return this.orders.map(t => t.netAmount).reduce((acc, value) => value != undefined && value != null && acc + value, 0);
        let sum = 0;
        if (this.orders.length > 0) {
            for (let i = 0; i < this.orders.length; i++) {
                if (
                    this.orders[i].netAmount != null &&
                    this.orders[i].netAmount != undefined
                ) {
                    sum = sum + this.orders[i].netAmount;
                }
            }
        }
        return sum;
    }

    getAdvanceAmount() {
        // return this.orders.map(t => t.netAmount).reduce((acc, value) => value != undefined && value != null && acc + value, 0);
        let sum = 0;
        if (this.orders.length > 0) {
            for (let i = 0; i < this.orders.length; i++) {
                if (
                    this.orders[i].advanceAmount != null &&
                    this.orders[i].advanceAmount != undefined
                ) {
                    sum = sum + this.orders[i].advanceAmount;
                }
            }
        }
        return sum;
    }

    getServiceChargeAmount() {
        // return this.orders.map(t => t.netAmount).reduce((acc, value) => value != undefined && value != null && acc + value, 0);
        let sum = 0;
        if (this.orders.length > 0) {
            for (let i = 0; i < this.orders.length; i++) {
                if (
                    this.orders[i].serviceChargeAmount != null &&
                    this.orders[i].serviceChargeAmount != undefined
                ) {
                    sum = sum + this.orders[i].serviceChargeAmount;
                }
            }
        }
        return sum;
    }

    getDiscountAmount() {
        // return this.orders.map(t => t.discountAmount).reduce((acc, value) => value != undefined && value != null && acc + value, 0);
        let sum = 0;
        if (this.orders.length > 0) {
            for (let i = 0; i < this.orders.length; i++) {
                if (
                    this.orders[i].discountAmount != null &&
                    this.orders[i].discountAmount != undefined
                ) {
                    sum = sum + this.orders[i].discountAmount;
                }
            }
        }
        return sum;
    }

    getTaxAmount() {
        //return this.orders.map(t => t.taxAmount).reduce((acc, value) => value != undefined && value != null && acc + value, 0);
        let sum = 0;
        if (this.orders.length > 0) {
            for (let i = 0; i < this.orders.length; i++) {
                if (
                    this.orders[i].taxAmount != null &&
                    this.orders[i].taxAmount != undefined
                ) {
                    sum = sum + this.orders[i].taxAmount;
                }
            }
        }
        return sum;
    }

    getTaxAmountByName(name) {
        let sum = 0;
        if (this.orders.length > 0) {
            for (let i = 0; i < this.orders.length; i++) {
                if (
                    this.orders[i].taxDetails != null &&
                    this.orders[i].taxDetails != undefined &&
                    this.orders[i].taxDetails.length > 0
                ) {
                    for (let j = 0; j < this.orders[i].taxDetails.length; j++) {
                        if (this.orders[i].taxDetails[j].name === name) {
                            sum = sum + this.orders[i].taxDetails[j].taxAmount;
                        }
                    }
                }
            }
        }
        return sum;
    }

    getTotalAmount() {
        //return this.orders.map(t => t.totalOrderAmount).reduce((acc, value) => value != undefined && value != null && acc + value, 0);
        let sum = 0;
        if (this.orders.length > 0) {
            for (let i = 0; i < this.orders.length; i++) {
                if (
                    this.orders[i].totalOrderAmount != null &&
                    this.orders[i].totalOrderAmount != undefined
                ) {
                    sum = sum + this.orders[i].totalOrderAmount;
                }
            }
        }
        return sum;
    }

    getTotalUnit() {
        let sum = 0;
        if (this.productLineDtos.length > 0) {
            for (let i = 0; i < this.productLineDtos.length; i++) {
                if (
                    this.productLineDtos[i].unitInOrder != null &&
                    this.productLineDtos[i].unitInOrder != undefined &&
                    this.isPriceAddedtoTotal(
                        this.productLineDtos[i].productStatus
                    ) === true
                ) {
                    sum = sum + this.productLineDtos[i].unitInOrder;
                }
            }
        }
        return sum;
    }

    getTotalDiscountedPrice() {
        let sum = 0;
        if (this.productLineDtos.length > 0) {
            for (let i = 0; i < this.productLineDtos.length; i++) {
                if (
                    this.productLineDtos[i].discountAmount != null &&
                    this.productLineDtos[i].discountAmount != undefined &&
                    this.isPriceAddedtoTotal(
                        this.productLineDtos[i].productStatus
                    ) === true
                ) {
                    sum = sum + this.productLineDtos[i].discountAmount;
                }
            }
        }
        return sum;
    }

    getTotalPrice() {
        let sum = 0;
        if (this.productLineDtos.length > 0) {
            for (let i = 0; i < this.productLineDtos.length; i++) {
                if (
                    this.productLineDtos[i].totalAmount != null &&
                    this.productLineDtos[i].totalAmount != undefined &&
                    this.isPriceAddedtoTotal(
                        this.productLineDtos[i].productStatus
                    ) === true
                ) {
                    sum = sum + this.productLineDtos[i].totalAmount;
                }
            }
        }
        return sum;
    }

    isPriceAddedtoTotal(status: string) {
        if (
            status != undefined &&
            status != null &&
            status === this.OutOfStock_Status
        ) {
            return false;
        } else {
            return true;
        }
    }

    getTotaSellPrice() {
        let sum = 0;
        if (this.productLineDtos.length > 0) {
            for (let i = 0; i < this.productLineDtos.length; i++) {
                if (
                    this.productLineDtos[i].sellUnitPrice != null &&
                    this.productLineDtos[i].sellUnitPrice != undefined &&
                    this.isPriceAddedtoTotal(
                        this.productLineDtos[i].productStatus
                    ) === true
                ) {
                    sum = sum + this.productLineDtos[i].sellUnitPrice;
                }
            }
        }
        return sum;
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches

        if (filterValue === "") {
            this.orders = this.ordersFilter;
            this.changeDetectorRefs.detectChanges();
        } else {
            this.orders = this.ordersFilter;
            this.orders = this.orders.filter((item) => {
                const searchResult =
                    (item.firstName != null &&
                        item.firstName != undefined &&
                        item.firstName.toLowerCase().indexOf(filterValue) >
                            -1) ||
                    (item.lastName != null &&
                        item.lastName != undefined &&
                        item.lastName.toLowerCase().indexOf(filterValue) >
                            -1) ||
                    (item.customerName != null &&
                        item.customerName != undefined &&
                        item.customerName.toLowerCase().indexOf(filterValue) >
                            -1) ||
                    (item.deliveryMethod != null &&
                        item.deliveryMethod != undefined &&
                        item.deliveryMethod.toLowerCase().indexOf(filterValue) >
                            -1) ||
                    (item.email != null &&
                        item.email != undefined &&
                        item.email.toLowerCase().indexOf(filterValue) > -1) ||
                    (item.orderStatus != null &&
                        item.orderStatus != undefined &&
                        item.orderStatus.toLowerCase().indexOf(filterValue) >
                            -1) ||
                    (item.bookOneOrderId != null &&
                        item.bookOneOrderId != undefined &&
                        item.bookOneOrderId.toLowerCase().indexOf(filterValue) >
                            -1) ||
                    (item.resourceName != null &&
                        item.resourceName != undefined &&
                        item.resourceName.toLowerCase().indexOf(filterValue) >
                            -1) ||
                    (item.mobile != null &&
                        item.mobile != undefined &&
                        item.mobile.toLowerCase().indexOf(filterValue) > -1) ||
                    (item.modeOfPayment != null &&
                        item.modeOfPayment != undefined &&
                        item.modeOfPayment.toLowerCase().indexOf(filterValue) >
                            -1) ||
                    (item.operatorName != null &&
                        item.operatorName != undefined &&
                        item.operatorName.toLowerCase().indexOf(filterValue) >
                            -1) ||
                    (item.counterName != null &&
                        item.counterName != undefined &&
                        item.counterName.toLowerCase().indexOf(filterValue) >
                            -1) ||
                    (item.externalSite != null &&
                        item.externalSite != undefined &&
                        item.externalSite.toLowerCase().indexOf(filterValue) >
                            -1) ||
                    (item.totalOrderAmount != null &&
                        item.totalOrderAmount != undefined &&
                        String(item.totalOrderAmount).indexOf(filterValue) >
                            -1) ||
                    (item.discountAmount != null &&
                        item.discountAmount != undefined &&
                        String(item.discountAmount).indexOf(filterValue) >
                            -1) ||
                    (item.netAmount != null &&
                        item.netAmount != undefined &&
                        String(item.netAmount).indexOf(filterValue) > -1) ||
                    (item.taxAmount != null &&
                        item.taxAmount != undefined &&
                        String(item.taxAmount).indexOf(filterValue) > -1) ||
                    (item.orderedDate != null &&
                        item.orderedDate != undefined &&
                        this.dateService
                            .convertMillisecondsToDateFormat(item.orderedDate)
                            .indexOf(filterValue) > -1);

                return searchResult;
            });
            this.changeDetectorRefs.detectChanges();
        }
    }

    ReportfilterByDropdown() {
        this.complimentaryMethodType = false;
        if (this.reportType === "Order Report") {
            this.filterByDropdown();
        } else if (this.reportType === "Product Report") {
            this.filterByDropdownProduct();
        }
        this.serviceSelected = !!this.serviceId;
    }

    checkProductName(data) {
        return (
            this.productLineDtos.some(
                (m) =>
                    m.productName != null &&
                    m.productName != undefined &&
                    m.productName.toLowerCase() === data.toLowerCase()
            ) === true
        );
    }
    checkResourceName(data) {
        return (
            this.orders.some(
                (m) =>
                    m.resourceName != null &&
                    m.resourceName != undefined &&
                    m.resourceName === data
            ) === true
        );
    }
    checkOrderStatus(data) {
        return (
            this.orders.some(
                (m) =>
                    m.orderStatus != null &&
                    m.orderStatus != undefined &&
                    m.orderStatus.toLowerCase() === data.toLowerCase()
            ) === true
        );
    }

    checkOrderDeliveryMethod(data) {
        return (
            this.orders.some(
                (m) =>
                    m.deliveryMethod != null &&
                    m.deliveryMethod != undefined &&
                    m.deliveryMethod.toLowerCase() === data.toLowerCase()
            ) === true
        );
    }

    ceckOrderSource(data) {
        return (
            this.orders.some(
                (m) =>
                    m.externalSite != null &&
                    m.externalSite != undefined &&
                    m.externalSite.toLowerCase() === data.toLowerCase()
            ) === true
        );
    }

    checkOrderBusinessService(data) {
        return (
            this.orders.some(
                (m) =>
                    m.businessServiceId != null &&
                    m.businessServiceId != undefined &&
                    m.businessServiceId === data
            ) === true
        );
    }

    filterByDropdown() {
        let searchResult;
        this.orders = this.ordersFilter;
        this.orders = this.orders.filter((item) => {
            searchResult =
                (this.OrderStatus === null ||
                    this.OrderStatus === undefined ||
                    this.OrderStatus.length === 0 ||
                    (this.OrderStatus != null &&
                        this.OrderStatus != undefined &&
                        this.OrderStatus.length > 0 &&
                        item.orderStatus != null &&
                        item.orderStatus != undefined &&
                        this.OrderStatus.some(
                            (m) =>
                                m.toLowerCase() ===
                                item.orderStatus.toLowerCase()
                        ) === true &&
                        this.OrderStatus.filter((m) =>
                            this.checkOrderStatus(m)
                        ))) &&
                (this.deliveryMethod === null ||
                    this.deliveryMethod === undefined ||
                    this.deliveryMethod.length === 0 ||
                    (this.deliveryMethod != null &&
                        this.deliveryMethod != undefined &&
                        this.deliveryMethod.length > 0 &&
                        item.deliveryMethod != null &&
                        item.deliveryMethod != undefined &&
                        this.deliveryMethod.some(
                            (m) =>
                                m.toLowerCase() ===
                                item.deliveryMethod.toLowerCase()
                        ) === true &&
                        this.deliveryMethod.filter((m) =>
                            this.checkOrderDeliveryMethod(m)
                        ))) &&
                (this.source === null ||
                    this.source === undefined ||
                    this.source.length === 0 ||
                    (this.source != null &&
                        this.source != undefined &&
                        this.source.length > 0 &&
                        item.externalSite != null &&
                        item.externalSite != undefined &&
                        this.source.some(
                            (m) =>
                                m.toLowerCase() ===
                                item.externalSite.toLowerCase()
                        ) === true &&
                        this.source.filter((m) => this.ceckOrderSource(m)))) &&
                // (this.serviceId === null || this.serviceId === undefined || this.serviceId.length === 0 ||
                //   this.serviceId != null && this.serviceId != undefined && this.serviceId.length > 0 && item.businessServiceId != null && item.businessServiceId != undefined &&
                //   this.serviceId.some(m => m === item.businessServiceId) === true &&
                //   this.serviceId.every(m =>  this.checkOrderBusinessService(m)) === true)
                (this.serviceId === "0" ||
                    this.serviceId === null ||
                    this.serviceId === undefined ||
                    (this.serviceId != null &&
                        this.serviceId != undefined &&
                        this.serviceId != "0" &&
                        item.businessServiceId != null &&
                        item.businessServiceId != undefined &&
                        this.serviceId === item.businessServiceId)) &&
                (this.operatorName === null ||
                    this.operatorName === undefined ||
                    this.operatorName === "" ||
                    (this.operatorName != null &&
                        this.operatorName != undefined &&
                        item.createdBy != null &&
                        item.createdBy != undefined &&
                        this.operatorName === item.createdBy)) &&
                (this.resourceName === null ||
                    this.resourceName === undefined ||
                    this.resourceName.length === 0 ||
                    (this.resourceName != null &&
                        this.resourceName != undefined &&
                        this.resourceName.length > 0 &&
                        item.resourceName != null &&
                        item.resourceName != undefined &&
                        this.resourceName.some(
                            (m) => m === item.resourceName
                        ) === true &&
                        this.resourceName.filter((m) =>
                            this.checkResourceName(m)
                        )));
            //  (this.filterOrderDateString === undefined || this.filterOrderDateString != undefined && item.orderedDate != null && item.orderedDate != undefined && this.dateService.convertMillisecondsToDateFormat(item.orderedDate) === ( this.dateService.convertMillisecondsToDateFormat(this.filterOrderDateString))))

            return searchResult;
        });
        this.complimentaryOrdersAferFilter = this.orders;
        this.changeDetectorRefs.detectChanges();
    }

    filterByDropdownProduct() {
        console.log("product name " + this.productGroupName);
        let searchResult;

        this.productLineDtos = this.productLineFilterDtos;
        this.productLineDtos = this.productLineDtos.filter((item) => {
            searchResult =
                (this.OrderStatus === null ||
                    this.OrderStatus === undefined ||
                    this.OrderStatus.length === 0 ||
                    (this.OrderStatus != null &&
                        this.OrderStatus != undefined &&
                        this.OrderStatus.length > 0 &&
                        item.orderStatus != null &&
                        item.orderStatus != undefined &&
                        this.OrderStatus.some(
                            (m) =>
                                m.toLowerCase() ===
                                item.orderStatus.toLowerCase()
                        ) === true &&
                        this.OrderStatus.filter((m) =>
                            this.checkOrderStatus(m)
                        ))) &&
                (this.serviceId === null ||
                    this.serviceId === undefined ||
                    (this.serviceId != null &&
                        this.serviceId != undefined &&
                        item.businessServiceId != null &&
                        item.businessServiceId != undefined &&
                        this.serviceId === item.businessServiceId)) &&
                (this.productName === null ||
                    this.productName === undefined ||
                    this.productName.length === 0 ||
                    (this.productName != null &&
                        this.productName != undefined &&
                        this.productName.length > 0 &&
                        item.productName != null &&
                        item.productName != undefined &&
                        this.productName.some(
                            (m) =>
                                m.toLowerCase() ===
                                item.productName.toLowerCase()
                        ) === true &&
                        this.productName.filter((m) =>
                            this.checkProductName(m)
                        ))) &&
                (this.productGroupName === null ||
                    this.productGroupName === undefined ||
                    this.productGroupName.length === 0 ||
                    (this.productGroupName != null &&
                        this.productGroupName != undefined &&
                        this.productGroupName.length > 0 &&
                        item.productGroupName != null &&
                        item.productGroupName != undefined &&
                        this.productGroupName.some(
                            (m) =>
                                m.toLowerCase() ===
                                item.productGroupName.toLowerCase()
                        ) === true &&
                        this.productGroupName.filter((m) =>
                            this.checkProductGroupName(m)
                        )));
            this.filterProductLinesByBusinessServiceId(this.serviceId);

            return searchResult;
        });
        this.changeDetectorRefs.detectChanges();
    }

    filterProductLinesByBusinessServiceId(businessServiceId) {
        this.productNameList = [];
        this.productGroupNameList = [];
        this.productLineDtos = this.productLineFilterDtos;
        if (businessServiceId != 0) {
            this.productLineDtos = this.productLineDtos.filter(
                (pl) => pl.businessServiceId == businessServiceId
            );
        }

        for (let j = 0; j < this.productLineDtos.length; j++) {
            if (
                this.productNameList.indexOf(
                    this.productLineDtos[j].productName
                ) === -1
            ) {
                this.productNameList.push(this.productLineDtos[j].productName);
            }

            if (
                this.productGroupNameList.indexOf(
                    this.productLineDtos[j].productGroupName
                ) === -1
            ) {
                if (
                    this.productLineDtos[j].productGroupName != null &&
                    this.productLineDtos[j].productGroupName != undefined &&
                    this.productLineDtos[j].productGroupName.trim() != ""
                ) {
                    this.productGroupNameList.push(
                        this.productLineDtos[j].productGroupName
                    );
                }
            }
        }
        this.changeDetectorRefs.detectChanges();
    }

    // exportexcel(): void {

    //   let element = document.getElementById("order-report");
    //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //   XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    //   XLSX.writeFile(wb, this.fileName);
    // }

    // productReportexcel(): void {

    //   let element = document.getElementById("product-report");
    //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //   XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    //   XLSX.writeFile(wb, this.fileName);
    // }

    filterByComplimentary(complimentaryMethodType: any) {
        this.complimentaryMethodType = complimentaryMethodType;
        let searchResult;
        if (this.complimentaryMethodType == true) {
            if (this.complimentaryOrdersAferFilter.length > 0) {
                this.orders = this.complimentaryOrdersAferFilter;
            } else {
                this.orders = this.ordersFilter;
            }

            this.orders = this.orders.filter((item) => {
                searchResult =
                    item.complimentary == this.complimentaryMethodType;
                return searchResult;
            });
            this.orders.forEach((order) => {
                order.totalOrderAmount = order.discountAmount;
            });
        } else {
            if (this.complimentaryOrdersAferFilter.length > 0) {
                this.orders = this.complimentaryOrdersAferFilter;
            } else {
                this.orders = this.ordersFilter;
            }
            this.orders.forEach((order) => {
                if (order.complimentary == true) {
                    order.totalOrderAmount = 0;
                }
            });
        }

        this.changeDetectorRefs.detectChanges();
    }
}
