import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { Property } from "src/app/model/property/Property";
import { TokenStorage } from "../../../token.storage";
import { AddSubscriptionService } from "src/app/service/subscription-service.service";
import { CheckUserType } from "src/app/model/checkUserType";

@Component({
    selector: "app-report-dashboard",
    templateUrl: "./report-dashboard.page.html",
    styleUrls: ["./report-dashboard.page.scss"],
})
export class ReportDashboardPage implements OnInit {
    
    property: Property;
  subscriptionSelected: any[];
  isAccomodationReport: boolean = false;
  isFoodGroceryReports: boolean = false;
  isOrgAdmin: boolean = false;
  isCustomerManagementReports: boolean = false;
  isRestaurantManagement: boolean = false;
  isDailySummaryReport: boolean = false;
  checkUserType: CheckUserType;
  isRestaurantService: boolean = false;
  role: any[];
  isHouseKeeping: boolean = false;
  isFontDeshUser: boolean= false;
  isManager: boolean = false;
  isPropAdmin: boolean = false;
  isFontDeskExecutive: boolean = false;
  isFinance:boolean =false;
  serviceExecutive: boolean = false;
  businessPlan: string;
  isAccomodation: boolean = false;
  roleArray: any;
    constructor(public navCtrl: NavController, 
        public token: TokenStorage,
        private subcriptionService: AddSubscriptionService,
        private changeDetectorRefs: ChangeDetectorRef,
    ) {
            this.property = new Property();
            this.checkUserType = new CheckUserType();
        
    }

    ngOnInit() {
        
        this.property = this.token.getProperty();
        console.log("property details", this.property)
    }

    ionViewWillEnter(){
        this.getSubscriptionForProperty( this.token.getProperty().id);
        this.role = [];
    JSON.parse(this.token.getRole()).forEach((item) => {
      this.role.push(item);
    });

    const filters = {
      roles: (roles) =>
        roles.find((x) => this.roleArray.includes(x.toUpperCase())),
    };
    this.UIUpdate();
    }

    nightAuditReports() {
        this.navCtrl.navigateForward("night-audit-report");
    }

    dailyReport() {
        this.navCtrl.navigateForward("daily-report");
    }
    navigateToPage() {
        this.navCtrl.navigateForward('/home');
      }

      UIUpdate()
      {
        this.property = this.token.getProperty();
    
    
        if (this.checkUserType.isAnyOrgAdmin(this.role[0]) == true) {
          this.isOrgAdmin = true;
        }
    
        if (this.checkUserType.isHouseKeeping(this.role[0]) == true) {
          this.isHouseKeeping = true;
        } else if (this.checkUserType.isFontDesk(this.role[0]) == true) {
    
          this.isFontDeshUser = true;
        } else if (this.checkUserType.isServiceRestaurant(this.role[0]) == true) {
          this.isRestaurantService = true;
        }
        else if (this.checkUserType.isManager(this.role[0]) == true) {
          this.isManager = true;
        }else if (this.checkUserType.isPropAdmin(this.role[0]) == true) {
          this.isPropAdmin = true;
        }else if (this.checkUserType.isPropFinance(this.role[0]) == true) {
          this.isFinance = true;
        }
         else if (this.checkUserType.isFontDeskEx(this.role[0]) == true) {
          this.isFontDeskExecutive = true;
        } else if (this.checkUserType.isSeviceExecutive(this.role[0]) == true) {
          this.serviceExecutive = true;
        } else {
          this.serviceExecutive = false;
          this.isFontDeskExecutive = false;
          this.isFinance = false;
          this.isPropAdmin = false;
          this.isManager = false;
          this.isFontDeshUser = false;
          this.isRestaurantService = false;
          this.isHouseKeeping = false;
    
        }
    
    
        this.businessPlan = this.token.getProperty().plan;
    
        if (
          this.property != null &&
          this.property.businessType !== undefined &&
          this.property.businessType.toLocaleLowerCase() === "accommodation"
        ) {
          this.isAccomodation = true;
        } else if (
          this.property != null &&
          this.property.businessType !== undefined &&
          this.property.businessType.toLocaleLowerCase() === "restaurants"
        ) {
          this.isRestaurantService = true;
        }
    
    
        this.changeDetectorRefs.detectChanges();
      }
    

      getSubscriptionForProperty(propertyId: number) {
        this.subcriptionService
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
                  // this.isAccomodationReport = true;
                  if (
                    this.subscriptionSelected[i].name === "Accommodation Reports"
                  ) {
                    this.isAccomodationReport = true;
                  }
    
                  if (
                    this.subscriptionSelected[i].name === "Food & Grocery Reports"
                  ) {
                    this.isFoodGroceryReports = true;
                  }
    
                  if (this.subscriptionSelected[i].name === "Guest Management") {
                    this.isCustomerManagementReports = true;
                  }
    
                  if (
                    this.subscriptionSelected[i].name === "Restaurant Management"
                  ) {
                    this.isRestaurantManagement = true;
                  }
    
                  if (
                    this.subscriptionSelected[i].name === "Daily Summary Report"
                  ) {
                    this.isDailySummaryReport = true;
                  }
                }
              }
    
    
    
              this.changeDetectorRefs.detectChanges();
            },
            (error) => {}
          );
      }
}
