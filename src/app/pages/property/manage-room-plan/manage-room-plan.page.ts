import { Plan } from './../../booking/plan';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Property } from 'src/app/model/property/Property';
import { Room } from 'src/app/model/room';
import { PropertyService } from 'src/app/service/property/property.service';
import { TokenStorage } from 'src/app/token.storage';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-manage-room-plan',
  templateUrl: './manage-room-plan.page.html',
  styleUrls: ['./manage-room-plan.page.scss'],
})
export class ManageRoomPlanPage implements OnInit {

    room: Room;
    property : Property;
    currency: string;
    loader: boolean = false;
    plans : Plan[] =[];

  constructor(private acRoute: ActivatedRoute,
    private propertyService : PropertyService,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
    private actionSheetController: ActionSheetController,
    private token : TokenStorage,) 
  { 
      this.room = new Room();
      this.property = new Property();

      this.property = this.token.getProperty();

      if(this.property.localCurrency != null && this.property.localCurrency != undefined)
      {
        this.currency = this.property.localCurrency.toUpperCase();
      }
  }

  ngOnInit() 
  {
    this.acRoute.queryParams.subscribe((params) => {
        if (params["room"] != undefined) {
            this.room = JSON.parse(params["room"]);
            this.getPlan();
        } 
    });
  }

  getPlan() {
    this.loader = true;
    this.propertyService.getPlan(String(this.room.propertyId), String(this.room.id)).subscribe(data => {
    
      this.plans = data.body;
      this.loader = false;
     
      this.changeDetectorRefs.detectChanges();

    }, error => {
      this.loader = false;
    });
  }

  async planOption(plan)
  {
      const actionSheet = await this.actionSheetController.create({
          header: 'Plan Option',
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
                  text: 'Plan Update',
                  icon: 'pencil-outline',
                  handler: () => {
                  
                      let navigationExtras: NavigationExtras = {
                          queryParams: {
                              room: JSON.stringify(this.room),
                              plan: JSON.stringify(plan),
                          }
                        };
                    
                      this.router.navigate(['add-room-plan'], navigationExtras);

                  }
                },
            ]
        });
        await actionSheet.present();
  }

}
