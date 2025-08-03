import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, ViewRef } from '@angular/core';
import { Available_Status, CompletedStatus, Cooking_Status, OutOfStock_Status, PaidButOutOfStock_Status, ReadytoServe_Status, ServedStatus } from '../status';
import { FormControl } from '@angular/forms';
import { Order } from 'src/app/model/Order/order';
import { Location } from "@angular/common";

import { Property } from 'src/app/model/property/Property';
import { Recipe } from 'src/app/model/inventory/recipe';
import { BusinessService } from 'src/app/model/Reservation/businessServic';
import { OrderService } from 'src/app/service/Order/order.service';
import { TokenStorage } from 'src/app/token.storage';
import { NotificationService } from 'src/app/service/NotificationService/notification.service';
import { ReservationService } from 'src/app/service/ReservationService/reservation-service.service';
import { RecipeService } from 'src/app/service/inventory/recipe.service';
import { DatePipe } from '@angular/common';
import { PaymentService } from 'src/app/service/payment/payment.service';
import { DateService } from 'src/app/service/DateService/date-service.service';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
// import { ToastController } from '@ionic/angular/providers/toast-controller';
import { CUSTOMER_APP_URL, SMS_NUMBER } from 'src/app/app.component';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-kot-list',
  templateUrl: './kot-list.page.html',
  styleUrls: ['./kot-list.page.scss'],
})
export class KotListPage implements OnInit {
// @ViewChild('scrollContainer') scrollContainer!: ElementRef;
// @ViewChildren('statusBoxes') statusBoxes!: QueryList<ElementRef>;
   Available_Status: string = Available_Status;
  OutOfStock_Status: string = OutOfStock_Status;
  PaidButOutOfStock_Status: string = PaidButOutOfStock_Status;


  Cooking_Status: string = Cooking_Status;
  ReadytoServe_Status: string = ReadytoServe_Status;
  ServedStatus: string = ServedStatus;
  CompletedStatus: string = CompletedStatus;
draggedKot: any;
draggedFromStatusIndex: number;
draggedFromOrder: any;


  BusinessServicesFilterControll:FormControl = new FormControl();;


  items = [];


  item2 = [];


  item3 = [];




  orders: Order[];
  ordersFilter: Order[];


  order: Order;
  loader: boolean = false;


  property: Property;
  refreshIntervalId: any;
  timeIntevalSeconds = 90;


  recipe: Recipe;
  recipes: Recipe[] = [];
  serviceId: any = "0";
  businessServices: BusinessService[];


  constructor(
    private orderService: OrderService,
    private toastController: ToastController,
    private notificationService: NotificationService,
    private reservationService: ReservationService,
    private recipeService: RecipeService,
    private locationBack: Location,
    public datepipe: DatePipe,
    public token: TokenStorage,
    private paymentService: PaymentService,
    private dateService: DateService,
    private router: Router,
    private changeDetectorRefs: ChangeDetectorRef
  ) {
    this.order = new Order();
    this.property = new Property();
  }


  ngOnInit() {
    this.getCurrentTwoDaysOrder(Number(this.token.getPropertyId()));


    this.property = this.token.getProperty();
    if (this.property.plan === "Business Premium") {
      this.refreshIntervalId = setInterval(() => {
        this.getCurrentTwoDaysOrder(Number(this.token.getPropertyId()));
      }, this.timeIntevalSeconds * 1400);
    }
    this.getAllBusinessService(this.property.id);
  }


  ngOnDestroy() {
    clearInterval(this.refreshIntervalId);
  }
//   getStatusLabel(index: number): string {
//   return index === 0 ? 'Confirmed' : index === 1 ? 'Cooking' : 'Ready to Move';
// }
getStatusLabel(index: number): string {
  switch (index) {
    case 0: return 'Confirmed';
    case 1: return 'Cooking';
    case 2: return 'Ready to Serve';
    default: return '';
  }
}

getStatusColor(index: number): string {
  switch (index) {
    case 0: return '#2196F3';      // Confirmed - Blue
    case 1: return '#FFBF46';      // Cooking - Orange
    case 2: return 'green';        // Ready to Serve - Green
    default: return '#ccc';
  }
}

  onBack()
    { 
        this.locationBack.back(); 
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
         console.log(JSON.stringify( this.businessServices));
        },
        (error) => {
          this.loader = false;
        }
      );
  }
