import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Order } from '../Order/order';
import { OrderLineDto } from '../Order/orderLineDto';
import { Payment } from '../manage-booking/Payment/Payment';
import { KOT } from 'src/app/pages/order/KOT';
import { Booking } from '../manage-booking/Booking/Booking';
import { TaxDetails } from '../TaxDetail/TaxDetails';
import { OrderProduct } from '../Order/product';
import { productVariationDtoList } from '../Order/productVariation';
import { Available_Status, CompletedStatus, Cooking_Status, OutOfStock_Status, PaidButOutOfStock_Status, ReadytoServe_Status, ServedStatus } from 'src/app/pages/order/status';
import { BusinessService } from '../Reservation/businessServic';
import { ProductGroupList } from 'src/app/pages/order/product-group/product-group.page';
import { FormControl, Validators } from '@angular/forms';
import { OrderService } from 'src/app/service/Order/order.service';
import { TokenStorage } from 'src/app/token.storage';
import { DatePipe } from '@angular/common';
import { BookingService } from 'src/app/service/manage-booking/booking-service.service';
import { PaymentService } from 'src/app/service/payment/payment.service';
import { AuthService } from 'src/app/service/auth.service';
// import { NavParams } from '@ionic/angular/directives/navigation/nav-params';
import { ReservationService } from 'src/app/service/ReservationService/reservation-service.service';
import { SplitTaxDTO } from 'src/app/pages/booking/booking.page';
import { ModalController, NavParams } from '@ionic/angular';
import { Audit } from 'src/app/service/audit';
import { PropertyService } from 'src/app/service/property/property.service';
import { DateService } from 'src/app/service/DateService/date-service.service';
import { AUDIT_ORDER_ITEM_SHIFT } from 'src/app/app.component';

@Component({
  selector: 'app-item-release',
  templateUrl: './item-release.component.html',
  styleUrls: ['./item-release.component.scss'],
})
export class ItemReleaseComponent implements OnInit {

  
    orders: Order[];
    order: Order;
    loader: boolean = false;
    orderLineList: OrderLineDto[] = [];
    orderLine: OrderLineDto;
    payments: Payment[] = [];
    paymentsFilter: Payment[] = [];
    paymentsPaid: Payment[] = [];
    kotList: KOT[] = [];
    total: number = 0;
    subTotalAmount: number = 0;
    taxDetailsSelected: TaxDetails[] = [];
    totalSplitTax: any[];
    booking:Booking;
    productGroupListData: any[] = [];
    methodType: string;
    orderProduct: OrderProduct;
    totalPrice:any;
    orderProducts: OrderProduct[];
    orderSelectedProducts: any[];
    productVariationSelected: any[];
    orderProductSelected: any;
    newSelectedProducts: OrderProduct[];
    existingOrder: Order;
    orderProductSelectedToShiftList: any[] = [];
  
    productVariations: productVariationDtoList[];
    productVariation: productVariationDtoList;
    selectedIndex: number = -1;
    quantity: number;
    Available_Status: string = Available_Status;
    OutOfStock_Status: string = OutOfStock_Status;
    PaidButOutOfStock_Status: string = PaidButOutOfStock_Status;
    totalPriceVariation:number;
    isExpend: boolean;
    quantityVariation: number;
    totalQuantity: number;
    totalProductDiscount: number;
    nonGstTotalAmount: number;
    Cooking_Status: string = Cooking_Status;
    ReadytoServe_Status: string = ReadytoServe_Status;
    ServedStatus: string = ServedStatus;
    CompletedStatus: string = CompletedStatus;
    isPaidOrder:boolean;
    discountPercentage: number;
    isIndeterminate: boolean;
    businessService:BusinessService;
    payment:Payment;
    paymentReservation: Payment;
    paymentsNotPaid: Payment[];
    PosUserName: string;
    kot:KOT;
    productGroupsList: ProductGroupList[] = [];
    resourceSelection: string
    
    ResourceSelection: FormControl = new FormControl("", [
      Validators.required,
    ]);
  
    resourceFrom: FormControl = new FormControl({
      ResourceSelection : this.ResourceSelection,
    });
    selectedOrder: any= null;
    audit: Audit;
  previousOrderproductLine:any[] = [];
  previousOrderAmount: number;
  role: any = [];
  prevOrder:Order;
  
    constructor(private orderService: OrderService,public datepipe: DatePipe, private token: TokenStorage,
      private bookingService : BookingService,
      private paymentService: PaymentService,
      private modalController :ModalController,
      private authService: AuthService,
   private navParams :NavParams,
      private reservationService: ReservationService,
      private changeDetectorRefs: ChangeDetectorRef,
      private dateService: DateService,
    private propertyService: PropertyService,

     
    ) {
        this.newSelectedProducts = this.navParams.get('orderProducts');
        this.existingOrder = this.navParams.get('order');
        this.businessService = this.navParams.get('businessService');

    //   this.newSelectedProducts = this.data?.orderProducts;
    //   this.existingOrder = this.data?.order;
    //   this.businessService = this.data?.businessService;
      this.kot = new KOT();
      this.order = new Order;
     }
  
    ngOnInit() {
       

    
      let fromdate = this.datepipe.transform(new Date().getTime(), "yyyy-MM-dd");
      let todate = this.datepipe.transform(new Date().getTime(), "yyyy-MM-dd");
      this.getOrderByPropertyIdAndDateRange(Number(this.token.getPropertyId()), fromdate, todate);
      
  this.getAllGroupProduct(this.businessService.id);
      this.authService
      .getUserByUserId(this.token.getUserId())
      .subscribe((resp) => {
  
        this.PosUserName = resp.body.firstName + " " + resp.body.lastName;
  
      });
      this.orderProducts = [];
    }
    getValue(value) {
      if (value != null && value != undefined)
      {
        return value;
      }
      else
      {
        return 0;
      }
    }
    onOrderDetailsSelected(order){
        this.selectedOrder = order; 
          this.getOrderByOrderId(order.id);
    }
    dismiss() {
        this.modalController.dismiss();
        this.changeDetectorRefs.detectChanges();
  
      }
  
    getOrderByPropertyIdAndDateRange(
      propertyId: number,
      formDate: string,
      toDate: string
    ) {
      this.loader = true;
  
      this.orderService
        .getOrderByPropertyIdAndDateRange(
          String(propertyId),
          formDate,
          toDate
        )
        .subscribe(
          (data) => {
            this.orders = data.body;
          
            this.orders = this.orders.filter((o)=>(o.orderStatus != "Completed" && o.orderStatus != "Cancelled" && o.id != this.existingOrder.id && o.businessServiceId == this.businessService.id))
            console.log("orders details:"+ JSON.stringify(this.orders))
            this.loader = false;
  
            // this.UIDetectChange();
          },
          (error) => {
            this.loader = false;
          }
        );
    }
  
    async getOrderByOrderId(orderId: number) {
      try {
       
          this.loader = true;
          const data = await this.orderService.getOrderByOrderId(orderId).toPromise();
          this.order = data.body;
          this.prevOrder = this.order;
      this.previousOrderproductLine = this.order.orderLineDtoList;
      this.previousOrderAmount = this.order.totalOrderAmount;
          this.discountPercentage = this.getValue(this.order.discountPercentage);
          this.getCartFromOrder();
          if (this.order.deliveryMethod != "Room Order") {
              if (this.order.bookOneOrderId != null && this.order.bookOneOrderId != undefined) {
                  await this.getPaymentByRevId(this.order.bookOneOrderId);
              }
          } else {
              if (this.order.bookingId != null && this.order.bookingId != undefined) {
                  await this.getBookingById();
              }
          }
          if (
            this.order.kotDtoList != null &&
            this.order.kotDtoList.length > 0
          ) {
  
            this.kotList = this.order.kotDtoList;
           
          } else if (
            this.order.kotDtoList != null &&
            this.order.kotDtoList.length === 0
          ) {
            this.kotList = [];
          }
         
          this.loader = false;
      } catch (error) {
          this.loader = false;
         
          // Handle error
      } finally {
        //   this.UIDetectChange();
      }
  }
  
  getAllGroupProduct(
    businessServiceId: number
  ) {
    this.loader = true;
    this.productGroupsList = [];
    
    this.orderService
      .findProductsByBusinessServiceId(businessServiceId)
      .subscribe(
        (data) => {
          let searchResult;
  
          let productGroups = data.body;
          productGroups = productGroups.filter((item) => {
            searchResult =
              item.isSubGroup === null ||
              item.isSubGroup === undefined ||
              item.isSubGroup === false;
  
            return searchResult;
          });
  
         
          const productGroup: ProductGroupList = {
            businessServiceId: businessServiceId,
            productGroup: productGroups,
          };
          this.productGroupListData = productGroups;
          this.productGroupsList.push(productGroup);
  
        //   this.UIDetectChange();
        },
        (error) => {
          this.loader = false;
        }
      );
  }
  
