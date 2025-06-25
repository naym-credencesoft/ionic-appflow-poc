import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { Address } from 'src/app/model/address-checker/Address';
import { Property } from 'src/app/model/property/Property';
import { Room } from 'src/app/model/room';
import { PropertyService } from 'src/app/service/property/property.service';
import { TokenStorage } from 'src/app/token.storage';
import { NavController } from "@ionic/angular";

@Component({
  selector: 'app-manage-property',
  templateUrl: './manage-property.page.html',
  styleUrls: ['./manage-property.page.scss'],
})
export class ManagePropertyPage implements OnInit {

    property : Property;
    addressProperty: Address;

    managePropertySelection : string ='property';

    rooms: Room[] = [];
    currency: string;

    constructor(private token : TokenStorage,
        private propertyService : PropertyService,
        private router: Router,
        private actionSheetController: ActionSheetController,
        private changeDetectorRefs: ChangeDetectorRef,public navCtrl: NavController,) 
    {
      this.property = new Property();
      this.addressProperty = new Address();
      this.property = this.token.getProperty();

      if(this.property.address != undefined && this.property.address != null)
      {
        this.addressProperty =  this.property.address;
      }

      if(this.property.localCurrency != null && this.property.localCurrency != undefined)
      {
        this.currency = this.property.localCurrency.toUpperCase();
      }

    }
  
    ngOnInit() {
    }

    navigateToPage() {
        this.navCtrl.navigateForward('/home');
      }
  
    ionViewWillEnter() {
      this.property = this.token.getProperty();

      if(this.property.address != undefined && this.property.address != null)
      {
        this.addressProperty =  this.property.address;
      }

      this.getRoomDetailByPropertyId(this.property.id);
    }

    getRoomDetailByPropertyId(PropertyId: number) {
        this.propertyService.getRoomDetailsByPropertyId(PropertyId).subscribe(data => {
          this.rooms = data;

          if( this.rooms != null &&  this.rooms != undefined &&  this.rooms .length >0)
          {
            this.rooms.sort(this.token.roomSequenceByRanking(true));
          }
     
    
          this.changeDetectorRefs.detectChanges();
        }, error => {
          //    this.loader = false;
        });
    }

    async roomOption(room)
    {
        const actionSheet = await this.actionSheetController.create({
            header: 'Room Option',
            cssClass: 'action-sheets-basic-page',
            mode: "md",
            buttons:
              [
                {
                  text: 'Close',
                  role: 'cancel',
                  icon: 'close',
                  handler: () => {
                    
                    actionSheet.dismiss();
                  }
                },              
                {
                  text: 'Details',
                  icon: 'create',
                  handler: () => {

                    let navigationExtras: NavigationExtras = {
                        queryParams: {
                            room: JSON.stringify(room),
                        }
                      };
                      this.router.navigateByUrl('/manage-property', { skipLocationChange: true }).then(() => {
                        this.router.navigate(["room-details"], navigationExtras);
                      });
                  
                  }
                },
                {
                    text: 'Room List',
                    icon: 'list-outline',
                    handler: () => {
                    
                        let navigationExtras: NavigationExtras = {
                            queryParams: {
                                room: JSON.stringify(room),
                            }
                          };
                          this.router.navigateByUrl('/manage-property', { skipLocationChange: true }).then(() => {
                            this.router.navigate(['room-list'], navigationExtras);
                          });

                    }
                  },
                  {
                    text: 'Plan Details',
                    icon: 'construct-outline',
                    handler: () => {
                    
                        let navigationExtras: NavigationExtras = {
                            queryParams: {
                                room: JSON.stringify(room),
                            }
                          };
                          this.router.navigateByUrl('/manage-property', { skipLocationChange: true }).then(() => {
                            this.router.navigate(['manage-room-plan'], navigationExtras);
                          });
                       
                    }
                  },
                  {
                    text: 'Rate and Availability',
                    icon: 'construct-outline',
                    handler: () => {
                    
                        let navigationExtras: NavigationExtras = {
                            queryParams: {
                                room: JSON.stringify(room),
                            }
                          };
                          this.router.navigateByUrl('/manage-property', { skipLocationChange: true }).then(() => {
                            this.router.navigate(['room-rate-and-availability'], navigationExtras);
                          });
                        

                    }
                  },
              ]
          });
          await actionSheet.present();
    }

}