// scrollToBox(index: number): void {
//   const boxes = this.statusBoxes.toArray();
//   const box = boxes[index];
//   if (box && this.scrollContainer) {
//     const container = this.scrollContainer.nativeElement;
//     const boxOffsetLeft = box.nativeElement.offsetLeft;

//     container.scrollTo({
//       left: boxOffsetLeft - 16,
//       behavior: 'smooth'
//     });
//   }
// }
onDragStart(event: DragEvent, kot: any, order: any, statusIndex: number) {
  event.dataTransfer?.setData('text/plain', JSON.stringify({ kot, orderId: order.id, statusIndex }));
}

onDragOver(event: DragEvent) {
  event.preventDefault();
  (event.currentTarget as HTMLElement).classList.add('drag-over');
}

onDragLeave(event: DragEvent) {
  (event.currentTarget as HTMLElement).classList.remove('drag-over');
}

onDrop(event: DragEvent, newStatusIndex: number, order: any) {
  event.preventDefault();
  (event.currentTarget as HTMLElement).classList.remove('drag-over');

  const data = event.dataTransfer?.getData('text/plain');
  if (!data) return;

  const { kot } = JSON.parse(data);

  // Call your method to update KOT's status
  this.updateKOT_Tolevel(kot, order, newStatusIndex);
}

  orderLineReceipeInvetoryUpdate(order: Order) {
    this.recipes = [];
    if (
      order.orderLineDtoList != null &&
      order.orderLineDtoList != undefined &&
      order.orderLineDtoList.length > 0
    ) {
      for (let i = 0; i < order.orderLineDtoList.length; i++) {
        if (
          order.orderLineDtoList[i].recipeId != null &&
          order.orderLineDtoList[i].recipeId != undefined
        ) {
          this.recipe = new Recipe();
          this.recipe.id = order.orderLineDtoList[i].recipeId;
          this.recipe.quantity = order.orderLineDtoList[i].unitsInOrder;
          this.recipes.push(this.recipe);
        } else if (
          order.orderLineDtoList[i].inventoryId != null &&
          order.orderLineDtoList[i].inventoryId != undefined
        ) {
          this.recipe = new Recipe();
          this.recipe.inventoryId = order.orderLineDtoList[i].inventoryId;
          this.recipe.quantity = order.orderLineDtoList[i].unitsInOrder;
          this.recipes.push(this.recipe);
        }
      }
    }


    if (this.recipes.length > 0) {
      this.loader = true;
      this.recipeService.updateInventoryByReceipe(this.recipes).subscribe(
        (data) => {
          this.loader = false;
           this.presentToast("Recipe inventory updated successfully" );
          this.UIDetectChange();
        },
        (error) => {
          this.loader = false;
        }
      );
    }
  }


  getCurrentTwoDaysOrder(propertyId: number) {
    let date = new Date();
    date.setDate(date.getDate() - 1);


    let fromdate = this.datepipe.transform(new Date().getTime(), "yyyy-MM-dd");
    let todate = this.datepipe.transform(new Date().getTime(), "yyyy-MM-dd");
    this.getOrderByPropertyIdAndDateRange(propertyId, fromdate, todate);
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
        String(formDate),
        String(toDate)
      )
      .subscribe(
        (data) => {
          this.orders = data.body;


         this.orders = this.orders.filter((item) => {


           const searchResult =
             item.orderStatus != null &&
             (item.orderStatus === "Confirmed" ||
             item.orderStatus === "InProgress" ||
             item.orderStatus === "ReadyToServe") &&
             item.kotDtoList != null && item.kotDtoList != undefined && item.kotDtoList.length >0;


          return searchResult;
        });


        this.ordersFilter = this.orders;


          this.loader = false;


          this.filterByDropdown();
          this.UIDetectChange();
        },
        (error) => {
          this.loader = false;
        }
      );
  }


  getKotList(kotDtoList,index)
  {
    if (kotDtoList != null && kotDtoList != undefined && kotDtoList.length > 0)
    {
        if (index === 0)
        {
          return this.items =  kotDtoList.filter((item) => {


              const searchResult =
                this.getKotOrderLinebyStatus(item.orderLines,index).length > 0;


              return searchResult;
            });
        }else  if (index === 1)
        {
          return this.item2 =  kotDtoList.filter((item) => {


            const searchResult =
              this.getKotOrderLinebyStatus(item.orderLines,index).length > 0;


            return searchResult;
          });
        }
        else  if (index === 2)
        {
          return this.item3 =  kotDtoList.filter((item) => {


            const searchResult =
              this.getKotOrderLinebyStatus(item.orderLines,index).length > 0;


            return searchResult;
          });
        }
    }
    else
    {
      return [];
    }
  }




  getKotOrderLinebyStatus(orderLinesItem, index)
  {
    if (orderLinesItem != null && orderLinesItem != undefined && orderLinesItem.length > 0)
    {


      if (index === 0)
      {
         return orderLinesItem.filter((item) => {


            const searchResult =
              this.checkStatus(item).indexOf("Available") > -1;


            return searchResult;
          });
      }else  if (index === 1)
      {
         return orderLinesItem.filter((item) => {


            const searchResult =
              this.checkStatus(item).indexOf("Cooking") > -1;


            return searchResult;
          });
      }
      else  if (index === 2)
      {
         return orderLinesItem.filter((item) => {


            const searchResult =
              this.checkStatus(item).indexOf("Ready to Serve") > -1;


            return searchResult;
          });
      }
      else  if (index === 3)
      {
         return orderLinesItem.filter((item) => {


            const searchResult =
              this.checkStatus(item).indexOf("Served") > -1;


            return searchResult;
          });
      }


    }
    else
    {
      return [];
    }
  }