  getCartFromOrder() {

    if (this.order.deliveryMethod === "Dine In") {
      this.methodType = "InDyne";
    } else if (this.order.deliveryMethod === "Take Away") {
      this.methodType = "TakeAway";
    } else if (this.order.deliveryMethod === "Room Order") {
      this.methodType = "RoomOrder";
    } else if (this.order.deliveryMethod === "Home Delivery") {
      this.methodType = "HomeDelivery";
    }

   
  
    if (this.order.orderLineDtoList != null && this.order.orderLineDtoList) {
      for (let i = 0; i < this.order.orderLineDtoList.length; i++) {
        for (let j = 0; j < this.productGroupListData.length; j++) {
          for (
            let k = 0;
            k < this.productGroupListData[j].productDtoList.length;
            k++
          ) {
            if (
              this.productGroupListData[j].productDtoList[k].productCode ===
                this.order.orderLineDtoList[i].productCode &&
              this.productGroupListData[j].productDtoList[k].name ===
                this.order.orderLineDtoList[i].name
            ) {
              if (
                this.checkOrderLine(
                  this.order.orderLineDtoList,
                  this.order.orderLineDtoList[i].name,
                  this.order.orderLineDtoList[i].productCode
                ) > 1
              ) {
                this.orderProduct = new OrderProduct();
               
                this.orderProduct.id =
                  this.productGroupListData[j].productDtoList[k].id;
                this.orderProduct.description =
                  this.productGroupListData[j].productDtoList[k].description;
                this.orderProduct.name =
                  this.productGroupListData[j].productDtoList[k].name;
                this.orderProduct.notes = this.order.orderLineDtoList[i].notes;
                this.orderProduct.productCode =
                  this.productGroupListData[j].productDtoList[k].productCode;
                this.orderProduct.businessServiceId =
                  this.productGroupListData[j].productDtoList[
                    k
                  ].businessServiceId;
                this.orderProduct.productGroupName =
                  this.productGroupListData[j].productDtoList[
                    k
                  ].productGroupName;
                this.orderProduct.unitsInOrder =
                  this.order.orderLineDtoList[i].unitsInOrder;
                this.orderProduct.buyUnitPrice =
                  this.productGroupListData[j].productDtoList[k].buyUnitPrice;
                this.orderProduct.category =
                  this.productGroupListData[j].productDtoList[k].category;
                this.orderProduct.discountedPrice =
                  this.productGroupListData[j].productDtoList[
                    k
                  ].discountedPrice;
                this.orderProduct.productGroupId =
                  this.productGroupListData[j].productDtoList[k].productGroupId;
                this.orderProduct.shortDescription =
                  this.productGroupListData[j].productDtoList[
                    k
                  ].shortDescription;
                this.orderProduct.groupName =
                  this.productGroupListData[j].productDtoList[k].groupName;
                this.orderProduct.sellUnitPrice =
                  this.productGroupListData[j].productDtoList[k].sellUnitPrice;
                this.orderProduct.imageList =
                  this.productGroupListData[j].productDtoList[k].imageList;
                this.orderProduct.inventoryId =
                  this.productGroupListData[j].productDtoList[k].inventoryId;
                this.orderProduct.recipeId =
                  this.productGroupListData[j].productDtoList[k].recipeId;
                this.orderProduct.isNotesChecked =
                  this.productGroupListData[j].productDtoList[k].isNotesChecked;
                this.orderProduct.supplierId =
                  this.productGroupListData[j].productDtoList[k].supplierId;
                this.orderProduct.quantityProduct =
                  this.productGroupListData[j].productDtoList[
                    k
                  ].quantityProduct;
  
                this.productGroupListData[j].productDtoList[k].status =
                  "Cooking";
  
                if (
                  this.productGroupListData[j].productDtoList[k]
                    .discountedPrice !== null
                ) {
                  this.totalPrice =
                    this.productGroupListData[j].productDtoList[k]
                      .discountedPrice *
                    this.order.orderLineDtoList[i].unitsInOrder;
                } else {
                  this.totalPrice =
                    this.productGroupListData[j].productDtoList[k]
                      .sellUnitPrice *
                    this.order.orderLineDtoList[i].unitsInOrder;
                }
  
                this.orderProduct.totalPrice = this.totalPrice;
                this.orderProduct.status =
                  this.order.orderLineDtoList[i].status;
  
                this.orderProducts.push(this.orderProduct);
               
              } else {
                this.selectedIndex = j;
                this.productGroupListData[j].productDtoList[k].notes =
                  this.order.orderLineDtoList[i].notes;
  
                this.productGroupListData[j].productDtoList[k].status =
                  this.order.orderLineDtoList[i].status;
  
                this.productGroupListData[j].productDtoList[k].unitsInOrder =
                  this.order.orderLineDtoList[i].unitsInOrder;
                  this.productGroupListData[j].productDtoList[k].discountInPercentage =
                  this.order.orderLineDtoList[i].discountInPercentage;
                  this.productGroupListData[j].productDtoList[k].discountedPrice =
                  this.order.orderLineDtoList[i].discountedPrice;
                  this.productGroupListData[j].productDtoList[k].sellUnitPrice =
                  this.order.orderLineDtoList[i].sellUnitPrice;
                  this.productGroupListData[j].productDtoList[k].isNewItem = false;
                  this.productGroupListData[j].productDtoList[k].shiftVariation = false;
                this.onProductAdd(
                  this.productGroupListData[j].productDtoList[k],
                  k,
                  this.productGroupListData[j],
                  this.order.businessServiceId,
                  this.selectedIndex,
                  true,
                  true
                );
              }
  
              for (
                let line1 = 0;
                line1 < this.order.orderLineDtoList.length;
                line1++
              ) {
                // checking topping
                if (
                  this.order.orderLineDtoList[line1].toppingProductGroupId ===
                  this.productGroupListData[j].productDtoList[k]
                    .toppingProductGroupId
                ) {
                  if (
                    this.productGroupListData[j].productDtoList[k]
                      .addOnProductGroup != null &&
                    this.productGroupListData[j].productDtoList[k]
                      .addOnProductGroup.productDtoList != null &&
                    this.productGroupListData[j].productDtoList[k]
                      .addOnProductGroup.productDtoList != undefined &&
                    this.productGroupListData[j].productDtoList[k]
                      .addOnProductGroup.productDtoList.length > 0
                  ) {
                    for (
                      let pIndex = 0;
                      pIndex <
                      this.productGroupListData[j].productDtoList[k]
                        .addOnProductGroup.productDtoList.length;
                      pIndex++
                    ) {
                      if (
                        this.productGroupListData[j].productDtoList[k]
                          .addOnProductGroup.productDtoList[pIndex]
                          .productCode ===
                          this.order.orderLineDtoList[line1].productCode &&
                        this.productGroupListData[j].productDtoList[k]
                          .addOnProductGroup.productDtoList[pIndex].name ===
                          this.order.orderLineDtoList[line1].name
                      ) {
                        this.productGroupListData[j].productDtoList[
                          k
                        ].addOnProductGroup.productDtoList[
                          pIndex
                        ].unitsInOrder =
                          this.order.orderLineDtoList[line1].unitsInOrder;
  
                        if (
                          this.isProductOutOfStock(
                            this.productGroupListData[j].productDtoList[k]
                              .status
                          ) === true
                        ) {
                          this.productGroupListData[j].productDtoList[
                            k
                          ].addOnProductGroup.productDtoList[pIndex].status =
                            this.productGroupListData[j].productDtoList[
                              k
                            ].status;
                        } else {
                          this.productGroupListData[j].productDtoList[
                            k
                          ].addOnProductGroup.productDtoList[pIndex].status =
                            this.order.orderLineDtoList[line1].status;
                        }
                      }
                    }
                  }
                }
                // checking extra
                if (
                  this.order.orderLineDtoList[line1].extraProductGroupId ===
                  this.productGroupListData[j].productDtoList[k]
                    .extraProductGroupId
                ) {
                  if (
                    this.productGroupListData[j].productDtoList[k]
                      .extraProductGroupDto != null &&
                    this.productGroupListData[j].productDtoList[k]
                      .extraProductGroupDto.productDtoList != null &&
                    this.productGroupListData[j].productDtoList[k]
                      .extraProductGroupDto.productDtoList != undefined &&
                    this.productGroupListData[j].productDtoList[k]
                      .extraProductGroupDto.productDtoList.length > 0
                  ) {
                    for (
                      let pIndex = 0;
                      pIndex <
                      this.productGroupListData[j].productDtoList[k]
                        .extraProductGroupDto.productDtoList.length;
                      pIndex++
                    ) {
                      if (
                        this.productGroupListData[j].productDtoList[k]
                          .extraProductGroupDto.productDtoList[pIndex]
                          .productCode ===
                          this.order.orderLineDtoList[line1].productCode &&
                        this.productGroupListData[j].productDtoList[k]
                          .extraProductGroupDto.productDtoList[pIndex].name ===
                          this.order.orderLineDtoList[line1].name
                      ) {
                        this.productGroupListData[j].productDtoList[
                          k
                        ].extraProductGroupDto.productDtoList[
                          pIndex
                        ].unitsInOrder =
                          this.order.orderLineDtoList[line1].unitsInOrder;
  
                        if (
                          this.isProductOutOfStock(
                            this.productGroupListData[j].productDtoList[k]
                              .status
                          ) === true
                        ) {
                          this.productGroupListData[j].productDtoList[
                            k
                          ].extraProductGroupDto.productDtoList[pIndex].status =
                            this.productGroupListData[j].productDtoList[
                              k
                            ].status;
                        } else {
                          this.productGroupListData[j].productDtoList[
                            k
                          ].extraProductGroupDto.productDtoList[pIndex].status =
                            this.order.orderLineDtoList[line1].status;
                        }
                      }
                    }
                  }
                }
              }
            } else {
              for (
                let l = 0;
                l <
                this.productGroupListData[j].productDtoList[k]
                  .productVariationDtoList.length;
                l++
              ) {
                if (
                  ((this.order.orderLineDtoList[i].productCode === null ||
                    this.order.orderLineDtoList[i].productCode === undefined) &&
                    this.productGroupListData[j].productDtoList[k]
                      .productVariationDtoList[l].name ===
                      this.order.orderLineDtoList[i].name) ||
                  (this.order.orderLineDtoList[i].productCode != null &&
                    this.order.orderLineDtoList[i].productCode != undefined &&
                    this.productGroupListData[j].productDtoList[k]
                      .productVariationDtoList[l].code ===
                      this.order.orderLineDtoList[i].productCode &&
                    this.productGroupListData[j].productDtoList[k]
                      .productVariationDtoList[l].name ===
                      this.order.orderLineDtoList[i].name)
                ) {
                  if (
                    this.checkOrderLine(
                      this.order.orderLineDtoList,
                      this.order.orderLineDtoList[i].name,
                      this.order.orderLineDtoList[i].productCode
                    ) > 1
                  ) {
                    this.selectedIndex = j;
                    this.productVariation = new productVariationDtoList();
                    this.productVariation.unitsInOrder =
                      this.order.orderLineDtoList[i].unitsInOrder;
                    this.productVariation.sellUnitPrice =
                      this.productGroupListData[j].productDtoList[
                        k
                      ].productVariationDtoList[l].sellUnitPrice;
                    this.productVariation.discountedPrice =
                      this.productGroupListData[j].productDtoList[
                        k
                      ].productVariationDtoList[l].discountedPrice;
                    this.productVariation.id =
                      this.productGroupListData[j].productDtoList[
                        k
                      ].productVariationDtoList[l].id;
                    this.productVariation.buyUnitPrice =
                      this.productGroupListData[j].productDtoList[
                        k
                      ].productVariationDtoList[l].buyUnitPrice;
                    this.productVariation.code =
                      this.productGroupListData[j].productDtoList[
                        k
                      ].productVariationDtoList[l].code;
                    this.productVariation.productId =
                      this.productGroupListData[j].productDtoList[
                        k
                      ].productVariationDtoList[l].productId;
                    this.productVariation.buyUnitPrice =
                      this.productGroupListData[j].productDtoList[
                        k
                      ].productVariationDtoList[l].buyUnitPrice;
                    this.productVariation.name =
                      this.productGroupListData[j].productDtoList[
                        k
                      ].productVariationDtoList[l].name;
                    this.productVariation.quantityVariation =
                      this.productGroupListData[j].productDtoList[
                        k
                      ].productVariationDtoList[l].quantityVariation;
                    this.productVariation.maintainStock =
                      this.productGroupListData[j].productDtoList[
                        k
                      ].productVariationDtoList[l].maintainStock;
                    this.productVariation.factorToProduct =
                      this.productGroupListData[j].productDtoList[
                        k
                      ].productVariationDtoList[l].factorToProduct;
                    this.productVariation.inventoryId =
                      this.productGroupListData[j].productDtoList[
                        k
                      ].productVariationDtoList[l].inventoryId;
                    this.productVariation.recipeId =
                      this.productGroupListData[j].productDtoList[
                        k
                      ].productVariationDtoList[l].recipeId;
                    this.productVariation.status =
                      this.order.orderLineDtoList[i].status;
  
                    if (
                      this.productVariation.discountedPrice !== null &&
                      this.productVariation.discountedPrice !== 0
                    ) {
                      this.productVariation.totalPrice =
                        this.productVariation.discountedPrice *
                        this.productVariation.unitsInOrder;
                    } else {
                      this.productVariation.totalPrice =
                        this.productVariation.sellUnitPrice *
                        this.productVariation.unitsInOrder;
                    }
  
                    let productData =
                      this.productGroupListData[j].productDtoList[k];
  
                    if (
                      this.orderProducts.some(
                        (opRoduct) => opRoduct.id === productData.id
                      ) === true
                    ) {
                      //this.setVariation(, this.productVariation,l);
                      this.orderProduct = new OrderProduct();
  
                      this.orderProduct.id =
                        this.productGroupListData[j].productDtoList[k].id;
                      this.orderProduct.description =
                        this.productGroupListData[j].productDtoList[
                          k
                        ].description;
                      this.orderProduct.name =
                        this.productGroupListData[j].productDtoList[k].name;
                      this.orderProduct.notes =
                        this.order.orderLineDtoList[i].notes;
                      this.orderProduct.productCode =
                        this.productGroupListData[j].productDtoList[
                          k
                        ].productCode;
                      this.orderProduct.businessServiceId =
                        this.productGroupListData[j].productDtoList[
                          k
                        ].businessServiceId;
                      this.orderProduct.productGroupName =
                        this.productGroupListData[j].productDtoList[
                          k
                        ].productGroupName;
                      this.orderProduct.unitsInOrder =
                        this.order.orderLineDtoList[i].unitsInOrder;
                      this.orderProduct.buyUnitPrice =
                        this.productGroupListData[j].productDtoList[
                          k
                        ].buyUnitPrice;
                      this.orderProduct.category =
                        this.productGroupListData[j].productDtoList[k].category;
                      this.orderProduct.discountedPrice =
                        this.productGroupListData[j].productDtoList[
                          k
                        ].discountedPrice;
                      this.orderProduct.productGroupId =
                        this.productGroupListData[j].productDtoList[
                          k
                        ].productGroupId;
                      this.orderProduct.shortDescription =
                        this.productGroupListData[j].productDtoList[
                          k
                        ].shortDescription;
                      this.orderProduct.groupName =
                        this.productGroupListData[j].productDtoList[
                          k
                        ].groupName;
                      this.orderProduct.sellUnitPrice =
                        this.productGroupListData[j].productDtoList[
                          k
                        ].sellUnitPrice;
                      this.orderProduct.imageList =
                        this.productGroupListData[j].productDtoList[
                          k
                        ].imageList;
                      this.orderProduct.inventoryId =
                        this.productGroupListData[j].productDtoList[
                          k
                        ].inventoryId;
                      this.orderProduct.recipeId =
                        this.productGroupListData[j].productDtoList[k].recipeId;
                      this.orderProduct.isNotesChecked =
                        this.productGroupListData[j].productDtoList[
                          k
                        ].isNotesChecked;
                      this.orderProduct.supplierId =
                        this.productGroupListData[j].productDtoList[
                          k
                        ].supplierId;
                      this.orderProduct.quantityProduct =
                        this.productGroupListData[j].productDtoList[
                          k
                        ].quantityProduct;
  
                      if (
                        this.productGroupListData[j].productDtoList[k]
                          .discountedPrice !== null
                      ) {
                        this.totalPrice =
                          this.productGroupListData[j].productDtoList[k]
                            .discountedPrice *
                          this.order.orderLineDtoList[i].unitsInOrder;
                      } else {
                        this.totalPrice =
                          this.productGroupListData[j].productDtoList[k]
                            .sellUnitPrice *
                          this.order.orderLineDtoList[i].unitsInOrder;
                      }
  
                      // this.orderProduct.totalPrice = this.totalPrice;
                      this.orderProduct.status =
                        this.order.orderLineDtoList[i].status;
                      this.orderProduct.productVariationDtoList = [];
                      this.orderProduct.productVariationDtoList.push(
                        this.productVariation
                      );
  
                      // this.orderProducts.push(this.orderProduct);
                    } else {
                      this.setNotExistingProductVariation(
                        productData,
                        this.productVariation,
                        l
                      );
                    }
                  } else {
                    this.selectedIndex = j;
                    this.productGroupListData[j].productDtoList[
                      k
                    ].productVariationDtoList[l].notes =
                      this.order.orderLineDtoList[i].notes;
  
                    this.productGroupListData[j].productDtoList[
                      k
                    ].productVariationDtoList[l].status =
                      this.order.orderLineDtoList[i].status;
  
                    this.productGroupListData[j].productDtoList[
                      k
                    ].productVariationDtoList[l].unitsInOrder =
                      this.order.orderLineDtoList[i].unitsInOrder;
  
                    this.productGroupListData[j].productDtoList[
                      k
                    ].productVariationDtoList[l].discountedPrice =
                      this.order.orderLineDtoList[i].discountedPrice;
  
                    this.productGroupListData[j].productDtoList[
                      k
                    ].productVariationDtoList[l].discountInPercentage =
                      this.order.orderLineDtoList[i].discountInPercentage;
  
                      this.productGroupListData[j].productDtoList[
                        k
                      ].productVariationDtoList[l].sellUnitPrice =
                        this.order.orderLineDtoList[i].sellUnitPrice;
  
                        this.productGroupListData[j].productDtoList[
                          k
                        ].productVariationDtoList[l].isNewItem = false;
                        this.productGroupListData[j].productDtoList[
                          k
                        ].productVariationDtoList[l].shiftVariation = true;
  
                    this.onProductVariationAdd(
                      this.productGroupListData[j].productDtoList[k],
                      k,
                      this.productGroupListData[j],
                      this.order.businessServiceId,
                      this.selectedIndex,
                      this.productGroupListData[j].productDtoList[k]
                        .productVariationDtoList[l],
                      l,
                      true,
                      true
                    );
                  }
  
                  /// variaton topping and extra
                  for (
                    let line2 = 0;
                    line2 < this.order.orderLineDtoList.length;
                    line2++
                  ) {
                    // topping
                    if (
                      this.order.orderLineDtoList[line2]
                        .toppingProductGroupId ===
                      this.productGroupListData[j].productDtoList[k]
                        .productVariationDtoList[l].toppingProductGroupId
                    ) {
                      if (
                        this.productGroupListData[j].productDtoList[k]
                          .productVariationDtoList[l].addOnProductGroup !=
                          null &&
                        this.productGroupListData[j].productDtoList[k]
                          .productVariationDtoList[l].addOnProductGroup
                          .productDtoList != null &&
                        this.productGroupListData[j].productDtoList[k]
                          .productVariationDtoList[l].addOnProductGroup
                          .productDtoList != undefined &&
                        this.productGroupListData[j].productDtoList[k]
                          .productVariationDtoList[l].addOnProductGroup
                          .productDtoList.length > 0
                      ) {
                        for (
                          let pIndex = 0;
                          pIndex <
                          this.productGroupListData[j].productDtoList[k]
                            .productVariationDtoList[l].addOnProductGroup
                            .productDtoList.length;
                          pIndex++
                        ) {
                          if (
                            this.checkVariationCode(
                              this.productGroupListData[j].productDtoList[k]
                                .productVariationDtoList[l].addOnProductGroup
                                .productDtoList[pIndex].productCode
                            ) ===
                              this.checkVariationCode(
                                this.order.orderLineDtoList[line2].productCode
                              ) &&
                            this.productGroupListData[j].productDtoList[k]
                              .productVariationDtoList[l].addOnProductGroup
                              .productDtoList[pIndex].name ===
                              this.order.orderLineDtoList[line2].name
                          ) {
                            this.productGroupListData[j].productDtoList[
                              k
                            ].productVariationDtoList[
                              l
                            ].addOnProductGroup.productDtoList[
                              pIndex
                            ].unitsInOrder =
                              this.order.orderLineDtoList[line2].unitsInOrder;
  
                            if (
                              this.isProductOutOfStock(
                                this.productGroupListData[j].productDtoList[k]
                                  .productVariationDtoList[l].status
                              ) === true
                            ) {
                              this.productGroupListData[j].productDtoList[
                                k
                              ].productVariationDtoList[
                                l
                              ].addOnProductGroup.productDtoList[
                                pIndex
                              ].status =
                                this.productGroupListData[j].productDtoList[
                                  k
                                ].productVariationDtoList[l].status;
                            } else {
                              this.productGroupListData[j].productDtoList[
                                k
                              ].productVariationDtoList[
                                l
                              ].addOnProductGroup.productDtoList[
                                pIndex
                              ].status =
                                this.order.orderLineDtoList[line2].status;
                            }
                          }
                        }
                      }
                    }
                    // extra
                    if (
                      this.order.orderLineDtoList[line2].extraProductGroupId ===
                      this.productGroupListData[j].productDtoList[k]
                        .productVariationDtoList[l].extraProductGroupId
                    ) {
                      if (
                        this.productGroupListData[j].productDtoList[k]
                          .productVariationDtoList[l].extraProductGroup !=
                          null &&
                        this.productGroupListData[j].productDtoList[k]
                          .productVariationDtoList[l].extraProductGroup
                          .productDtoList != null &&
                        this.productGroupListData[j].productDtoList[k]
                          .productVariationDtoList[l].extraProductGroup
                          .productDtoList != undefined &&
                        this.productGroupListData[j].productDtoList[k]
                          .productVariationDtoList[l].extraProductGroup
                          .productDtoList.length > 0
                      ) {
                        for (
                          let pIndex = 0;
                          pIndex <
                          this.productGroupListData[j].productDtoList[k]
                            .productVariationDtoList[l].extraProductGroup
                            .productDtoList.length;
                          pIndex++
                        ) {
                          if (
                            this.checkVariationCode(
                              this.productGroupListData[j].productDtoList[k]
                                .productVariationDtoList[l].extraProductGroup
                                .productDtoList[pIndex].productCode
                            ) ===
                              this.checkVariationCode(
                                this.order.orderLineDtoList[line2].productCode
                              ) &&
                            this.productGroupListData[j].productDtoList[k]
                              .productVariationDtoList[l].extraProductGroup
                              .productDtoList[pIndex].name ===
                              this.order.orderLineDtoList[line2].name
                          ) {
                            this.productGroupListData[j].productDtoList[
                              k
                            ].productVariationDtoList[
                              l
                            ].extraProductGroup.productDtoList[
                              pIndex
                            ].unitsInOrder =
                              this.order.orderLineDtoList[line2].unitsInOrder;
  
                            if (
                              this.isProductOutOfStock(
                                this.productGroupListData[j].productDtoList[k]
                                  .productVariationDtoList[l].status
                              ) === true
                            ) {
                              this.productGroupListData[j].productDtoList[
                                k
                              ].productVariationDtoList[
                                l
                              ].extraProductGroup.productDtoList[
                                pIndex
                              ].status =
                                this.productGroupListData[j].productDtoList[
                                  k
                                ].productVariationDtoList[l].status;
                            } else {
                              this.productGroupListData[j].productDtoList[
                                k
                              ].productVariationDtoList[
                                l
                              ].extraProductGroup.productDtoList[
                                pIndex
                              ].status =
                                this.order.orderLineDtoList[line2].status;
                            }
                          }
                        }
                      }
                    }
                  }
                  //
                }
              }
            }
          }
        }
      }
  
    }

    
  }
  
