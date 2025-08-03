import { Token } from "./../../../model/token";
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewRef } from "@angular/core";
import { ActionSheetController, MenuController, ModalController, NavController, ToastController } from "@ionic/angular";
import { KOT } from "../KOT";
import { OrderService } from "src/app/service/Order/order.service";
import { Order } from "src/app/model/Order/order";
import { Payment } from "src/app/model/manage-booking/Payment/Payment";
import { Property } from "src/app/model/property/Property";
import { Address } from "src/app/model/business-service/address";
import { DatePipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { TokenStorage } from "src/app/token.storage";
import { OrderLineDto } from "src/app/model/Order/orderLineDto";
import { PaymentService } from "src/app/service/payment/payment.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ApplicationUser } from "src/app/model/user";
import { AuthService } from "src/app/service/auth.service";
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { BookingService } from "src/app/service/manage-booking/booking-service.service";
import { PropertyService } from "src/app/service/property/property.service";
import { BusinessServiceDtoList } from "src/app/model/business-service/businessServiceDtoList";
import { Booking } from "src/app/model/manage-booking/Booking/Booking";
import { UploadImageFile } from "src/app/model/Order/UploadImageFile";
import { FileService } from "src/app/service/file.service";
import { DateService } from "src/app/service/DateService/date-service.service";
import { ProductGroup } from "src/app/model/product/productGroup";

@Component({
    selector: "app-kot-generate",
    templateUrl: "./kot-generate.page.html",
    styleUrls: ["./kot-generate.page.scss"],
})
export class KotGeneratePage implements OnInit {
    onPriorityForm: FormGroup;

    loader: boolean = false;
    segmentName: string = "2";
    kot: KOT;
    kotList: KOT[] = [];

    payments: any[] = [];
    paymentsFilter: any[] = [];

    orderId: number;
    dialogOrder: Order;

    items = [];
    item2 = [];

    isKotUpdate: boolean = true;

    property: Property;
    paymentDTO: Payment;
    propertyAddress: Address;
    currency: string;

    orderLineList: OrderLineDto[] = [];
    priority: number;
    userData: ApplicationUser;
    propertyName: Property;
    kotListReadyToPrint: KOT[] = [];
    subscriptionSelected: any[];
    isSilentPrinter: boolean;
    isKotNoteAvailable: boolean = false;
    sectionId: string;
    businessService: BusinessServiceDtoList;
    LogoURL: string;
    booking: Booking;
    order: any;
    kotGenerateTime: Date = new Date();
    productGroupsList:ProductGroup[] = [];

    constructor(
        private Token: TokenStorage,
        private bookingservice: BookingService,
        private navCtrl: NavController,
        private toastController:ToastController,
        private paymentService: PaymentService,
        public datepipe: DatePipe,
        public menuCtrl: MenuController,
        private actionSheetController: ActionSheetController,
        private changeDetectorRefs: ChangeDetectorRef,
        private orderService: OrderService,
        private formBuilder: FormBuilder,
        private acRoute: ActivatedRoute,
        private authService: AuthService,
        private bookingService: BookingService,
        private propertyService: PropertyService,
        private fileService: FileService,
        private router: Router,
        public token: TokenStorage,
        public dateService: DateService,
        private elementRef: ElementRef
    ) {
        this.userData = new ApplicationUser();
        this.dialogOrder = new Order();
        this.propertyName = this.Token.getProperty();
        this.paymentDTO = new Payment();
        this.property = new Property();
        this.propertyAddress = new Address();
        this.kot = new KOT();

        this.onPriorityForm = this.formBuilder.group({
            Priority: ["", Validators.compose([Validators.nullValidator])],
        });

    }

    ngOnInit() {

        this.property = this.Token.getProperty();
        this.getUserData();
        this.propertyDetails(this.token.getProperty().id);

        if (
            this.property != null &&
            this.property != undefined &&
            this.property.localCurrency != undefined
        ) {
            this.currency = this.property.localCurrency.toUpperCase();
        }
        if (this.router.getCurrentNavigation()?.extras.state) {
            this.dialogOrder = this.router.getCurrentNavigation()?.extras.state['order'];
        }

        if (this.acRoute.snapshot.params.id != null && this.acRoute.snapshot.params.id != undefined) {
            this.dialogOrder.id = this.acRoute.snapshot.params.id;

            setTimeout(() => {
                this.getOrderByOrderId(this.dialogOrder.id);
            }, 2000);
        }
        this.getSubscriptionForProperty(this.dialogOrder.propertyId);
        this.getAllGroupProduct(this.dialogOrder.businessServiceId);
        //      if (this.data.sectionId != null && this.data.sectionId != undefined) {
        //     this.sectionId = this.data.sectionId;
        //   }

        //   if (
        //     this.data.KOTUpdate != null &&
        //     this.data.KOTUpdate != undefined &&
        //     this.data.KOTUpdate === true
        //   ) {
        //     this.isKotUpdate = true;
        //   }


    }

    // ionViewWillEnter(){
    //     setTimeout(() => {
    //         this.getOrderByOrderId(this.dialogOrder.id);
    //       }, 2000);
    // }

    getUserData() {
        this.loader = true;
        const UserId = this.Token.getUserId();
        this.authService.getUserByUserId(UserId).subscribe(data => {
            this.userData = data.body;
            this.loader = false;
            this.changeDetectorRefs.detectChanges();

        }, error => {
            this.loader = false;
        });

    }

    OrderList() {
        this.navCtrl.navigateBack("manage-order");
    }

    orderDashboard() {
        this.navCtrl.navigateBack("order-dashboard");
    }

    getStyle(isKotNoteAvailable: boolean) {
        const style: any = {};
        if (isKotNoteAvailable == false) {
            style['font-size'] = '12px'; // Adjust font size and family as needed
        }
        return style;
    }

    propertyDetails(propertyId: number) {
        this.propertyService.getPropertyDetailsByPropertyId(propertyId).subscribe(
            (data) => {
                this.property = data;
                this.businessService = new BusinessServiceDtoList();
                this.businessService = this.property.businessServiceDtoList.find(
                    (data) => data.id === this.dialogOrder.businessServiceId
                );

                if (
                    this.businessService.logoUrl != null &&
                    this.businessService.logoUrl != undefined
                ) {
                    this.LogoURL = this.businessService.logoUrl;
                } else {
                    this.LogoURL = this.property.logoUrl;
                }

                if (
                    this.property.address != null &&
                    this.property.address != undefined
                ) {
                    this.propertyAddress = this.property.address;
                }

                if (
                    this.property != null &&
                    this.property != undefined &&
                    this.property.localCurrency != undefined
                ) {
                    this.currency = this.property.localCurrency.toUpperCase();
                }

                this.loader = false;
                this.UIDetectChange();
                //Logger.log('property data: '+ JSON.stringify(data));
            },
            (error) => {
                if (error instanceof HttpErrorResponse) {
                    this.loader = false;
                }
            }
        );
    }

    async getOrderByOrderId(orderId: number) {
        this.loader = true;
        this.orderService.getOrderByOrderId(orderId).subscribe(
            async (data) => {
                this.dialogOrder = data.body;

                if (this.dialogOrder.deliveryMethod == "Room Order") {
                    this.getBookingById(this.dialogOrder.bookingId);
                } else {
                    this.getPaymentByRevId(this.dialogOrder.bookOneOrderId);
                }

                if (
                    this.dialogOrder.orderLineDtoList != null &&
                    this.dialogOrder.orderLineDtoList != undefined &&
                    this.dialogOrder.orderLineDtoList.length > 0
                ) {
                    this.items = this.dialogOrder.orderLineDtoList;
                }
                

                if (
                    this.dialogOrder?.kotDtoList != null &&
                    this.dialogOrder?.kotDtoList?.length > 0
                ) {

                    this.kotListReadyToPrint = this.dialogOrder?.kotDtoList?.filter((k) => {
                        return k.orderLines.some((ol) => {
                            if (ol.notes != null && ol.notes != undefined) {
                                this.isKotNoteAvailable = true;
                            }
                            return (ol.status == null || ol.status === "Available");
                        });
                    });


                    this.kotList = this.dialogOrder?.kotDtoList;



                } else if (
                    this.dialogOrder?.kotDtoList != null &&
                    this.dialogOrder?.kotDtoList.length === 0
                ) {
                    this.kotList = [];
                }





                if (this.isKotUpdate === true) {
                    this.isKotUpdate = false;
                    //this.updateKOTListItem();
                    this.CreateOrUpdateKotAndConfirmOrder(orderId);
                }
              
            
                
                this.UIDetectChange();
                this.loader = false;
            },
            (error) => {
                this.loader = false;
            }
        );
    }
    private delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
    async getBookingById(bookingId) {
        try {
            const response1 = await this.bookingService.findBooking(bookingId).toPromise();
            this.booking = response1.body;
            this.getPaymentByRevId(this.booking.propertyReservationNumber);
            this.loader = false;
        } catch (error) {
            console.error("Error:", error);
            this.loader = false;
        }
    }



    // generatePDF() {
    //     const element = document.getElementById('kotPrintSection2');

    //     if (element) {
    //         // Temporarily add the 'print-area' class for proper styling during PDF generation
    //         element.classList.add('print-area');
    //         element.style.setProperty('display', 'block', 'important');
    //         element.style.setProperty('max-width', '300px', 'important');
    //         element.style.setProperty('width', '100%', 'important');
    //         element.style.setProperty('margin', '0', 'important');
    //         element.style.setProperty('padding', '0', 'important');

    //         function applyStyles(elements, styles) {
    //             for (let i = 0; i < elements.length; i++) {
    //                 const el = elements[i] as HTMLElement;
    //                 for (const key in styles) {
    //                     if (styles.hasOwnProperty(key)) {
    //                         el.style.setProperty(key, styles[key], 'important');
    //                     }
    //                 }
    //             }
    //         }

    //         function resetMarginPadding(elements) {
    //             for (let i = 0; i < elements.length; i++) {
    //                 const el = elements[i] as HTMLElement;
    //                 el.style.setProperty('margin', '0', 'important');
    //                 el.style.setProperty('padding', '0', 'important');
    //             }
    //         }
    //         resetMarginPadding(element.querySelectorAll('*'));
    //         applyStyles(element.getElementsByClassName('table-frame'), {
    //             'padding': '10px',
    //             'color': '#000000',
    //             'font-size': '1.5vmax',
    //             'width': '100%',
    //             'margin-top': '10px'
    //         });

    //         applyStyles(element.getElementsByClassName('tdth'), {
    //             'padding-left': '5px',
    //             'border': '1px solid #c1c1c1',
    //             'text-align': 'left',
    //             'color': '#000000',
    //             'font-size': '1.5vmax',
    //         });

    //         applyStyles(element.getElementsByClassName('print-table-css'), { 
    //             'font-size': '2vmax',
    //             'color': '#000000',
    //             'width': '100%'

    //         });

    //         applyStyles(element.getElementsByClassName('main-title'), { 
    //             'font-size': '2vmax',
    //             'color': '#000000',
    //             'font-weight':'700',
    //             'text-align':'center'
    //         });
    //         applyStyles(element.getElementsByClassName('subtitle'), { 
    //             'font-size': '2vmax',
    //             'color': '#000000'
    //         });
    //         applyStyles(element.getElementsByClassName('text-size'), { 
    //             'font-size': '2vmax',
    //             'color': '#000000',
    //             'padding':'5px'
    //         });

    //         // Use html2canvas to capture the HTML content
    //         html2canvas(element, {
    //             scale: 2,
    //             logging: false,
    //             letterRendering: true,
    //             useCORS: true
    //         }).then(canvas => {
    //             // Get the canvas data URL
    //             const dataURL = canvas.toDataURL();

    //             // Image scaling based on page size
    //             const imgWidth = 45 * 3; // 58 mm to pixels
    //             const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

    //             // If image height exceeds the page, split it across multiple pages
    //             const pages = [];
    //             let position = 0;
    //             const pageHeight = 100 * 8; // 100 mm to pixels

    //             while (position < imgHeight) {
    //                 pages.push({
    //                     image: dataURL,
    //                     width: imgWidth,
    //                     height: imgHeight > pageHeight ? pageHeight : imgHeight - position,
    //                     margin: [0, position === 0 ? 0 : -pageHeight, 0, 0]
    //                 });
    //                 position += pageHeight;
    //             }

    //             // Create a new pdfMake document definition
    //             const docDefinition = {
    //                 content: pages,
    //                 pageSize: { width: 45 * 3, height: 100 * 8 }, // Page size in mm
    //                 pageMargins: [0, 5, 0, 5], // Margins in mm
    //             };

    //             // Generate the PDF using pdfMake
    //             pdfMake.createPdf(docDefinition).getBlob((pdfBlob) => {
    //                 element.style.setProperty('display', 'none', 'important');
    //                 // Upload the PDF to S3 or download it
    //                 this.uploadPDFToS3(pdfBlob);
    //                 pdfMake.createPdf(docDefinition).download('KOT_Report.pdf');
    //             });
    //         });
    //     } else {
    //         console.error('Element not found or no KOTs ready to print');
    //     }
    // }
    
    async presentToast(Message: string) {
        const toast = await this.toastController.create({
            message: Message,
            duration: 2000,
        });
        toast.present();
    }


    formatDateTime(timestamp: number): string {
        const date = new Date(timestamp);
        const day = ('0' + date.getDate()).slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // Convert to 12-hour format

        return `${formattedHours}:${minutes} ${ampm}`;
    }


    getKotOrderLine(kot) {
        return kot.orderLines.filter(
            (data) => this.checkStatus(data) === "Available"
        );
    }

    updateOrderStatus2(orderId: number, orderStatus: string) {
        this.loader = true;
        this.orderService.updateOrderStatus(orderId, orderStatus).subscribe(
            (data) => {
                this.loader = false;
                this.UIDetectChange();
            },
            (error) => {
                this.loader = false;
            }
        );
    }

    async updateKOTOrderLineStatus(kotId: number, lines: any[]) {
        try {
            this.loader = true;
            await this.orderService.updateKotLine(kotId, lines).toPromise();
            this.loader = false;
            this.UIDetectChange();
        } catch (error) {
            this.loader = false;
            // Handle error
        }
    }

    printKot(url: string) {
        this.orderService.printKOT(url, this.businessService.kotQueueUrl).subscribe((data) => {
        });
    }
    getSubscriptionForProperty(propertyId: number) {
        this.bookingservice
            .getPropertySubcription(String(propertyId))
            .subscribe(
                (data) => {
                    this.subscriptionSelected = data;

                    if (
                        this.subscriptionSelected != null &&
                        this.subscriptionSelected != undefined &&
                        this.subscriptionSelected.length > 0
                    ) {
                        for (let i = 0; i < this.subscriptionSelected.length; i++) {
                            if (
                                this.subscriptionSelected[i].name === "Silent Printer"
                            ) {
                                this.isSilentPrinter = true;
                            }

                        }
                    }
                    this.changeDetectorRefs.detectChanges();
                },
                (error) => { }
            );
    }

    getPaymentById(id: number) {
        this.loader = true;
        this.paymentService.findPaymentById(id).subscribe(
            (data) => {
                this.loader = false;
                this.payments = [];
                this.paymentsFilter = [];

                if (data.body != null) {
                    this.paymentDTO = data.body;

                    this.payments.push(this.paymentDTO);
                    this.paymentsFilter.push(this.paymentDTO);
                }
                this.UIDetectChange();
            },
            (error) => {
                this.loader = false;
            }
        );
    }

    getPaymentByRevId(revId: string) {
        this.loader = true;
        this.paymentService.findPaymentByReferenceNumber(revId).subscribe(
            (data) => {
                if (data.length > 0) {
                    this.payments = data;
                    this.paymentsFilter = data;

                    // this.paymentsPaid = this.payments.filter((item) => {
                    //   const searchResult =
                    //     item.status != null && item.status.toLocaleLowerCase() === "paid";

                    //   return searchResult;
                    // });

                    this.UIDetectChange();
                    this.loader = false;
                }
            },
            (error) => {
                this.loader = false;
            }
        );
    }

    checkKotUnitInOrder(item) {
        let UnitInOrder = 0;
        for (let i = 0; i < this.kotList.length; i++) {
            for (let l = 0; l < this.kotList[i].orderLines.length; l++) {
                if (
                    this.kotList[i].orderLines[l].name === item.name &&
                    this.kotList[i].orderLines[l].productCode ===
                    item.productCode
                ) {
                    UnitInOrder =
                        UnitInOrder +
                        this.kotList[i].orderLines[l].unitsInOrder;
                }
            }
        }

        return UnitInOrder;
    }

    // CreateOrUpdateKotAndConfirmOrder(orderId) {
    //     if (
    //         this.dialogOrder.orderLineDtoList != null &&
    //         this.dialogOrder.orderLineDtoList != undefined &&
    //         this.dialogOrder.orderLineDtoList.length > 0
    //     ) {
    //         let updatedKotList = [];
    //         for (let i = 0; i < this.dialogOrder.orderLineDtoList.length; i++) {
    //             if (
    //                 this.isKotCreated(this.dialogOrder.orderLineDtoList[i]) ===
    //                 false
    //             ) {
    //                 updatedKotList.push(this.dialogOrder.orderLineDtoList[i]);
    //             } else {
    //                 if (
    //                     this.checkKotUnitInOrder(
    //                         this.dialogOrder.orderLineDtoList[i]
    //                     ) != this.dialogOrder.orderLineDtoList[i].unitsInOrder
    //                 ) {
    //                     let addUnitInLine =
    //                         this.dialogOrder.orderLineDtoList[i].unitsInOrder -
    //                         this.checkKotUnitInOrder(
    //                             this.dialogOrder.orderLineDtoList[i]
    //                         );

    //                     let koties = this.getKotDetails(
    //                         this.dialogOrder.orderLineDtoList[i]
    //                     );

    //                     if (koties != null && koties.length > 0) {
    //                         let kot = koties[0];

    //                         for (let k = 0; k < kot.orderLines.length; k++) {
    //                             if (
    //                                 kot.orderLines[k].name ===
    //                                 this.dialogOrder.orderLineDtoList[i]
    //                                     .name &&
    //                                 kot.orderLines[k].productCode ===
    //                                 this.dialogOrder.orderLineDtoList[i]
    //                                     .productCode
    //                             ) {
    //                                 kot.orderLines[k].unitsInOrder =
    //                                     kot.orderLines[k].unitsInOrder +
    //                                     addUnitInLine;
    //                             }
    //                         }
    //                         this.updateKot(kot.id, kot.orderLines);
    //                     } else {
    //                         this.dialogOrder.orderLineDtoList[i].unitsInOrder =
    //                             addUnitInLine;
    //                         updatedKotList.push(
    //                             this.dialogOrder.orderLineDtoList[i]
    //                         );
    //                     }
    //                 }
    //             }
    //         }

    //         if (updatedKotList != null && updatedKotList.length > 0) {
    //             this.kot.date = this.datepipe.transform(
    //                 new Date(),
    //                 "yyyy-MM-dd"
    //             );
    //             this.kot.operatorName = this.dialogOrder.operatorName;
    //             this.kot.propertyId = this.dialogOrder.propertyId;
    //             this.kot.tableNo = this.dialogOrder.resourceName;
    //             this.kot.time = this.dialogOrder.requiredTime;
    //             this.kot.orderLines = updatedKotList;
    //             this.kot.orderNo = this.dialogOrder.bookOneOrderId;
    //             this.kot.orderType = this.dialogOrder.deliveryMethod;
    //             this.kot.priority = this.kotList.length + 1;

    //             this.orderService.createKot(this.kot).subscribe(
    //                 (data) => {
    //                     this.loader = true;
    //                     this.orderService.getOrderByOrderId(orderId).subscribe(
    //                         (data) => {
    //                             this.dialogOrder = data.body;

    //                             if (
    //                                 this.dialogOrder.orderLineDtoList != null &&
    //                                 this.dialogOrder.orderLineDtoList !=
    //                                 undefined &&
    //                                 this.dialogOrder.orderLineDtoList.length > 0
    //                             ) {
    //                                 this.items =
    //                                     this.dialogOrder.orderLineDtoList;
    //                             }

    //                             if (
    //                                 this.dialogOrder.kotDtoList != null &&
    //                                 this.dialogOrder.kotDtoList.length > 0
    //                             ) {
    //                                 this.kotList = this.dialogOrder.kotDtoList;
    //                             } else if (
    //                                 this.dialogOrder.kotDtoList != null &&
    //                                 this.dialogOrder.kotDtoList.length === 0
    //                             ) {
    //                                 this.kotList = [];
    //                             }

    //                             this.UIDetectChange();
    //                         },
    //                         (error) => {
    //                             this.loader = false;
    //                         }
    //                     );
    //                 },
    //                 (error) => {
    //                     this.loader = false;
    //                 }
    //             );
    //         }
    //     }
    // }

    CreateOrUpdateKotAndConfirmOrder(orderId) {
        if (
          this.dialogOrder.orderLineDtoList != null &&
          this.dialogOrder.orderLineDtoList != undefined &&
          this.dialogOrder.orderLineDtoList.length > 0
        ) {
          let updatedKotList = [];
          for (let i = 0; i < this.dialogOrder.orderLineDtoList.length; i++) {
            if (this.isKotCreated(this.dialogOrder.orderLineDtoList[i]) === false) {
              updatedKotList.push(this.dialogOrder.orderLineDtoList[i]);
            } else {
              if (
                this.checkKotUnitInOrder(this.dialogOrder.orderLineDtoList[i]) !=
                this.dialogOrder.orderLineDtoList[i].unitsInOrder
              ) {
                let addUnitInLine =
                  this.dialogOrder.orderLineDtoList[i].unitsInOrder -
                  this.checkKotUnitInOrder(this.dialogOrder.orderLineDtoList[i]);
                
                   let previousUnitInline = this.checkKotUnitInOrder(this.dialogOrder.orderLineDtoList[i]);
                let koties = this.getKotDetails(
                  this.dialogOrder.orderLineDtoList[i]
                );
    
                if (koties != null && koties.length > 0) {
                  let kot = koties[0];
    
                  for (let k = 0; k < kot.orderLines.length; k++) {
                    if (
                      kot.orderLines[k].name ===
                        this.dialogOrder.orderLineDtoList[i].name &&
                      kot.orderLines[k].productCode ===
                        this.dialogOrder.orderLineDtoList[i].productCode
                    ) {
                      kot.orderLines[k].unitsInOrder =
                        kot.orderLines[k].unitsInOrder + addUnitInLine;
                    }
                  }
                  this.updateKot(kot.id, kot.orderLines);
    
                } else {
                  this.dialogOrder.orderLineDtoList[i].unitsInOrder = addUnitInLine;
                  this.dialogOrder.orderLineDtoList[i].unitsInStock = previousUnitInline;
                  updatedKotList.push(this.dialogOrder.orderLineDtoList[i]);
                }
              }
            }
        }
    
   const uniqueRemovedItems = new Set();

   this.kotList.forEach((existingKot) => {
     existingKot.orderLines.forEach((kotLine) => {
       const key = `${kotLine.productCode}_${kotLine.name}`;

       if (uniqueRemovedItems.has(key)) return;

       const matched = this.dialogOrder.orderLineDtoList.find(
         (newLine) =>
           newLine.productCode === kotLine.productCode &&
           newLine.name === kotLine.name
       );

       if (!matched || matched.unitsInOrder === 0) {
         let removedLine = { ...kotLine };
         removedLine.unitsInStock = kotLine.unitsInOrder;
         removedLine.unitsInOrder = 0;
         updatedKotList.push(removedLine);
         uniqueRemovedItems.add(key);
       }
     });
   });


       // Filter orderLines for those with groupKot set to true
    const orderLinesToGroup = updatedKotList.filter(line => line.groupKot);

    // Group those orderLines by productGroupId
    let groupedOrderLines = this.groupByProductGroupId(orderLinesToGroup);

    for (const productGroupId in groupedOrderLines) {
      if (groupedOrderLines.hasOwnProperty(productGroupId)) {
        const orderLineDtoList = groupedOrderLines[productGroupId];
        orderLineDtoList.forEach((io) => io.status = 'Available');
        let printerName = this.productGroupsList.find((group)=>group.name == orderLineDtoList[0].productGroupName).printerName;
        let kot = new KOT();
        kot.date = this.datepipe.transform(new Date(), "yyyy-MM-dd");
        kot.operatorName = this.dialogOrder.operatorName;
        kot.propertyId = this.dialogOrder.propertyId;
        kot.tableNo = this.dialogOrder.resourceName;
        kot.time = this.dialogOrder.requiredTime;
        kot.orderLines = orderLineDtoList;
        kot.productGroupName = orderLineDtoList[0].productGroupName;
        kot.orderNo = this.dialogOrder.bookOneOrderId;
        kot.orderType = this.dialogOrder.deliveryMethod;
        kot.priority = this.kotList.length + 1;
        kot.printerName = printerName;
        kot.kotNo = this.kotList[0]?.kotNo;
        kot.version = "V-" + (this.kotList.length + 1);
        this.orderService.createKot(kot).subscribe(
          (data) => {
            this.orderService.getOrderByOrderId(orderId).subscribe(
              (data) => {
                this.dialogOrder = data.body;

                if (
                  this.dialogOrder.orderLineDtoList != null &&
                  this.dialogOrder.orderLineDtoList != undefined &&
                  this.dialogOrder.orderLineDtoList.length > 0
                ) {
                  this.items = this.dialogOrder.orderLineDtoList;
                }

                if (
                  this.dialogOrder.kotDtoList != null &&
                  this.dialogOrder.kotDtoList.length > 0
                ) {
                  this.kotListReadyToPrint = this.dialogOrder.kotDtoList.filter((k) => {
                    return k.orderLines.some((ol) => {
                      return (ol.status == null || ol.status === "Available");
                    });
                  });
                  this.kotList = this.dialogOrder.kotDtoList;
                } else if (
                  this.dialogOrder.kotDtoList != null &&
                  this.dialogOrder.kotDtoList.length === 0
                ) {
                  this.kotList = [];
                }

                this.UIDetectChange();
              },
              (error) => {
                this.loader = false;
              }
            );
          },
          (error) => {
            this.loader = false;
            // Handle error
          }
        );

        // Update priority for next KOT
        this.kotList.push(kot);
      }
    }

    let individualOrderLines = updatedKotList.filter(line => !line.groupKot)
        individualOrderLines.forEach((io) => io.status = 'Available');
      if (individualOrderLines != null && individualOrderLines.length > 0) {
        let printerName = this.productGroupsList.find((group)=>group.name == individualOrderLines[0].productGroupName)?.printerName;
        this.kot.date = this.datepipe.transform(new Date(), "yyyy-MM-dd");
        this.kot.operatorName = this.dialogOrder.operatorName;
        this.kot.propertyId = this.dialogOrder.propertyId;
        this.kot.tableNo = this.dialogOrder.resourceName;
        this.kot.time = this.dialogOrder.requiredTime;
        this.kot.orderLines = individualOrderLines;
        this.kot.orderNo = this.dialogOrder.bookOneOrderId;
        this.kot.orderType = this.dialogOrder.deliveryMethod;
        this.kot.priority = this.kotList.length + 1;
        this.kot.printerName = printerName;
        this.kot.kotNo = this.kotList[0]?.kotNo;
        this.kot.version = "V-" + (this.kotList.length + 1);
        this.orderService.createKot(this.kot).subscribe(
          (data) => {
            this.loader = true;
            this.orderService.getOrderByOrderId(orderId).subscribe(
              (data) => {
                this.dialogOrder = data.body;

                if (
                  this.dialogOrder.orderLineDtoList != null &&
                  this.dialogOrder.orderLineDtoList != undefined &&
                  this.dialogOrder.orderLineDtoList.length > 0
                ) {
                  this.items = this.dialogOrder.orderLineDtoList;
                }

                if (
                  this.dialogOrder.kotDtoList != null &&
                  this.dialogOrder.kotDtoList.length > 0
                ) {
                  this.kotListReadyToPrint = this.dialogOrder.kotDtoList.filter((k) => {
                    return k.orderLines.some((ol) => {
                      return (ol.status == null || ol.status === "Available");
                    });
                  });
                  this.kotList = this.dialogOrder.kotDtoList;
                } else if (
                  this.dialogOrder.kotDtoList != null &&
                  this.dialogOrder.kotDtoList.length === 0
                ) {
                  this.kotList = [];
                }

                this.UIDetectChange();
              },
              (error) => {
                this.loader = false;
              }
            );
          },
          (error) => {
            this.loader = false;
          }
        );
      }
    }
      }

      groupByProductGroupId(orderLines: any[]): any {
        return orderLines.reduce((groupedOrderLines, orderLine) => {
          const groupId = orderLine.productGroupId;
          if (!groupedOrderLines[groupId]) {
            groupedOrderLines[groupId] = [];
          }
          groupedOrderLines[groupId].push(orderLine);
          return groupedOrderLines;
        }, {});
      }

  updateKot(kotId, orderLineDtoList) {
    this.orderService.updateKotLine(kotId, orderLineDtoList).subscribe(
      (data) => {
        let kot = data.body;

        let kotIndex = kot.orderLines.findIndex(
          (data) => data.unitsInOrder === 0
        );
        /*
        if (kotIndex != null && kotIndex > -1) {

          this.orderService
            .removeKotItem(kot.id, kot.orderLines[kotIndex].productCode)
            .subscribe(
              (data) => {
                kot.orderLines.splice(kotIndex, 1);
                let index = this.kotList.findIndex((data) => data.id === kotId);
                this.kotList[index] = kot;

                for (let i = 0; i < this.kotList.length; i++) {
                  if (
                    this.kotList[i].orderLines != null &&
                    this.kotList[i].orderLines != undefined &&
                    this.kotList[i].orderLines.length === 0
                  ) {
                    this.orderService
                      .deleteKotById(this.kotList[i].id)
                      .subscribe(
                        (data) => {
                          this.kotList.splice(i, 1);
                        },
                        (error) => {
                          this.loader = false;
                        }
                      );
                  }
                }
              },
              (error) => {
                this.loader = false;
              }
            );

        } else {

        }
          */
         let index = this.kotList.findIndex((data) => data.id === kotId);
          this.kotList[index] = kot;
      },
      (error) => {
        this.loader = false;
      }
    );
  }

    getKotDetails(item) {
        let kot = this.kotList.filter((data) =>
            data.orderLines.find(
                (line) =>
                    line.name === item.name &&
                    line.productCode === item.productCode &&
                    this.checkStatus(line) === "Available"
            )
        );
        if (kot != null && kot != undefined && kot.length > 0) {
            return kot;
        } else {
            return null;
        }
    }

    checkStatus(product) {
        if (
            product.status === null ||
            product.status === undefined ||
            product.status === ""
        ) {
            return (product.status = "Available");
        }

        return product.status;
    }

    isKotCreated(item) {
        let isKotCreated = false;
        for (let i = 0; i < this.kotList.length; i++) {
            for (let l = 0; l < this.kotList[i].orderLines.length; l++) {
                if (
                    this.kotList[i].orderLines[l].name === item.name &&
                    this.kotList[i].orderLines[l].productCode ===
                    item.productCode
                ) {
                    isKotCreated = true;
                }
            }
        }

        return isKotCreated;
    }

    updateKOTListItem() {
        if (
            this.kotList != null &&
            this.kotList != undefined &&
            this.kotList.length > 0
        ) {
            for (let i = 0; i < this.kotList.length; i++) {
                for (let j = 0; j < this.kotList[i].orderLines.length; j++) {
                    if (
                        this.dialogOrder.orderLineDtoList.some(
                            (data) =>
                                this.kotList[i].orderLines[j].name ===
                                data.name &&
                                this.kotList[i].orderLines[j].productCode ===
                                data.productCode
                        ) == false
                    ) {
                        this.removeKotItem(
                            this.kotList[i].id,
                            this.kotList[i].orderLines[j].productCode,
                            this.kotList[i].orderLines,
                            j
                        );
                    }
                }
            }
        }

        for (let i = 0; i < this.kotList.length; i++) {
            if (
                this.kotList[i].orderLines != null &&
                this.kotList[i].orderLines != undefined &&
                this.kotList[i].orderLines.length === 0
            ) {
                this.orderService.deleteKotById(this.kotList[i].id).subscribe(
                    (data) => {
                        this.kotList.splice(i, 1);
                    },
                    (error) => {
                        this.loader = false;
                    }
                );
            }
        }
        this.loader = false;
    }

    removeKotItem(kotId, productCode, item, index) {
        this.orderService.removeKotItem(kotId, productCode).subscribe(
            (data) => {
                item.splice(index, 1);
                this.loader = false;
            },
            (error) => {
                this.loader = false;
            }
        );
    }

    deleteKot(row) {
        this.orderService.deleteKotById(row.id).subscribe(
            (data) => {
                this.getOrderByOrderId(this.dialogOrder.id);
                this.UIDetectChange();
                this.loader = false;
            },
            (error) => {
                this.loader = false;
            }
        );
    }

    deleteKotItem(propduct, kot) {
        this.orderService
            .deleteKOTOrderLineId(kot.id, propduct.productCode)
            .subscribe(
                (data) => {
                    if (kot.orderLines.length == 1) {
                        this.deleteKot(kot);
                    } else {
                        this.getOrderByOrderId(this.dialogOrder.id);
                    }

                    this.UIDetectChange();
                    this.loader = false;
                },
                (error) => {
                    this.loader = false;
                }
            );
    }

    addKOT(item) {
        if (
            this.isKotCreated(item) != null &&
            this.isKotCreated(item) === true
        ) {
        } else {
            if (this.item2.indexOf(item) > -1) {
                let index = this.item2.indexOf(item);
                this.item2.splice(index, 1);
            } else {
                this.item2.push(item);
            }
        }
    }

    removeKOT(item) {
        let index = this.item2.indexOf(item);
        this.item2.splice(index, 1);
    }

    getAllGroupProduct(
        businessServiceId: number,
      ) {
        this.loader = true;
        this.productGroupsList = [];
        this.orderService
          .findProductsByBusinessServiceId(businessServiceId)
          .subscribe(
            (data) => {
              this.productGroupsList = data.body;
              this.loader = false;
              this.UIDetectChange();
            },
            (error) => {
              this.loader = false;
            }
          );
      }

    createKot() {
        this.kot.date = this.datepipe.transform(new Date(), "yyyy-MM-dd");
        this.kot.operatorName = this.dialogOrder.operatorName;
        this.kot.propertyId = this.dialogOrder.propertyId;
        this.kot.tableNo = this.dialogOrder.resourceName;
        this.kot.time = this.dialogOrder.requiredTime;
        this.kot.orderLines = this.item2;
        this.kot.orderNo = this.dialogOrder.bookOneOrderId;
        this.kot.orderType = this.dialogOrder.deliveryMethod;
        this.kot.priority = this.priority;

        this.orderService.createKot(this.kot).subscribe(
            (data) => {
                this.item2 = [];

                this.onPriorityForm.reset();
                this.getOrderByOrderId(this.dialogOrder.id);

                this.UIDetectChange();
                this.loader = false;
            },
            (error) => {
                this.loader = false;
            }
        );
    }

    UIDetectChange() {
        setTimeout(() => {
            if (
                this.changeDetectorRefs &&
                !(this.changeDetectorRefs as ViewRef).destroyed
            ) {
                this.changeDetectorRefs.detectChanges();
            }
        });
    }

    menuAction() {
        this.menuCtrl.toggle();
    }

    async onMenu() {
        const actionSheet = await this.actionSheetController.create({
            header: "Switch Dashboard",
            cssClass: "action-sheets-basic-page",
            mode: "md",
            buttons: [
                {
                    text: "Order Management",
                    icon: "apps-outline",
                    handler: () => {
                        this.navCtrl.navigateRoot("manage-order");
                    },
                },
                {
                    text: "Order Dashboard",
                    icon: "apps-outline",
                    handler: () => {
                        this.navCtrl.navigateRoot("order-dashboard");
                    },
                },
            ],
        });
        await actionSheet.present();
    }
}