//   backClicked() {
//     this._location.back();
//   }


drop(event: CdkDragDrop<any[]>, index: number, order: Order) {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    const selectedKOT = event.container.data;
    const orderIndex = this.orders.indexOf(order);

    if (index === 0) {
      this.updateOrderKotLineItemStatus(orderIndex, selectedKOT[0], index, Available_Status);
    } else if (index === 1) {
      this.updateOrderKotLineItemStatus(orderIndex, selectedKOT[0], index, Cooking_Status);
    } else if (index === 2) {
      this.updateOrderKotLineItemStatus(orderIndex, selectedKOT[0], index, ReadytoServe_Status);
    }
  }
}
moveKOTBack(kot: any, item: any, targetIndex: number): void {
     let orderIndex = this.orders.indexOf(item);
  let statusConstant: string;

  if (targetIndex === 0) {
    statusConstant = 'Available';
  } else if (targetIndex === 1) {
    statusConstant = 'Cooking';
  }else if (targetIndex === 2) {
    statusConstant = 'Ready to Serve';
  } else {
    return; // safety fallback
  }

  this.updateOrderKotLineItemStatus(this.getOrderPositionIndex(item), kot, targetIndex, statusConstant);
}

  updateKotToProductNextLevel(propduct,kot,order,index)
  {
    if (index === 0) {
      let orderIndex = this.orders.indexOf(order);
      this.updateOrderProductItemStatus(orderIndex, kot,propduct, Available_Status);


    } else if (index === 1) {
      let orderIndex = this.orders.indexOf(order);
      this.updateOrderProductItemStatus(orderIndex, kot,propduct, Cooking_Status);


    } else if (index === 2) {
      let orderIndex = this.orders.indexOf(order);
      this.updateOrderProductItemStatus(orderIndex, kot,propduct, ReadytoServe_Status);
    }
  }


  updateOrderProductItemStatus(orderIndex, selectedKOT,propduct, status : string)
  {
    let order = this.orders[orderIndex];
    let kotIndex = order.kotDtoList.indexOf(selectedKOT);
    let propductIndex = order.kotDtoList[kotIndex].orderLines.indexOf(propduct);


    if (
      this.checkStatus(propduct) !=
        PaidButOutOfStock_Status &&
      this.checkStatus(propduct) != OutOfStock_Status
    ) {


      selectedKOT.orderLines[propductIndex].status = status;
      order.kotDtoList[kotIndex] = selectedKOT;
      this.orders[orderIndex] = order;


      this.updateOrderKOTLineStatus(selectedKOT.id, selectedKOT.orderLines);
    }
    else
    {
      
       this.presentToast(
                   "This product status :"+this.checkStatus(propduct)+" thats why can not change the status"
                );
    }


    if (this.getKotList(order.kotDtoList, 0) != null && this.getKotList(order.kotDtoList, 0) != undefined && this.getKotList(order.kotDtoList, 0).length > 0)
    {
      if (order.orderStatus != 'Confirmed') {
         this.updateOrderStatus2(order.id, "Confirmed");
      }
    }
    else if (this.getKotList(order.kotDtoList, 1) != null && this.getKotList(order.kotDtoList, 1) != undefined && this.getKotList(order.kotDtoList, 1).length > 0)
    {
      if (order.orderStatus != 'InProgress') {
         this.updateOrderStatus2(order.id, "InProgress");
      }
    }
    else if (this.getKotList(order.kotDtoList, 2) != null && this.getKotList(order.kotDtoList, 2) != undefined && this.getKotList(order.kotDtoList, 2).length > 0)
    {
      if (order.orderStatus != 'ReadyToServe') {
         this.updateOrderStatus2(order.id, "ReadyToServe");
      }
    }
  }


  updateKOT_Tolevel(kot,order,index)
  {
    if (index === 0) {
      let orderIndex = this.orders.indexOf(order);
      this.updateOrderKotLineItemStatus(orderIndex, kot,index, Available_Status);


    } else if (index === 1) {
      let orderIndex = this.orders.indexOf(order);
      this.updateOrderKotLineItemStatus(orderIndex, kot,index, Cooking_Status);


    } else if (index === 2) {
      let orderIndex = this.orders.indexOf(order);
      this.updateOrderKotLineItemStatus(orderIndex, kot,index, ReadytoServe_Status);
    }
  }


  updateOrderKotLineItemStatus(orderIndex, selectedKOT,sectionIndex, status : string)
  {
    let order = this.orders[orderIndex];
    let kotIndex = order?.kotDtoList?.indexOf(selectedKOT);


    if (selectedKOT.orderLines != null && selectedKOT.orderLines != undefined) {
      for (let i = 0; i < selectedKOT.orderLines.length; i++) {


        if (
          this.checkStatus(selectedKOT.orderLines[i]) !=
            PaidButOutOfStock_Status &&
          this.checkStatus(selectedKOT.orderLines[i]) != OutOfStock_Status
        ) {
          selectedKOT.orderLines[i].status = status;
        }
      }
      this.updateOrderKOTLineStatus(selectedKOT.id, selectedKOT.orderLines);
    }


    order.kotDtoList[kotIndex] = selectedKOT;
    this.orders[orderIndex] = order;


    if (this.getKotList(order.kotDtoList, 0) != null && this.getKotList(order.kotDtoList, 0) != undefined && this.getKotList(order.kotDtoList, 0).length > 0)
    {
      if (order.orderStatus != 'Confirmed') {
         this.updateOrderStatus2(order.id, "Confirmed");
      }
    }
    else if (this.getKotList(order.kotDtoList, 1) != null && this.getKotList(order.kotDtoList, 1) != undefined && this.getKotList(order.kotDtoList, 1).length > 0)
    {
      if (order.orderStatus != 'InProgress') {
         this.updateOrderStatus2(order.id, "InProgress");
      }
    }
    else if (this.getKotList(order.kotDtoList, 2) != null && this.getKotList(order.kotDtoList, 2) != undefined && this.getKotList(order.kotDtoList, 2).length > 0)
    {
      if (order.orderStatus != 'ReadyToServe') {
         this.updateOrderStatus2(order.id, "ReadyToServe");
      }
    }
  }




  getOrderPositionIndex(order)
  {
    if (this.getKotList(order.kotDtoList, 0) != null && this.getKotList(order.kotDtoList, 0) != undefined && this.getKotList(order.kotDtoList, 0).length > 0)
    {
      return 0;
    }
    else if (this.getKotList(order.kotDtoList, 1) != null && this.getKotList(order.kotDtoList, 1) != undefined && this.getKotList(order.kotDtoList, 1).length > 0)
    {
      return 1;
    }
    else if (this.getKotList(order.kotDtoList, 2) != null && this.getKotList(order.kotDtoList, 2) != undefined && this.getKotList(order.kotDtoList, 2).length > 0)
    {
      return 2;
    }
  }
  orderServed(order)
  {
    this.updateOrderStatus2(order.id, "Served");
    this.updateOrderLineItem(order, ServedStatus);
  }