  onProductAdd(
    product: any,
    p: number,
    productGroup: any,
    businessServiceId: number,
    i: number,
    isChangeFromInput: boolean,
    isUpdateOrder: boolean
  ) {
    this.isExpend = true;
    
    if (
      this.orderProducts.some((opRoduct) => opRoduct.id === product.id) === true
    ) {
      this.orderProduct = new OrderProduct();
  
      this.orderProduct = this.orderProducts.find(
        (cart) =>
          cart.id === product.id &&
          cart.unitsInOrder === product.unitsInOrder &&
          this.checkStatus(cart.status) === this.checkStatus(product.status)
      );
  
      this.quantity = this.orderProduct.unitsInOrder;
      
      if (product.discountedPrice !== null) {
        this.totalPrice = product.discountedPrice * this.quantity;
      } else {
        this.totalPrice = product.sellUnitPrice * this.quantity;
      }
      this.orderProduct.unitsInOrder = this.quantity;
      this.orderProduct.totalPrice = this.totalPrice;
      this.orderProduct.nonGstItem = productGroup.nonGstItem;
  
      this.orderProducts[this.orderProducts.indexOf(product)] =
        this.orderProduct;
        
    } else {
      this.orderProduct = new OrderProduct();
      this.orderProduct = product;
      this.orderProduct.businessServiceId = businessServiceId;
      this.orderProduct.productGroupName = productGroup.name;
      if (
        product.unitsInOrder != undefined &&
        product.unitsInOrder != null &&
        product.unitsInOrder > 0
      ) {
        if (isChangeFromInput === true) {
        } else {
          this.orderProduct.unitsInOrder = product.unitsInOrder;
        }
      } else {
        if (isChangeFromInput === true) {
        } else {
          this.orderProduct.unitsInOrder = 1;
        }
      }
      if (product.discountedPrice !== null) {
        this.totalPrice = product.discountedPrice * product.unitsInOrder;
      } else {
        this.totalPrice = product.sellUnitPrice * product.unitsInOrder;
      }
  
      this.orderProduct.totalPrice = this.totalPrice;
      this.orderProduct.nonGstItem = productGroup.nonGstItem;
      this.orderProducts.push(this.orderProduct);
    }
  
    this.calculateTaxSlab();
    
    this.changeDetectorRefs.detectChanges();
  }
  
