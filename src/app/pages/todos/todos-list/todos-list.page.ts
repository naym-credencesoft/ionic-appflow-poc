import { Todos } from './../todos';
import { TokenStorage } from 'src/app/token.storage';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TodoService } from '../todo-service.service';
import { ActionSheetController, AlertController, NavController, ToastController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { Booking } from 'src/app/model/manage-booking/Booking/Booking';
import { Property } from "src/app/model/property/Property";

@Component({
  selector: 'app-todos-list',
  templateUrl: './todos-list.page.html',
  styleUrls: ['./todos-list.page.scss'],
})
export class TodosListPage implements OnInit {
    property: Property;
    loader : boolean = false;
    todos : Todos[] =[];
    p: number = 1;
    
    bookingURLOB: Booking;
    openedCardIndex: number | null = null;

  constructor(private todosService : TodoService,
    private changeDetectorRefs: ChangeDetectorRef,
    private navCtrl: NavController,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
      private alertCtrl: AlertController,
      private router: Router,
    public token : TokenStorage) {
        this.property = new Property();
     }

  ngOnInit() {
    this.property = this.token.getProperty();
    console.log("property details", this.property)    
  }

  toggleCardBody(index: number): void {
    // Toggle the card body visibility
    this.openedCardIndex = this.openedCardIndex === index ? null : index;
  }

  navigateToPage() {
    this.navCtrl.navigateForward('/home');
  }

  ionViewWillEnter() {
    this.getTodosByPropertyId();
  }


  getTodosByPropertyId() {
    this.loader = true;
    this.todosService.findAllTodosByPropertyId(Number(this.token.getPropertyId()))
      .subscribe(res => {
        this.todos = res.body;
        this.todos.reverse();
        this.loader = false;
        this.changeDetectorRefs.detectChanges();
   });

}

async  deleteTodosDialog(row)
{
    const alert = await this.alertCtrl.create({
        header: 'Todos',
        message: 'Do you want to delete this todos',
    
        backdropDismiss: false,
        buttons: [
          
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
            
            }
          },
          {
              text: 'Yes',
              handler: () => {
                  this. deleteTodos(row);
              }
          }]
      });
      await alert.present();
}

deleteTodos(row)
{
  this.loader = true;
  this.todosService.deleteTodosById(row.id, row).subscribe(res => {

    this.loader = false;

    if(res.status === 200)
    {
      this.presentToast('Todos deleted successfully');
      this.getTodosByPropertyId();
    }

    this.changeDetectorRefs.detectChanges();
    // Logger.log(JSON.stringify( this.businessServices));
  }, error => {
    this.loader = false;
  });
}

updateTodos(row)
{
  this.loader = true;
  this.todosService.saveTodos(row).subscribe(data => {

    this.loader = false;

    if(data.status === 200)
    {
      this.getTodosByPropertyId();
    }

    this.changeDetectorRefs.detectChanges();
    // Logger.log(JSON.stringify( this.businessServices));
  }, error => {
    this.loader = false;
  });
}


async onSeenUpdate(row)
{
  let message;
  if(row.seen)
  {
    message = "unseen";
  }
  else
  {
    message = "seen";
  }

  const alert = await this.alertCtrl.create({
    header: 'Todos',
    message: 'Todos makes as '+message,

    backdropDismiss: false,
    buttons: [
      
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
        
        }
      },
      {
          text: 'Yes',
          handler: () => {
            row.seen = !row.seen;
            this.updateTodos(row);
          }
      }]
  });
  await alert.present();

}

async onSelectUpdate(row)
{
    let message;
    if(row.selected)
    {
      message = "not selected";
    }
    else
    {
      message = "selected";
    }
  
    const alert = await this.alertCtrl.create({
      header: 'Todos',
      message: 'Todos makes as '+message,
  
      backdropDismiss: false,
      buttons: [
        
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          
          }
        },
        {
            text: 'Yes',
            handler: () => {
            row.selected = !row.selected;
            this. updateTodos(row);
            }
        }]
    });
    await alert.present();

}
async onImportant(row)
{
    let message;
    if(row.important)
    {
      message = "not important";
    }
    else
    {
      message = "important";
    }
  
    const alert = await this.alertCtrl.create({
      header: 'Todos',
      message: 'Todos makes as '+message,
  
      backdropDismiss: false,
      buttons: [
        
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          
          }
        },
        {
            text: 'Yes',
            handler: () => {
                row.important = !row.important;
                this. updateTodos(row);
            }
        }]
    });
    await alert.present();

}