//   orderCompleteDialog(row) {
//     const dialogRef = this.dialog.open(OrderCompleteDialogComponent, {
//       width: "600px",
//       data: {
//         data: row,
//       },
//     });
//     dialogRef.afterClosed().subscribe((result) => {
//       this.getCurrentTwoDaysOrder(Number(this.token.getPropertyId()));
//     });
//   }


  updateOrderStatus2(orderId: number, orderStatus: string) {
    this.loader = true;
    this.orderService.updateOrderStatus(orderId, orderStatus).subscribe(
      (data) => {
        this.loader = false;
        this.presentToast(
                    "Order status updated successfully" 
                );

        this.getCurrentTwoDaysOrder(Number(this.token.getPropertyId()));
        this.UIDetectChange();
        if (orderStatus === "Completed") {
          this.order.invoiceId = data.body.invoiceId;
          this.orderLineReceipeInvetoryUpdate(this.order);
          // if(this.order.invoiceId != null && this.order.mobile != null)
          // {
          //   this.sendConfirmationMessage(this.order);
          // }
        }
      },
      (error) => {
        this.loader = false;
      }
    );
  }


  updateOrderStatus(orderId: number, orderStatus: string) {
    this.loader = true;
    this.orderService.updateOrderStatus(orderId, orderStatus).subscribe(
      (data) => {
        this.loader = false;
        // this.openSuccessSnackBar("Order status updated successfully");
          this.presentToast(
                    "Order status updated successfully" 
                );

        if (orderStatus === "Completed") {
          this.order.invoiceId = data.body.invoiceId;
          this.orderLineReceipeInvetoryUpdate(this.order);
          // if(this.order.invoiceId != null && this.order.mobile != null)
          // {
          //   this.sendConfirmationMessage(this.order);
          // }
        }
        this.UIDetectChange();
      },
      (error) => {
        this.loader = false;
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

  checkTypes(product) {
    if (
      product.extraProductGroupId != null ||
      product.extraProductGroupId != undefined
    ) {
      return "(E)";
    } else if (
      product.toppingProductGroupId != null &&
      product.toppingProductGroupId != undefined
    ) {
      return "(T)";
    } else {
      return "(M)";
    }
  }


//   onDetails(item) {
//     const dialogRef = this.dialog.open(KitchenOrderDetailsComponent, {
//       autoFocus: false,
//       width: "60%",
//       maxHeight: "90vh",
//       data: {
//         order: item,
//       },
//     });
//     dialogRef.afterClosed().subscribe((result) => {
//       this.getCurrentTwoDaysOrder(Number(this.token.getPropertyId()));
//     });
//   }


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


  updateOrderLineItem(order: Order, status: string) {
    if (order.kotDtoList != null && order.kotDtoList != undefined) {
      for (let i = 0; i < order.kotDtoList.length; i++) {


        for (let j = 0; j < order.kotDtoList[i].orderLines.length; j++)
        {
          if (
            this.checkStatus(order.kotDtoList[i].orderLines[j]) !=
              PaidButOutOfStock_Status &&
            this.checkStatus(order.kotDtoList[i].orderLines[j]) != OutOfStock_Status
          ) {
            order.kotDtoList[i].orderLines[j].status = status;
          }
        }


        this.updateOrderKOTLineStatus(order.kotDtoList[i].id, order.kotDtoList[i].orderLines);
      }
    }
  }


  updateOrderKOTLineStatus(kotId: number, lines: any[]) {


    this.loader = true;
    this.orderService.updateKotLine(kotId, lines).subscribe(
      (data) => {
        this.loader = false;
        this.UIDetectChange();
      },
      (error) => {
        this.loader = false;
      }
    );
  }


//   openSuccessSnackBar(message: string) {
//     this.snackBar.open(message, "Success!", {
//       panelClass: ["mat--success"],
//       verticalPosition: "top",
//       horizontalPosition: "right",
//       duration: 4000,
//     });
//   }
//   openErrorSnackBar(message: string) {
//     this.snackBar.open(message, "Error!", {
//       panelClass: ["mat--errors"],
//       verticalPosition: "top",
//       horizontalPosition: "right",
//       duration: 4000,
//     });
//   }


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


  filterByDropdown() {
    let searchResult;
    if (this.serviceId === 0) {
      this.orders = this.ordersFilter;
    } else {
      this.orders = this.ordersFilter;
      this.orders = this.orders.filter((item) => {
        searchResult =
        (this.serviceId === "0" ||
          (item.businessServiceId != null &&
            item.businessServiceId != undefined &&
            this.serviceId != "0" &&
            item.businessServiceId === this.serviceId))
        return searchResult;
      });
    }
    this.changeDetectorRefs.detectChanges();
  }


 



}