  setNotExistingProductVariation(product, variation, v) {
    this.orderProduct = new OrderProduct();
    this.orderProduct = product;
  
    this.productVariation = new productVariationDtoList();
    this.productVariation = variation;
  
    this.productVariations = [];
  
    this.productVariations = this.orderProduct.productVariationDtoList;
  
    this.productVariations[v] = this.productVariation;
  
    this.orderProduct.productVariationDtoList = this.productVariations;
    this.orderProducts.push(this.orderProduct);
  }
  
  onProductVariationAdd(
    product: any,
    p: number,
    productGroup: any,
    businessServiceId: number,
    i: number,
    variation: any,
    v: number,
    isChangeFromInput: boolean,
    isUpdateOrder: boolean
  ) {
    this.isExpend = true;
    if (
      this.orderProducts.some((opRoduct) => opRoduct.id === product.id) === true
    ) {
      this.orderProduct = new OrderProduct();
  
      this.orderProduct = this.orderProducts.find(
        (cart) =>
          cart.id === product.id &&
          cart.unitsInOrder === product.unitsInOrder &&
          this.checkStatus(cart.status) === this.checkStatus(product.status)
      );
      
      this.productVariations = [];
      this.productVariation = new productVariationDtoList();
  
      this.productVariations = this.orderProduct.productVariationDtoList;
  
      if (
        this.productVariations.some((c) => c.code === variation.code) === true
      ) {
        this.productVariation = this.productVariations.find(
          (list) =>
            list.code === variation.code &&
            list.unitsInOrder === variation.unitsInOrder &&
            this.checkStatus(list.status) === this.checkStatus(variation.status)
        );
  
        this.quantityVariation = this.productVariation.unitsInOrder;
  
        if (isChangeFromInput === false) {
          this.quantityVariation = this.quantityVariation + 1;
        }
  
       
        if(variation.discountInPercentage != null && variation.discountInPercentage >= 0){
          let variationDiscount = (variation.sellUnitPrice * variation.discountInPercentage)/100;
          variation.discountedPrice = variation.sellUnitPrice - variationDiscount;
        } else {
          variation.discountedPrice = null;
        }
        this.productVariation.discountedPrice = variation.discountedPrice;
        
        if (
          this.productVariation.discountedPrice !== null &&
          this.productVariation.discountedPrice >= 0
        ) {
          this.totalPriceVariation =
            this.productVariation.discountedPrice * this.quantityVariation;
        } else {
          this.totalPriceVariation =
            this.productVariation.sellUnitPrice * this.quantityVariation;
        }
  
        this.productVariation.unitsInOrder = this.quantityVariation;
        this.productVariation.totalPrice = this.totalPriceVariation;
  
        this.productVariations[
          this.productVariations.indexOf(this.productVariation)
        ] = this.productVariation;
        this.orderProduct.productVariationDtoList = this.productVariations;
        this.orderProduct.nonGstItem = productGroup.nonGstItem;
        this.orderProducts[this.orderProducts.indexOf(product)] =
          this.orderProduct;
      }
    } else {
      this.orderProduct = new OrderProduct();
      this.orderProduct = product;
      this.orderProduct.productGroupName = productGroup.name;
      this.orderProduct.businessServiceId = businessServiceId;
  
      this.productVariation = new productVariationDtoList();
      this.productVariation = variation;
  
      if(variation.discountInPercentage == null){
        this.productVariation.discountedPrice = null;
      }
  
      if (
        variation.unitsInOrder != undefined ||
        variation.unitsInOrder != null
      ) {
        this.productVariation.unitsInOrder = variation.unitsInOrder;
  
        if (
          this.productVariation.discountedPrice !== null &&
          this.productVariation.discountedPrice !== 0
        ) {
          this.productVariation.totalPrice =
            this.productVariation.discountedPrice *
            this.productVariation.unitsInOrder;
        } else {
          this.productVariation.totalPrice =
            this.productVariation.sellUnitPrice *
            this.productVariation.unitsInOrder;
        }
      } else {
        this.productVariation.unitsInOrder = 1;
        if (
          this.productVariation.discountedPrice !== null &&
          this.productVariation.discountedPrice !== 0
        ) {
          this.productVariation.totalPrice =
            this.productVariation.discountedPrice *
            this.productVariation.unitsInOrder;
        } else {
          this.productVariation.totalPrice =
            this.productVariation.sellUnitPrice *
            this.productVariation.unitsInOrder;
        }
      }
     
      this.productVariations = [];
  
      this.productVariations = this.orderProduct.productVariationDtoList;
  
      this.productVariations[v] = this.productVariation;
  
      this.orderProduct.productVariationDtoList = this.productVariations;
      this.orderProduct.nonGstItem = productGroup.nonGstItem;
      this.orderProducts.push(this.orderProduct);
    }
  
    this.calculateQuantity();
    this.calculateTaxSlab();
  
  }
  
  calculateProductDistount() {
    this.totalProductDiscount = 0;
    for (let i = 0; i < this.orderProducts.length; i++) {
      if (
        this.orderProducts[i].discountedPrice != null
      ) {
        this.totalProductDiscount =
          this.totalProductDiscount +
          (this.orderProducts[i].sellUnitPrice -
            this.orderProducts[i].discountedPrice) *
            this.orderProducts[i].unitsInOrder;
      } else {
      }
  
      if (this.orderProducts[i].productVariationDtoList != undefined) {
        for (
          let j = 0;
          j < this.orderProducts[i].productVariationDtoList.length;
          j++
        ) {
          if (
            
            this.orderProducts[i].productVariationDtoList[j].discountedPrice !=
              null
          ) {
            this.totalProductDiscount =
              this.totalProductDiscount +
              (this.orderProducts[i].productVariationDtoList[j].sellUnitPrice -
                this.orderProducts[i].productVariationDtoList[j]
                  .discountedPrice) *
                this.orderProducts[i].productVariationDtoList[j].unitsInOrder;
          }
        }
      }
    }
  }
  calculateQuantity() {
    this.totalQuantity = 0;
  
    for (let i = 0; i < this.orderProducts.length; i++) {
      if (
        this.orderProducts[i].productVariationDtoList != null &&
        this.orderProducts[i].productVariationDtoList != undefined &&
        this.orderProducts[i].productVariationDtoList.length > 0
      ) {
        for (
          let j = 0;
          j < this.orderProducts[i].productVariationDtoList.length;
          j++
        ) {
          if (
            this.orderProducts[i].productVariationDtoList[j].totalPrice !=
              undefined &&
            this.orderProducts[i].productVariationDtoList[j].totalPrice !=
              null &&
            this.orderProducts[i].productVariationDtoList[j].totalPrice >= 0
          ) {
            this.totalQuantity = this.totalQuantity + 1;
          }
        }
      } else if (
        this.orderProducts[i].unitsInOrder != undefined &&
        this.orderProducts[i].unitsInOrder != null &&
        this.orderProducts[i].unitsInOrder > 0
      ) {
        this.totalQuantity = this.totalQuantity + 1;
      }
  
    }
    return this.totalQuantity;
  }
  