async onMarkStatus(row)
{
    let message;
    if(row.done)
    {
      message = "not done";
    }
    else
    {
      message = "done";
    }
  
    const alert = await this.alertCtrl.create({
      header: 'Todos',
      message: 'Todos makes as '+message,
  
      backdropDismiss: false,
      buttons: [
        
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          
          }
        },
        {
            text: 'Yes',
            handler: () => {
                row.done = !row.done;
                this. updateTodos(row);
            }
        }]
    });
    await alert.present();

}

  async todoAction(row: any) {
   
    const actionSheet = await this.actionSheetController.create({
      header: 'Todos Action',
      cssClass: 'action-sheets-basic-page',
      mode: "md",
      buttons:
        [
            {
                text: 'Edit',
                icon: 'create',
                handler: () => {
                    this.createOrUpdateTodos(row,2);
                }
           },
           {
            text: 'Book',
            icon: 'bookmarks',
            handler: () => {
                this.book(row);
            }
          },
          {
            text: 'Close',
            role: 'cancel',
            icon: 'close',
            handler: () => {
             
              actionSheet.dismiss();
            }
          },
    
  
        ]
    });
    await actionSheet.present();
  }
  isBookingAvailable(name)
  {
    if(name === 'Booking' || name === 'OTA Booking Entry')
    {
      return true;
    }
    else
    {
      return false;
    }
  }

    book(row)
    { 
        if (!row.done && row.taskType != null && row.taskType != undefined && this.isBookingAvailable(row.taskType))
        { 
            this.BookARoom(row);
        }
        else
        { 
            this.presentToast("Access denied");
        }
    }
    BookARoom(room)
    { 
        this.bookingURLOB = new Booking();
        this.bookingURLOB.businessEmail = this.token.getProperty().email;
        this.bookingURLOB.businessName = this.token.getProperty().businessName;
        this.bookingURLOB.roomBooking = true;
        this.bookingURLOB.roomId = room.roomId,
        this.bookingURLOB.email = room.email,
        this.bookingURLOB.mobile = room.mobile,
        this.bookingURLOB.customerId = room.customerId,
        this.bookingURLOB.noOfPersons = 1;
        this.bookingURLOB.fromDate = room.checkInDate;
        this.bookingURLOB.toDate = room.checkOutDate;
        this.bookingURLOB.noOfChildren = 0;
        this.bookingURLOB.propertyId = room.propertyId;
        this.bookingURLOB.firstName = room.firstName;
        this.bookingURLOB.lastName = room.lastName;
        this.bookingURLOB.changeType = "Todos_booking";
        this.bookingURLOB.customerImageurl = room.guestPhotoUrl;
        this.bookingURLOB.todoNotes = room.notes;
        this.bookingURLOB.todosId = room.id;
   
        if(room.roomNo  != null && room.roomNo  != undefined && room.roomNo.length >0)
        {
          let roomNumbers = room.roomNo.split(',');
          this.bookingURLOB.noOfRooms = roomNumbers.length;
        }
   
       let navigationExtras: NavigationExtras = {
         queryParams: {
           todosBookingOb: JSON.stringify(this.bookingURLOB),
           roomNums :  room.roomNo,
         },
       };
   
       this.router.navigate(["booking"], navigationExtras);
    }

  createOrUpdateTodos(row, permission)
  {
    let navigationExtras: NavigationExtras = {
        queryParams: {
            data: JSON.stringify(row),
            permission: permission,
        }
    };
    
    this.navCtrl.navigateForward(['todos-create'] , navigationExtras);  
  }

  async presentToast(Message: string) {
    const toast = await this.toastController.create({
        message: Message,
        duration: 2000,
    });
    toast.present();
}



}