  calculatePrice() {
    this.total = 0;
    this.nonGstTotalAmount = 0;
    for (let i = 0; i < this.orderProducts.length; i++) {
      if (
        this.orderProducts[i].productVariationDtoList != null &&
        this.orderProducts[i].productVariationDtoList != undefined &&
        this.orderProducts[i].productVariationDtoList.length > 0
      ) {
        for (
          let j = 0;
          j < this.orderProducts[i].productVariationDtoList.length;
          j++
        ) {
          if (
            this.orderProducts[i].productVariationDtoList[j].totalPrice !=
              null &&
            this.orderProducts[i].productVariationDtoList[j].totalPrice > 0 &&
            this.orderProducts[i].productVariationDtoList[j].shiftVariation == true &&
            this.isPriceAddedtoTotal(
              this.orderProducts[i].productVariationDtoList[j].status
            ) === true
          ) {
            this.total =
              this.total +
              this.orderProducts[i].productVariationDtoList[j].totalPrice;
  
            // calculate non taxable product
            if (this.orderProducts[i].nonGstItem == true) {
              this.nonGstTotalAmount = this.nonGstTotalAmount + this.orderProducts[i].productVariationDtoList[j].totalPrice;
            }
            // for topping
            if (
              this.orderProducts[i].productVariationDtoList[j] != null &&
              this.orderProducts[i].productVariationDtoList[j] != undefined &&
              this.orderProducts[i].productVariationDtoList[j]
                .addOnProductGroup != null &&
              this.orderProducts[i].productVariationDtoList[j]
                .addOnProductGroup != undefined &&
              this.orderProducts[i].productVariationDtoList[j].addOnProductGroup
                .productDtoList != null &&
              this.orderProducts[i].productVariationDtoList[j].addOnProductGroup
                .productDtoList != undefined &&
              this.orderProducts[i].productVariationDtoList[j].addOnProductGroup
                .productDtoList.length > 0
            ) {
              for (
                let ex = 0;
                ex <
                this.orderProducts[i].productVariationDtoList[j]
                  .addOnProductGroup.productDtoList.length;
                ex++
              ) {
                if (
                  this.isPriceAddedtoTotal(
                    this.orderProducts[i].productVariationDtoList[j]
                      .addOnProductGroup.productDtoList[ex].status
                  ) === true
                ) {
                  if (
                    this.orderProducts[i].productVariationDtoList[j]
                      .addOnProductGroup.productDtoList[ex].discountedPrice !==
                      null &&
                    this.orderProducts[i].productVariationDtoList[j]
                      .addOnProductGroup.productDtoList[ex].discountedPrice !==
                      0
                  ) {
                    this.total =
                      this.total +
                      this.checkPrice(
                        this.orderProducts[i].productVariationDtoList[j]
                          .addOnProductGroup.productDtoList[ex].discountedPrice
                      ) *
                        this.checkPrice(
                          this.orderProducts[i].productVariationDtoList[j]
                            .addOnProductGroup.productDtoList[ex].unitsInOrder
                        );
                  } else {
                    this.total =
                      this.total +
                      this.checkPrice(
                        this.orderProducts[i].productVariationDtoList[j]
                          .addOnProductGroup.productDtoList[ex].sellUnitPrice
                      ) *
                        this.checkPrice(
                          this.orderProducts[i].productVariationDtoList[j]
                            .addOnProductGroup.productDtoList[ex].unitsInOrder
                        );
                  }
                }
              }
            }
  
            // for extra
  
            if (
              this.orderProducts[i].productVariationDtoList[j] != null &&
              this.orderProducts[i].productVariationDtoList[j] != undefined &&
              this.orderProducts[i].productVariationDtoList[j]
                .extraProductGroup != null &&
              this.orderProducts[i].productVariationDtoList[j]
                .extraProductGroup != undefined &&
              this.orderProducts[i].productVariationDtoList[j].extraProductGroup
                .productDtoList != null &&
              this.orderProducts[i].productVariationDtoList[j].extraProductGroup
                .productDtoList != undefined &&
              this.orderProducts[i].productVariationDtoList[j].extraProductGroup
                .productDtoList.length > 0
            ) {
              for (
                let ex = 0;
                ex <
                this.orderProducts[i].productVariationDtoList[j]
                  .extraProductGroup.productDtoList.length;
                ex++
              ) {
                if (
                  this.isPriceAddedtoTotal(
                    this.orderProducts[i].productVariationDtoList[j]
                      .extraProductGroup.productDtoList[ex].status
                  ) === true
                ) {
                  if (
                    this.orderProducts[i].productVariationDtoList[j]
                      .extraProductGroup.productDtoList[ex].discountedPrice !==
                      null &&
                    this.orderProducts[i].productVariationDtoList[j]
                      .extraProductGroup.productDtoList[ex].discountedPrice !==
                      0
                  ) {
                    this.total =
                      this.total +
                      this.checkPrice(
                        this.orderProducts[i].productVariationDtoList[j]
                          .extraProductGroup.productDtoList[ex].discountedPrice
                      ) *
                        this.checkPrice(
                          this.orderProducts[i].productVariationDtoList[j]
                            .extraProductGroup.productDtoList[ex].unitsInOrder
                        );
                  } else {
                    this.total =
                      this.total +
                      this.checkPrice(
                        this.orderProducts[i].productVariationDtoList[j]
                          .extraProductGroup.productDtoList[ex].sellUnitPrice
                      ) *
                        this.checkPrice(
                          this.orderProducts[i].productVariationDtoList[j]
                            .extraProductGroup.productDtoList[ex].unitsInOrder
                        );
                  }
                }
              }
            }
  
            if (
              this.orderProducts[i].productVariationDtoList[j]
                .extraUnitInOrder != null &&
              this.orderProducts[i].productVariationDtoList[j]
                .extraUnitInOrder != undefined
            ) {
              this.total =
                this.total +
                this.checkPrice(
                  this.orderProducts[i].productVariationDtoList[j]
                    .extraUnitInOrder
                ) *
                  this.checkPrice(
                    this.orderProducts[i].productVariationDtoList[j]
                      .sellUnitPrice
                  );
            }
  
            if (
              this.orderProducts[i].productVariationDtoList[j]
                .extraUnitInOrder != null &&
              this.orderProducts[i].productVariationDtoList[j]
                .extraUnitInOrder != undefined
            ) {
              if (
                this.orderProducts[i].productVariationDtoList[j]
                  .discountedPrice !== null &&
                this.orderProducts[i].productVariationDtoList[j]
                  .discountedPrice !== 0
              ) {
                this.total =
                  this.total +
                  this.checkPrice(
                    this.orderProducts[i].productVariationDtoList[j]
                      .extraUnitInOrder
                  ) *
                    this.checkPrice(
                      this.orderProducts[i].productVariationDtoList[j]
                        .discountedPrice
                    );
              } else {
                this.total =
                  this.total +
                  this.checkPrice(
                    this.orderProducts[i].productVariationDtoList[j]
                      .extraUnitInOrder
                  ) *
                    this.checkPrice(
                      this.orderProducts[i].productVariationDtoList[j]
                        .sellUnitPrice
                    );
              }
            }
          }
        }
      } else if (
        this.orderProducts[i].unitsInOrder != null &&
        this.orderProducts[i].unitsInOrder > 0 &&
        this.isPriceAddedtoTotal(this.orderProducts[i].status) === true
      ) {
        this.total = this.total + this.orderProducts[i].totalPrice;
  
        // calculate non taxable product
        if(this.orderProducts[i].nonGstItem == true){
          this.nonGstTotalAmount = this.nonGstTotalAmount + this.orderProducts[i].totalPrice;
        }
        // for topping
  
        if (
          this.orderProducts[i] != null &&
          this.orderProducts[i] != undefined &&
          this.orderProducts[i].addOnProductGroup != null &&
          this.orderProducts[i].addOnProductGroup != undefined &&
          this.orderProducts[i].addOnProductGroup.productDtoList != null &&
          this.orderProducts[i].addOnProductGroup.productDtoList != undefined &&
          this.orderProducts[i].addOnProductGroup.productDtoList.length > 0
        ) {
          for (
            let tp = 0;
            tp < this.orderProducts[i].addOnProductGroup.productDtoList.length;
            tp++
          ) {
            if (
              this.isPriceAddedtoTotal(
                this.orderProducts[i].addOnProductGroup.productDtoList[tp]
                  .status
              ) === true
            ) {
              if (
                this.orderProducts[i].addOnProductGroup.productDtoList[tp]
                  .discountedPrice !== null &&
                this.orderProducts[i].addOnProductGroup.productDtoList[tp]
                  .discountedPrice !== 0
              ) {
                this.total =
                  this.total +
                  this.orderProducts[i].addOnProductGroup.productDtoList[tp]
                    .discountedPrice *
                    this.orderProducts[i].addOnProductGroup.productDtoList[tp]
                      .unitsInOrder;
              } else {
                this.total =
                  this.total +
                  this.orderProducts[i].addOnProductGroup.productDtoList[tp]
                    .sellUnitPrice *
                    this.orderProducts[i].addOnProductGroup.productDtoList[tp]
                      .unitsInOrder;
              }
            }
          }
        }
  
        // for extra
  
        if (
          this.orderProducts[i] != null &&
          this.orderProducts[i] != undefined &&
          this.orderProducts[i].extraProductGroupDto != null &&
          this.orderProducts[i].extraProductGroupDto != undefined &&
          this.orderProducts[i].extraProductGroupDto.productDtoList != null &&
          this.orderProducts[i].extraProductGroupDto.productDtoList !=
            undefined &&
          this.orderProducts[i].extraProductGroupDto.productDtoList.length > 0
        ) {
          for (
            let ex = 0;
            ex <
            this.orderProducts[i].extraProductGroupDto.productDtoList.length;
            ex++
          ) {
            if (
              this.isPriceAddedtoTotal(
                this.orderProducts[i].extraProductGroupDto.productDtoList[ex]
                  .status
              ) === true
            ) {
              if (
                this.orderProducts[i].extraProductGroupDto.productDtoList[ex]
                  .discountedPrice !== null &&
                this.orderProducts[i].extraProductGroupDto.productDtoList[ex]
                  .discountedPrice !== 0
              ) {
                this.total =
                  this.total +
                  this.orderProducts[i].extraProductGroupDto.productDtoList[ex]
                    .discountedPrice *
                    this.orderProducts[i].extraProductGroupDto.productDtoList[
                      ex
                    ].unitsInOrder;
              } else {
                this.total =
                  this.total +
                  this.orderProducts[i].extraProductGroupDto.productDtoList[ex]
                    .sellUnitPrice *
                    this.orderProducts[i].extraProductGroupDto.productDtoList[
                      ex
                    ].unitsInOrder;
              }
            }
          }
        }
  
        if (
          this.orderProducts[i].extraUnitInOrder != null &&
          this.orderProducts[i].extraUnitInOrder != undefined
        ) {
          if (
            this.orderProducts[i].discountedPrice !== null &&
            this.orderProducts[i].discountedPrice !== 0
          ) {
            this.total =
              this.total +
              this.orderProducts[i].extraUnitInOrder *
                this.orderProducts[i].discountedPrice;
          } else {
            this.total =
              this.total +
              this.orderProducts[i].extraUnitInOrder *
                this.orderProducts[i].sellUnitPrice;
          }
        } 
        
      }
    }
  
    if (
      this.order != undefined && this.order != null &&
      (this.order.discountAmount === undefined ||
      this.order.discountAmount === null)
    ) {
      this.order.discountAmount = 0;
    }
  
  
    this.order.beforeTaxAmount = this.total;
    this.subTotalAmount = this.total;
    this.order.discountAmount = Math.round(
      (this.discountPercentage * this.total) / 100
    );
    this.order.discountPercentage = this.discountPercentage;
  if (this.order.serviceChargeAmount != null && this.order.serviceChargeAmount != undefined && this.order.serviceChargeAmount >0 ) {
  this.isIndeterminate = true;
  this.order.serviceChargeAmount = this.order.serviceChargeAmount;
  }else{
  this.order.serviceChargeAmount = 0;
  }
   
  if(this.order.serviceChargeName != null && this.order.serviceChargeName != undefined){
  let serviceChargePercentage = 0;
  if (
    this.order.serviceChargePercentage != null &&
    this.order.serviceChargePercentage != undefined
  ) {
    serviceChargePercentage = this.order.serviceChargePercentage;
  }
  
  this.order.serviceChargeAmount = Number(
    (this.total * serviceChargePercentage) / 100
  );
  }
  this.order.serviceChargeAmount = Math.round(this.order.serviceChargeAmount);
  
    this.subTotalAmount =
      this.total +
      this.order.serviceChargeAmount -
      this.order.discountAmount
    this.calculateTaxSlab();
  
    if (this.businessService.priceInclusiveOfTax == true) {
      if (
        this.order.deliveryChargeAmount != null &&
        this.order.deliveryChargeAmount != undefined
      ) {
        this.order.totalOrderAmount =
          this.total +
          this.order.deliveryChargeAmount +
          this.order.serviceChargeAmount -
          this.order.discountAmount;
      } else {
        this.order.totalOrderAmount =
          this.total +
          this.order.serviceChargeAmount -
          this.order.discountAmount;
        this.payment.deliveryChargeAmount = 0;
        this.paymentReservation.deliveryChargeAmount = 0;
      }
    } else {
      if (
        this.order.deliveryChargeAmount != null &&
        this.order.deliveryChargeAmount != undefined
      ) {
        this.order.totalOrderAmount =
          this.total +
          this.order.deliveryChargeAmount +
          this.order.taxAmount +
          this.order.serviceChargeAmount -
          this.order.discountAmount;
      } else {
        this.order.totalOrderAmount =
          this.total +
          this.order.taxAmount +
          this.order.serviceChargeAmount -
          this.order.discountAmount;
        this.payment.deliveryChargeAmount = 0;
        this.paymentReservation.deliveryChargeAmount = 0;
      }
    }
  
    this.order.totalOrderAmount =
      this.order.totalOrderAmount - this.order.refundAmount;
  
    if (
      this.order.deliveryMethod != null &&
      this.order.deliveryMethod != undefined &&
      this.order.deliveryMethod != "Room Order"
    ) {
      if (
        this.order.bookOneOrderId != null &&
        this.order.bookOneOrderId != undefined &&
        this.order.totalOrderAmount != null &&
        this.order.totalOrderAmount != undefined &&
        this.order.totalOrderAmount > 0
      ) {
        if (this.outStandingAmount() >= 0 || this.getPaidAmount() > 0) {
          this.isPaidOrder = true;
        } else {
          this.isPaidOrder = false;
        }
      }
    }
  
    this.subTotalAmount = Math.round(this.subTotalAmount);
    this.nonGstTotalAmount = Math.round(this.nonGstTotalAmount);
    this.order.totalOrderAmount = Math.round(this.order.totalOrderAmount);
    
    this.calculateProductDistount();
    return this.total;
  }
  
  calculateTaxSlab() {
    this.taxDetailsSelected = this.order.taxDetails;
    this.totalSplitTax = [];
    this.order.taxAmount = 0;
    let orderTaxAmount = 0;
    if (this.taxDetailsSelected.length > 0) {
      for (let i = 0; i < this.taxDetailsSelected.length; i++) {
        let taxPercentage = this.token.getTaxPercentageByTaxDetail(
          this.subTotalAmount,
          this.taxDetailsSelected[i]
        );
        if(this.order.discountPercentage != null && this.order.discountPercentage == 100){
          taxPercentage = 0;
        }
  
        if (taxPercentage != null && taxPercentage != undefined) {
          let totalTaxAmount = 
            (this.subTotalAmount - this.order.serviceChargeAmount - this.nonGstTotalAmount) * (taxPercentage / 100)
          
          orderTaxAmount = orderTaxAmount + totalTaxAmount;
  
          let tax: SplitTaxDTO = {
            name: this.taxDetailsSelected[i].name,
            percentage: taxPercentage,
            taxAmount: totalTaxAmount,
          };
          this.taxDetailsSelected[i].percentage = taxPercentage;
          this.taxDetailsSelected[i].taxAmount = totalTaxAmount;
          this.taxDetailsSelected[i].taxableAmount =
            this.total - this.order.discountAmount;
          this.totalSplitTax.push(tax);
        } else {
          this.taxDetailsSelected[i].taxAmount = 0;
        }
      }
    }
    this.order.taxAmount = Math.round(orderTaxAmount);
    this.order.taxDetails = this.taxDetailsSelected;
  }
  
  checkPrice(amount: any) {
    if (amount != null && amount != undefined) {
      return amount;
    } else {
      return 0;
    }
  }
  
  outStandingAmount() {
    return this.getPaidAmount() - this.order.totalOrderAmount;
  }
  
  getPaidAmount() {
    let sum = 0;
    for (let i = 0; i < this.paymentsPaid.length; i++) {
      sum = sum + this.paymentsPaid[i].transactionAmount;
    }
  
    return sum;
  }
  
  
  
  isPriceAddedtoTotal(status: string) {
    if (
      status === undefined ||
      status === null ||
      status === this.Available_Status ||
      status === this.Cooking_Status ||
      status === this.ServedStatus ||
      status === this.ReadytoServe_Status ||
      status === this.PaidButOutOfStock_Status ||
      status === this.CompletedStatus
    ) {
      return true;
    } else {
      return false;
    }
  }
  
  checkStatus(status) {
    if (status === null || status === undefined || status === "") {
      return "Available";
    }
  
    return status;
  }
  
  checkVariationCode(code) {
    if (code != null && code != undefined) {
      return code;
    } else {
      return "";
    }
  }
  
  isProductOutOfStock(status: string) {
    if (
      (status != undefined &&
        status != null &&
        status === this.PaidButOutOfStock_Status) ||
      (status != undefined &&
        status != null &&
        status === this.OutOfStock_Status)
    ) {
      return true;
    } else {
      return false;
    }
  }
  
  checkOrderLine(orderLine, name, productCode) {
    let searchResult;
    let line = orderLine;
    line = line.filter((item) => {
      searchResult =
        item.name === name &&
        item.status === "Completed" &&
        item.productCode === productCode;
  
      return searchResult;
    });
  
    if (line != null && line != undefined) {
      return line.length;
    } else {
      return 0;
    }
  }
  async getBookingById() {
    try {
        const response1 = await this.bookingService.findBooking(this.order.bookingId).toPromise();
        this.booking = response1.body;
        this.getPaymentByRevId(this.booking.propertyReservationNumber);
    } catch (error) {
        console.error("Error:", error);
        this.loader = false;
    }
  }
  
  
  
  submitOrder() {
    if (this.newSelectedProducts.length > 0) {
      this.newSelectedProducts.forEach((product) => {
        let productExists = false;
    
        this.orderProducts.forEach((orderProduct) => {
          if (orderProduct.productCode === product.productCode) {
            orderProduct.unitsInOrder += product.unitsInOrder;
            if (orderProduct.discountedPrice != null && orderProduct.discountedPrice > 0) {
              orderProduct.totalPrice = orderProduct.discountedPrice * orderProduct.unitsInOrder;
            } else {
              orderProduct.totalPrice = orderProduct.sellUnitPrice * orderProduct.unitsInOrder;
            }
            // Check if the product variation exists in the order product's variation list
            product.productVariationDtoList.forEach((variation) => {
              let variationExists = false;
    
              orderProduct.productVariationDtoList.forEach((orderVariation) => {
                if (orderVariation.code === variation.code) {
                  orderVariation.unitsInOrder += variation.unitsInOrder;
                  if (orderVariation.discountedPrice != null && orderVariation.discountedPrice > 0) {
                    orderVariation.totalPrice = orderVariation.discountedPrice * orderVariation.unitsInOrder;
                  } else {
                    orderVariation.totalPrice = orderVariation.sellUnitPrice * orderVariation.unitsInOrder;
                  }
                  variationExists = true; // Mark as found
                }
              });
    
              // If the variation doesn't exist in the orderProduct's variation list, add it
              if (!variationExists) {
                orderProduct.productVariationDtoList.push(variation);
              }
            });
    
            productExists = true; // Mark the product as found
          }
        });
    
        // If the product doesn't exist in orderProducts, add it with all its variations
        if (!productExists) {
          this.orderProducts.push(product);
        }
      });
    }
    
    // this.orderProductSelectedToShiftList = this.newSelectedProducts;
    
    this.orderSelectedProducts = [];
    for (let i = 0; i < this.orderProducts.length; i++) {
      if (
        this.orderProducts[i].productVariationDtoList != null &&
        this.orderProducts[i].productVariationDtoList != undefined &&
        this.orderProducts[i].productVariationDtoList.length > 0
      ) {
        this.productVariationSelected = [];
        for (
          let j = 0;
          j < this.orderProducts[i].productVariationDtoList.length;
          j++
        ) {
          if (
            this.orderProducts[i].productVariationDtoList[j].totalPrice !=
              undefined &&
            this.orderProducts[i].productVariationDtoList[j].totalPrice !=
              null &&
            this.orderProducts[i].productVariationDtoList[j].totalPrice >= 0
          ) {
            // for variation
            if (
              this.orderProducts[i].productVariationDtoList[j]
                .addOnProductGroup != undefined &&
              this.orderProducts[i].productVariationDtoList[j]
                .addOnProductGroup != null &&
              this.orderProducts[i].productVariationDtoList[j].addOnProductGroup
                .productDtoList != undefined &&
              this.orderProducts[i].productVariationDtoList[j].addOnProductGroup
                .productDtoList != null &&
              this.orderProducts[i].productVariationDtoList[j].addOnProductGroup
                .productDtoList.length > 0
            ) {
              // variation topping
              let productNote = "";
              for (
                let ap2 = 0;
                ap2 <
                this.orderProducts[i].productVariationDtoList[j]
                  .addOnProductGroup.productDtoList.length;
                ap2++
              ) {
                if (
                  this.orderProducts[i].productVariationDtoList[j]
                    .addOnProductGroup.productDtoList[ap2].unitsInOrder !=
                    null &&
                  this.orderProducts[i].productVariationDtoList[j]
                    .addOnProductGroup.productDtoList[ap2].unitsInOrder > 0
                ) {
                  productNote =
                    productNote +
                    this.orderProducts[i].productVariationDtoList[j]
                      .addOnProductGroup.productDtoList[ap2].name +
                    " Unit:" +
                    this.orderProducts[i].productVariationDtoList[j]
                      .addOnProductGroup.productDtoList[ap2].unitsInOrder +
                    ".";

                  this.orderProductSelected = new OrderProduct();
                  this.orderProductSelected =
                    this.orderProducts[i].productVariationDtoList[
                      j
                    ].addOnProductGroup.productDtoList[ap2];

                  this.orderProductSelected.extraProductGroupId = null;
                  this.orderProductSelected.toppingProductGroupId =
                    this.orderProducts[i].productVariationDtoList[
                      j
                    ].addOnProductGroup.id;

                  this.orderSelectedProducts.push(this.orderProductSelected);
                }
              }
              this.orderProductSelected = new OrderProduct();
              this.orderProductSelected =
                this.orderProducts[i].productVariationDtoList[j];
              this.orderProductSelected.notes = productNote;
              this.orderProductSelected.extraProductGroupId = null;
              this.orderProductSelected.toppingProductGroupId = null;

             
                this.orderSelectedProducts.push(this.orderProductSelected);
              
              
            } else {
              this.orderProductSelected = new OrderProduct();
              this.orderProductSelected =
                this.orderProducts[i].productVariationDtoList[j];
              this.orderProductSelected.extraProductGroupId = null;
              this.orderProductSelected.toppingProductGroupId = null;
              
                this.productVariationSelected.push(this.orderProductSelected);
              
              
            }

            if (
              this.orderProducts[i].productVariationDtoList[j]
                .extraProductGroup != undefined &&
              this.orderProducts[i].productVariationDtoList[j]
                .extraProductGroup != null &&
              this.orderProducts[i].productVariationDtoList[j].extraProductGroup
                .productDtoList != undefined &&
              this.orderProducts[i].productVariationDtoList[j].extraProductGroup
                .productDtoList != null &&
              this.orderProducts[i].productVariationDtoList[j].extraProductGroup
                .productDtoList.length > 0
            ) {
              // variation for extra
              for (
                let ep2 = 0;
                ep2 <
                this.orderProducts[i].productVariationDtoList[j]
                  .extraProductGroup.productDtoList.length;
                ep2++
              ) {
                if (
                  this.orderProducts[i].productVariationDtoList[j]
                    .extraProductGroup.productDtoList[ep2].unitsInOrder !=
                    null &&
                  this.orderProducts[i].productVariationDtoList[j]
                    .extraProductGroup.productDtoList[ep2].unitsInOrder > 0
                ) {
                  this.orderProductSelected = new OrderProduct();
                  this.orderProductSelected =
                    this.orderProducts[i].productVariationDtoList[
                      j
                    ].extraProductGroup.productDtoList[ep2];

                  this.orderProductSelected.extraProductGroupId =
                    this.orderProducts[i].productVariationDtoList[
                      j
                    ].extraProductGroup.id;
                  this.orderProductSelected.toppingProductGroupId = null;

                  this.orderSelectedProducts.push(this.orderProductSelected);
                }
              }
            }

            if (
              this.orderProducts[i].productVariationDtoList[j]
                .extraUnitInOrder != null &&
              this.orderProducts[i].productVariationDtoList[j]
                .extraUnitInOrder != undefined &&
              this.orderProducts[i].productVariationDtoList[j]
                .extraUnitInOrder > 0
            ) {
              this.productVariationSelected.push(
                // this.getVariationByExtraUnitInOrder(
                //   this.orderProducts[i].productVariationDtoList[j]
                // )
              );
              //this.orderProducts[i].productVariationDtoList[j].extraUnitInOrder = undefined;
            }
          }
        }

        if (this.productVariationSelected.length > 0) {
          this.orderProducts[i].productVariationDtoList =
            this.productVariationSelected;
          this.orderSelectedProducts.push(this.orderProducts[i]);
        }
      } else if (
        this.orderProducts[i].unitsInOrder != undefined &&
        this.orderProducts[i].unitsInOrder != null &&
        this.orderProducts[i].unitsInOrder > 0
      ) {
        if (
          this.orderProducts[i].addOnProductGroup != undefined &&
          this.orderProducts[i].addOnProductGroup != null &&
          this.orderProducts[i].addOnProductGroup.productDtoList != null &&
          this.orderProducts[i].addOnProductGroup.productDtoList != undefined &&
          this.orderProducts[i].addOnProductGroup.productDtoList.length > 0
        ) {
          // product topping
          let productNote = "";
          for (
            let ap1 = 0;
            ap1 < this.orderProducts[i].addOnProductGroup.productDtoList.length;
            ap1++
          ) {
            if (
              this.orderProducts[i].addOnProductGroup.productDtoList[ap1]
                .unitsInOrder != null &&
              this.orderProducts[i].addOnProductGroup.productDtoList[ap1]
                .unitsInOrder > 0
            ) {
              productNote =
                productNote +
                this.orderProducts[i].addOnProductGroup.productDtoList[ap1]
                  .name +
                " Unit:" +
                this.orderProducts[i].addOnProductGroup.productDtoList[ap1]
                  .unitsInOrder +
                ".";

              this.orderProductSelected = new OrderProduct();
              this.orderProductSelected =
                this.orderProducts[i].addOnProductGroup.productDtoList[ap1];

              this.orderProductSelected.extraProductGroupId = null;
              this.orderProductSelected.toppingProductGroupId =
                this.orderProducts[i].addOnProductGroup.id;

              this.orderSelectedProducts.push(this.orderProductSelected);
            }
          }
          this.orderProductSelected = new OrderProduct();
          this.orderProductSelected = this.orderProducts[i];
          this.orderProductSelected.notes = productNote; //
          this.orderProductSelected.extraProductGroupId = null;
          this.orderProductSelected.toppingProductGroupId = null;

          this.orderSelectedProducts.push(this.orderProductSelected);
        } else {
          this.orderProductSelected = new OrderProduct();
          this.orderProductSelected = this.orderProducts[i];
          this.orderProductSelected.extraProductGroupId = null;
          this.orderProductSelected.toppingProductGroupId = null;

           this.orderSelectedProducts.push(this.orderProductSelected);
        }

        if (
          this.orderProducts[i].extraProductGroupDto != undefined &&
          this.orderProducts[i].extraProductGroupDto != null &&
          this.orderProducts[i].extraProductGroupDto.productDtoList != null &&
          this.orderProducts[i].extraProductGroupDto.productDtoList !=
            undefined &&
          this.orderProducts[i].extraProductGroupDto.productDtoList.length > 0
        ) {
          // product extra
          for (
            let ep1 = 0;
            ep1 <
            this.orderProducts[i].extraProductGroupDto.productDtoList.length;
            ep1++
          ) {
            if (
              this.orderProducts[i].extraProductGroupDto.productDtoList[ep1]
                .unitsInOrder != null &&
              this.orderProducts[i].extraProductGroupDto.productDtoList[ep1]
                .unitsInOrder > 0
            ) {
              this.orderProductSelected = new OrderProduct();
              this.orderProductSelected =
                this.orderProducts[i].extraProductGroupDto.productDtoList[ep1];
              this.orderProductSelected.extraProductGroupId =
                this.orderProducts[i].extraProductGroupDto.id;
              this.orderProductSelected.toppingProductGroupId = null;

              this.orderSelectedProducts.push(this.orderProductSelected);
            }
          }
        }
        if (
          this.orderProducts[i].extraUnitInOrder != null &&
          this.orderProducts[i].extraUnitInOrder != undefined &&
          this.orderProducts[i].extraUnitInOrder > 0
        ) {
          this.orderSelectedProducts.push(
            // this.getProductByExtraUnitInOrder(this.orderProducts[i])
          );
          // this.orderProducts[i].extraUnitInOrder = undefined;
        }
      }
    }
   
   
    this.calculatePrice();
    this.order.productDtoList = this.orderSelectedProducts;
    this.calculateTaxSlab();
    

    if (this.paymentsNotPaid != null && this.paymentsNotPaid != undefined && this.paymentsNotPaid.length > 0)
    {
      this.payment = this.paymentsNotPaid[0];
    }

    this.order.createdBy = this.order.operatorName;
    let fname, lname;
    if (this.order.firstName != null && this.order.firstName != undefined) {
      fname = this.order.firstName;
    } else {
      fname = "";
    }

    if (this.order.lastName != null && this.order.lastName != undefined) {
      lname = this.order.lastName;
    } else {
      lname = "";
    }
    this.order.customerName = fname + " " + lname;

    if (
      this.order.externalSite === null ||
      this.order.externalSite === undefined
    ) {
      this.order.externalSite = "POS";
    }



    if(this.order.deliveryChargeAmount != null || this.order.deliveryChargeAmount != undefined){
      this.payment.deliveryChargeAmount = this.order.deliveryChargeAmount;
    }
    

    if (this.order.deliveryMethod == "Room Order") {
      this.payment.businessServiceName = "Restaurants";
      this.payment.referenceNumber = this.booking?.propertyReservationNumber;
      if(this.order.id == null && this.order.discountPercentage == 100){
        this.order.complimentary = true;
        this.payment.description = "(Complimentary)";
      } else if (this.order.id != null && this.order.discountPercentage == 100) {
        this.order.complimentary = true;
        this.payment.description = this.order.bookOneOrderId+"\n(Complimentary)";
      } else {
        this.payment.description = this.order.bookOneOrderId;
      }

      if(this.payment.status === "NotPaid"){
          this.payment.paymentMode = "BillToRoom"
      }
      if(this.order.customerName != null){
        this.payment.customerName = this.order.customerName;
      }
      if (this.order.roomNo != null && this.order.roomNo != undefined) {
        this.payment.roomNumber = this.order.roomNo;
      }
    } else {
      this.payment.businessServiceName = this.businessService.name;

      if (this.order.id != null && this.order.id != undefined) {
        this.payment.referenceNumber = this.order.bookOneOrderId;
      }
      if (this.payment.status === "NotPaid") {
        this.payment.paymentMode = "Cash"
      }
      this.payment.roomNumber = null;
      if(this.order.discountPercentage == 100){
        this.order.complimentary = true;
        this.payment.description = "(Complimentary)";
      } else if (this.order.id != null && this.order.discountPercentage == 100) {
        this.order.complimentary = true;
        this.payment.description = this.order.bookOneOrderId+"\n(Complimentary)";
      } else {
        this.payment.description = this.order.bookOneOrderId;
      }
    }

      this.payment.lastModifiedBy = this.PosUserName;
      this.payment.lastModifiedDate = this.datepipe.transform(new Date(), "yyyy-MM-dd");
    

    this.payment.email = this.order.email;
    this.payment.firstName = this.order.firstName;
    this.payment.lastName = this.order.lastName;
    this.payment.netReceivableAmount = this.subTotalAmount;
    this.payment.propertyId = this.order.propertyId;
    this.payment.taxAmount = this.order.taxAmount;
    this.payment.counterName = this.order.counterName;
    this.payment.counterNumber = this.order.counterNumber;
    this.payment.operatorName = this.order.operatorName;

    this.payment.serviceChargeAmount = this.order.serviceChargeAmount;

    this.payment.amount = this.getOrderAmount();
      this.payment.transactionChargeAmount =  this.getOrderAmount();
      this.payment.transactionAmount = this.getOrderAmount();
      this.payment.status = "NotPaid";
    this.order.paidAmount = this.getPaidAmount();

    this.order.outstandingAmount = this.order.totalOrderAmount - this.getPaidAmount();
   
      if( this.getOrderAmount() >= 0 || this.order.discountPercentage == 100)
      {
        this.orderAndPaymentCreate();
      }
      else
      {
        if (this.paymentsNotPaid != null && this.paymentsNotPaid != undefined)
        {
          for (let i = 1; i < this.paymentsNotPaid.length; i++)
          {
            this.deletepayment(this.paymentsNotPaid[i].id);
          }
        }


        this.book();
      }

    
  }
    book() {
      if (
        this.order.id != null &&
        this.order.id != undefined &&
        this.order.id > 0 &&
        this.order.deliveryMethod === "Room Order"
      ) {
        this.roomOrder();
      } else {
        this.createOrder();
      }
    }
  
    async createOrder() {
      this.loader = true;
      try {
          if (this.order.email === "") {
              this.order.email = null;
          }
          if (this.order.mobile === "") {
              this.order.mobile = null;
          }
          if (this.order.id === null || this.order.id === undefined) {
              this.order.kotPrintCount = 0;
          }
          const data = await this.reservationService.order(this.order).toPromise();
          this.createAuditReport(this.prevOrder, this.order, AUDIT_ORDER_ITEM_SHIFT);
          if (data.status == 200) {
            this.loader = false;
            this.balanceCalculate(this.order.id);
          }
  
              this.orderService.getOrderByOrderId(this.order.id).subscribe(
                (data) => {
                  this.order = data.body;
                  this.CreateOrUpdateKotAndConfirmOrder(this.order.id);
                  this.modalController.dismiss(
                    { message: 'done' }, 
                    'success'            
                  );
                //   this.dialogRef.close({ event: "success" });
                },
                (error) => {
                  this.loader = false;
                }
              );
            
  
          
          if ((this.order.deliveryMethod === "Dine In" || this.order.deliveryMethod === "Room Order")) {
              this.confirmOrder(data.body.id);
          }
          this.modalController.dismiss(
            { message: 'done' }, 
            'success'            
          );
        //   this.openSuccessSnackBar("Item Shift Successful");
        //   this.dialogRef.close({ event: "success" });
  
      } catch (error) {
          this.loader = true;
        //   this.UIDetectChange();
      }
  }
  
  
    roomOrder() {
      if (this.order.orderStatus != null && this.order.orderStatus === "Confirmed")
      {
        this.order.orderStatus = "Submitted";
      }
      this.reservationService.roomOrder(this.order).subscribe(
        (data) => {
          this.loader = false;
          this.balanceCalculate(this.order.id);
          this.confirmOrder(this.order.id);
          this.createAuditReport(this.prevOrder, this.order, AUDIT_ORDER_ITEM_SHIFT);
          
          
          this.orderService.getOrderByOrderId(this.order.id).subscribe(
            (data) => {
              this.order = data.body;
              this.CreateOrUpdateKotAndConfirmOrder(this.order.id);
              this.modalController.dismiss(
                { message: 'done' }, 
                'success'            
              );
            //   this.dialogRef.close({ event: "success" });
            },
            (error) => {
              this.loader = false;
            }
          );
        //   this.openSuccessSnackBar("Item Shift Successful");
        },
        (error) => {
          this.loader = false;
        //   this.UIDetectChange();
        }
      );
    }
  
    balanceCalculate(orderId: number) {
      this.loader = true;
      this.orderService.calculateOutstandingAmount(orderId).subscribe(
        (data) => {
          this.loader = false;
  
          this.changeDetectorRefs.detectChanges();
        },
        (error) => {
          this.loader = false;
        }
      );
    }
    createAuditReport(prevOrder : Order , currentOrder : Order, operationType : string)
    {
      this.role = [];
      JSON.parse(this.token.getRole()).forEach((item) => {
        this.role.push(item);
      });
      let audit = new Audit();
  
  
      audit.auditType = operationType;
      audit.orderId = currentOrder.id;
      audit.propertyId = currentOrder.propertyId;
      audit.role = this.role[0];
      audit.updatedAt = new Date().getTime().toString();
      audit.updatedBy = this.PosUserName;
      audit.reservationId = currentOrder.bookOneOrderId;
  
  
       if (AUDIT_ORDER_ITEM_SHIFT === operationType)
      {
        if (currentOrder.deliveryMethod === "Dine In") {
         
          let newItems = this.orderSelectedProducts.map(product => product.name).join(",");
          let oldItems = this.previousOrderproductLine.map(product => product.name).join(",");
         
          audit.newValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(currentOrder.orderedDate)},Name: ${currentOrder.firstName},Email:${currentOrder.email},Mobile:${currentOrder.mobile},deliveryMethod:${currentOrder.deliveryMethod},Resource:${currentOrder.resourceName},Location:${currentOrder.locationName},Discount:${currentOrder.discountAmount}, Total:${currentOrder.totalOrderAmount} , Items:(${newItems}).`;
          audit.previousValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(prevOrder.orderedDate)},Name: ${prevOrder.firstName},Email:${prevOrder.email},Mobile:${prevOrder.mobile},deliveryMethod:${prevOrder.deliveryMethod},Resource:${prevOrder.resourceName},Location:${prevOrder.locationName},Discount:${prevOrder.discountAmount}, Total:${this.previousOrderAmount} , Items:(${oldItems}).`;
  
  
        } else if (currentOrder.deliveryMethod === "Room Order") {
         
          let newItems = this.orderSelectedProducts.map(product => product.name).join(",");
          let oldItems = this.previousOrderproductLine.map(product => product.name).join(",");
          audit.bookingId = currentOrder.bookingId;
  
  
          audit.newValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(currentOrder.orderedDate)}, Name: ${currentOrder.firstName},Email:${currentOrder.email},Mobile:${currentOrder.mobile},deliveryMethod:${currentOrder.deliveryMethod},Room No:${currentOrder.roomNo},Discount:${currentOrder.discountAmount}, Total:${currentOrder.totalOrderAmount} , Items:(${newItems}).`;
          audit.previousValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(prevOrder.orderedDate)}, Name: ${prevOrder.firstName},Email:${prevOrder.email},Mobile:${prevOrder.mobile},deliveryMethod:${prevOrder.deliveryMethod},Room No:${prevOrder.roomNo},Discount:${prevOrder.discountAmount}, Total:${this.previousOrderAmount} , Items:(${oldItems}).`;
  
  
        }
        else
        {
          let newItems = this.orderSelectedProducts.map(product => product.name).join(",");
          let oldItems = this.previousOrderproductLine.map(product => product.name).join(",");
          audit.newValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(currentOrder.orderedDate)},Name: ${currentOrder.firstName},Email:${currentOrder.email},Mobile:${currentOrder.mobile},deliveryMethod:${currentOrder.deliveryMethod},Discount:${currentOrder.discountAmount}, Total:${currentOrder.totalOrderAmount} , Items:(${newItems}).`;
          audit.previousValue = `Order date:${this.dateService.convertMillisecondsToDateFormat(prevOrder.orderedDate)},Name: ${prevOrder.firstName},Email:${prevOrder.email},Mobile:${prevOrder.mobile},deliveryMethod:${prevOrder.deliveryMethod},Discount:${prevOrder.discountAmount}, Total:${this.previousOrderAmount} , Items:(${oldItems}).`;
        }
       
        if (this.previousOrderproductLine.length > this.orderSelectedProducts.length) {
          audit.operatorNotes = "Item Removed";
        } else if (this.previousOrderproductLine.length < this.orderSelectedProducts.length) {
          audit.operatorNotes = "Item Added";
        } else {
          audit.operatorNotes = "";
        }
       
        audit.updateType = "Order Item Shift";
      }
  
  
      this.loader = true;
      this.propertyService.createAuditReport(audit).subscribe(
        (data) => {
          this.loader = false;
  
  
          this.changeDetectorRefs.detectChanges();
        },
        (error) => {
          this.loader = false;
        }
      );
    }
  
  
    confirmOrder(orderId: number) {
      this.loader = true;
      this.orderService.getConfirmOrderByOrderId(orderId).subscribe(
        (data) => {
          if (
            data.body != null &&
            data.body != undefined &&
            data.body.message != null &&
            data.status == 200
          ) {
            // this.openErrorSnackBar(data.body.message);
          }
          this.loader = false;
        //   this.UIDetectChange();
        },
        (error) => {
          this.loader = false;
        }
      );
    }
  
    CreateOrUpdateKotAndConfirmOrder(orderId) {
      if (
        this.order.orderLineDtoList != null &&
        this.order.orderLineDtoList != undefined &&
        this.order.orderLineDtoList.length > 0
      ) {
        let updatedKotList = [];
        for (let i = 0; i < this.order.orderLineDtoList.length; i++) {
          if (this.isKotCreated(this.order.orderLineDtoList[i]) === false) {
            updatedKotList.push(this.order.orderLineDtoList[i]);
          } else {
            if (
              this.checkKotUnitInOrder(this.order.orderLineDtoList[i]) !=
              this.order.orderLineDtoList[i].unitsInOrder
            ) {
              let addUnitInLine =
                this.order.orderLineDtoList[i].unitsInOrder -
                this.checkKotUnitInOrder(this.order.orderLineDtoList[i]);
  
              let koties = this.getKotDetails(
                this.order.orderLineDtoList[i]
              );
  
              if (koties != null && koties.length > 0) {
                let kot = koties[0];
  
                for (let k = 0; k < kot.orderLines.length; k++) {
                  if (
                    kot.orderLines[k].name ===
                      this.order.orderLineDtoList[i].name &&
                    kot.orderLines[k].productCode ===
                      this.order.orderLineDtoList[i].productCode
                  ) {
                    kot.orderLines[k].unitsInOrder =
                      kot.orderLines[k].unitsInOrder + addUnitInLine;
                  }
                }
                this.updateKot(kot.id, kot.orderLines);
  
              } else {
                this.order.orderLineDtoList[i].unitsInOrder = addUnitInLine;
                updatedKotList.push(this.order.orderLineDtoList[i]);
              }
            }
          }
        }
  
        if (updatedKotList != null && updatedKotList.length > 0) {
          this.kot.date = this.datepipe.transform(new Date(), "yyyy-MM-dd");
          this.kot.operatorName = this.order.operatorName;
          this.kot.propertyId = this.order.propertyId;
          this.kot.tableNo = this.order.resourceName;
          this.kot.time = this.order.requiredTime;
          this.kot.orderLines = updatedKotList;
          this.kot.orderNo = this.order.bookOneOrderId;
          this.kot.orderType = this.order.deliveryMethod;
          this.kot.priority = this.kotList.length + 1;
  
          this.orderService.createKot(this.kot).subscribe(
            (data) => {
              this.loader = true;
              
               
            
            },
            (error) => {
              this.loader = false;
            }
          );
        }
      }
    }
  
    updateKot(kotId, orderLineDtoList) {
      this.orderService.updateKotLine(kotId, orderLineDtoList).subscribe(
        (data) => {
          let kot = data.body;
  
          let kotIndex = kot.orderLines.findIndex(
            (data) => data.unitsInOrder === 0
          );
  
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
            let index = this.kotList.findIndex((data) => data.id === kotId);
            this.kotList[index] = kot;
          }
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
  
    isKotCreated(item) {
      let isKotCreated = false;
      for (let i = 0; i < this.kotList.length; i++) {
        for (let l = 0; l < this.kotList[i].orderLines.length; l++) {
          if (
            this.kotList[i].orderLines[l].name === item.name &&
            this.kotList[i].orderLines[l].productCode === item.productCode
          ) {
            isKotCreated = true;
          }
        }
      }
  
      return isKotCreated;
    }
  
    checkKotUnitInOrder(item) {
      let UnitInOrder = 0;
      for (let i = 0; i < this.kotList.length; i++) {
        for (let l = 0; l < this.kotList[i].orderLines.length; l++) {
          if (
            this.kotList[i].orderLines[l].name === item.name &&
            this.kotList[i].orderLines[l].productCode === item.productCode
          ) {
            UnitInOrder =
              UnitInOrder + this.kotList[i].orderLines[l].unitsInOrder;
          }
        }
      }
  
      return UnitInOrder;
    }
  
    deletepayment(Id) {
      this.paymentService.deletePaymentById(Id).subscribe(
        (data) => {
          this.changeDetectorRefs.detectChanges();
        },
        (error) => {
         
        }
      );
    }
    orderAndPaymentCreate()
    {
    
        this.savePayment(this.payment);
    }
  
    savePayment(payment: Payment) {
      this.loader = true;
      payment.date = this.datepipe.transform(new Date().getTime(), "yyyy-MM-dd");
  
      if (this.paymentsNotPaid != null && this.paymentsNotPaid != undefined)
      {
        for (let i = 1; i < this.paymentsNotPaid.length; i++)
        {
          this.deletepayment(this.paymentsNotPaid[i].id);
        }
      }
  
      if (this.order.id != null && this.order.id != undefined)
      {
        payment.orderId = this.order.id;
      }
      this.reservationService.savePayment(payment).subscribe((response) => {
        if (response.status === 200) {
          this.payment = response.body;
          this.order.paymentId = this.payment.id;
  
          this.book();
        } else {
          this.loader = false;
        }
      });
    }
  
    async getPaymentDetailsByBooking() {
      try {
          const res = await this.paymentService.findPaymentByReferenceNumber(this.booking?.propertyReservationNumber).toPromise();
    
          this.paymentsNotPaid = res.filter((item) => {
              const searchResult =
                  item.orderId != null &&
                  item.orderId === this.order.id &&
                  item.status != null &&
                  item.status === "NotPaid";
    
              return searchResult;
          });
    
          this.payments = res.filter((item) => {
              const searchResult =
                  item.orderId != null &&
                  item.orderId === this.order.id;
    
              return searchResult;
          });
    
          this.paymentsPaid = this.payments.filter((item) => {
              const searchResult =
                  item.status != null &&
                  item.status.toLowerCase() === "paid";
    
              return searchResult;
          });
    
          if (this.outStandingAmount() >= 0 && this.order.totalOrderAmount > 0 || this.getPaidAmount() > 0) {
              this.isPaidOrder = true;
          } else {
              this.isPaidOrder = false;
          }
      } catch (error) {
          // Handle error
      }
    }
    async getPaymentByRevId(revId: string) {
      try {
          this.loader = true;
          const data = await this.paymentService.findPaymentByReferenceNumber(revId).toPromise();
    
          if (data.length > 0) {
              this.payments = data;
    
              this.paymentsNotPaid = data.filter((item) => {
                  const searchResult =
                      item.status != null &&
                      item.status === "NotPaid";
    
                  return searchResult;
              });
    
              this.paymentsPaid = this.payments.filter((item) => {
                  const searchResult =
                      item.status != null && item.status.toLocaleLowerCase() === "paid";
    
                  return searchResult;
              });
  
          }
    
        //   this.UIDetectChange();
      } catch (error) {
          this.loader = false;
      }
    }
  
    getOrderAmount()
    {
      
      let orderAmount = this.order.totalOrderAmount - this.getPaidAmount();
      if (orderAmount > 0)
      {
        return this.order.totalOrderAmount - this.getPaidAmount();
      }
      else
      {
        return 0;
      }
    }
  
    onClosed() {
    //   this.dialogRef.close();
    }
  
    // openSuccessSnackBar(message: string) {
    //   this.snackBar.open(message, "Success!", {
    //     panelClass: ["mat--success"],
    //     verticalPosition: "top",
    //     horizontalPosition: "right",
    //     duration: 4000,
    //   });
    // }
  
  
    // UIDetectChange() {
    //   setTimeout(() => {
    //     if (
    //       this.changeDetectorRefs &&
    //       !(this.changeDetectorRefs as ViewRef).destroyed
    //     ) {
    //       this.changeDetectorRefs.detectChanges();
    //     }
    //   });
    // }
}
