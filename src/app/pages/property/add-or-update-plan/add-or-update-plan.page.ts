import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LoadingController, ToastController } from "@ionic/angular";
import { RateBundle } from "src/app/model/Availbility/rate-bundle";
import { Property } from "src/app/model/property/Property";
import { Location } from "@angular/common";
import { Room } from "src/app/model/room";
import { AvailabilityService } from "src/app/service/AvailabilityService/availability.service";
import { DateService } from "src/app/service/DateService/date-service.service";
import { LoadDateService } from "src/app/service/LoadDate/load-date.service";
import { PropertyService } from "src/app/service/property/property.service";
import { TokenStorage } from "src/app/token.storage";
import { Plan } from "../../booking/plan";
import { BookingService } from "src/app/service/manage-booking/booking-service.service";
import { Logger } from "src/app/service/logger.service";
import { ApplicationUser } from "src/app/model/user";
import { AuthService } from "src/app/service/auth.service";

export interface StatusItem {
    value: string;
    viewValue: string;
}
export interface RestrictionItem {
    value: string;
    viewValue: string;
}

@Component({
    selector: "app-add-or-update-plan",
    templateUrl: "./add-or-update-plan.page.html",
    styleUrls: ["./add-or-update-plan.page.scss"],
})
export class AddOrUpdatePlanPage implements OnInit {
    statusList: StatusItem[] = [
        { value: "None", viewValue: "None" },
        { value: "Close", viewValue: "Close" },
        { value: "Open", viewValue: "Open" },
    ];

    restrictionList: RestrictionItem[] = [
        { value: "None", viewValue: "None" },
        { value: "Arrival", viewValue: "Arrival" },
        { value: "Departure", viewValue: "Departure" },
    ];

    property: Property;
    currency: string;

    loader: boolean = false;
    room: Room;
    permission: any;

    plan: Plan;
    plans: Plan[];

    PlanControll: FormControl = new FormControl();
    FromDate: FormControl = new FormControl();
    ToDate: FormControl = new FormControl();
    channelManagerUpdateTypeChange: FormControl = new FormControl();

    localCurrency: FormControl = new FormControl();
    RoomStandardPrice: FormControl = new FormControl();
    DiscountAmount: FormControl = new FormControl();
    amount: FormControl = new FormControl();

    maximumLengthOfStay: FormControl = new FormControl();
    minimumLengthOfStay: FormControl = new FormControl();
    status: FormControl = new FormControl();
    Restriction: FormControl = new FormControl();

    onAddOrUpdatePlanUpdateForm: FormGroup;
    onRateForm: FormGroup;
    onRestrictionForm: FormGroup;

    discountAmount: number = 0;
    roomStandardPrice: any;
    dateFromText: string;
    dateToText: string;
    toMinDate: string;
    planStandardrateheaderTitle: string = "More than standard rate";
    dateString: string;
    isDisabledDate: boolean = false;
    planCode: string;
    userData: ApplicationUser;

    constructor(
        private acRoute: ActivatedRoute,
        private router: Router,
        private token: TokenStorage,
        private changeDetectorRefs: ChangeDetectorRef,
        private locationBack: Location,
        public availabilityService: AvailabilityService,
        public dateService: DateService,
        private bookingService: BookingService,
        public loadDateService: LoadDateService,
        public loadingCtrl: LoadingController,
        private authService: AuthService,
        private toastController: ToastController,
        private formBuilder: FormBuilder
    ) {
        this.property = new Property();
        this.room = new Room();
        this.plan = new Plan();
        this.userData = new ApplicationUser();

        this.property = this.token.getProperty();

        if (
            this.property.localCurrency != null &&
            this.property.localCurrency != undefined
        ) {
            this.currency = this.property.localCurrency.toUpperCase();
        }
    }

    ngOnInit() {
        this.authService
            .getUserByUserId(this.token.getUserId())
            .subscribe((resp) => {
                this.userData = resp.body;
            });

        this.acRoute.queryParams.subscribe((params) => {
            if (params["room"] != undefined) {
                this.room = JSON.parse(params["room"]);
                this.getPlan(String(this.room.id));
            }

            if (params["plan"] != undefined) {
                this.plan = JSON.parse(params["plan"]);

                // this.changeDetectorRefs.detectChanges();
            }

            if (params["date"] != undefined) {
                this.dateString = JSON.parse(params["date"]);
            }

            if (params["permission"] != undefined) {
                this.permission = params["permission"];

                if (this.permission === "0") {
                    this.roomStandardPrice = this.room.roomOnlyPrice;
                    this.plan.channelManagerUpdateType = "ROOM_RATE_PLAN";

                    this.dateFromText = "From Date";
                    this.dateToText = "To Date";
                }
                if (this.permission === "5") {
                    this.isDisabledDate = true;
                    this.dataInit();
                    this.roomStandardPrice = this.room.roomOnlyPrice;

                    this.dateFromText = "From Date";
                    this.dateToText = "To Date";

                    this.discountAmount = this.plan.deviationFromStandardPlan;

                    this.plan.effectiveDate =
                        this.dateService.convertMillisecondsToYYYMMDDFormat(
                            this.dateString
                        );
                    this.plan.expiryDate =
                        this.dateService.convertMillisecondsToYYYMMDDFormat(
                            this.dateString
                        );

                    this.plan.channelManagerUpdateType = "ROOM_RATE_PLAN";

                    if (
                        this.plan.restriction === null ||
                        this.plan.restriction === undefined
                    ) {
                        this.plan.restriction = "None";
                    }

                    if (
                        this.plan.status === "Open" ||
                        this.plan.restriction === undefined
                    ) {
                        this.plan.status = "None";
                    }
                    if (this.plan.status === "Close") {
                        this.closedStaus();
                    }
                }
            }
        });

        this.onRestrictionForm = this.formBuilder.group({
            maximumLengthOfStay: [
                "",
                Validators.compose([Validators.required]),
            ],
            minimumLengthOfStay: [
                "",
                Validators.compose([Validators.required]),
            ],
            status: ["", Validators.compose([Validators.nullValidator])],
            Restriction: ["", Validators.compose([Validators.nullValidator])],
        });

        this.onRateForm = this.formBuilder.group({
            localCurrency: ["", Validators.compose([Validators.required])],
            RoomStandardPrice: [
                "",
                Validators.compose([Validators.nullValidator]),
            ],
            DiscountAmount: ["", Validators.compose([Validators.required])],
            amount: ["", Validators.compose([Validators.required])],
        });

        this.onAddOrUpdatePlanUpdateForm = this.formBuilder.group({
            PlanControll: ["", Validators.compose([Validators.required])],
            FromDate: ["", Validators.compose([Validators.required])],
            ToDate: ["", Validators.compose([Validators.required])],
            channelManagerUpdateTypeChange: [
                "",
                Validators.compose([Validators.required]),
            ],
        });
        setInterval(() => {
            this.isUpdateDisabled();
          }, 500);
    }

    dataInit() {
        this.roomStandardPrice = this.room.roomOnlyPrice;
        this.amountChange(this.plan.amount);

        // this.plan.effectiveDate = this.dateService.convertMillisecondsToYYYMMDDFormat(this.plan.effectiveDate);
        // this.plan.expiryDate = this.dateService.convertMillisecondsToYYYMMDDFormat(this.plan.expiryDate);
    }

    fromDateChange() {
        let toDate = new Date(this.plan.effectiveDate);

        toDate.setDate(toDate.getDate() + 1);
        this.toMinDate = this.getDate(toDate);
    }

    setUpdateType(typeName) {
        if (this.plan.channelManagerUpdateType === "ROOM_RATE_PLAN") {
        } else if (
            this.plan.channelManagerUpdateType === "ROOM_PLAN_RESTRICTION"
        ) {
        }
    }

    discountAmountChange(event) {
        if (event >= 0) {
            this.planStandardrateheaderTitle = "More than standard rate";
        } else {
            this.planStandardrateheaderTitle = "Less than standard rate";
        }
        if (event === undefined) {
            this.plan.amount =
                Number(this.roomStandardPrice) +
                (Number(this.roomStandardPrice) / 100) * 0;
            //  this.plan.amount.toFixed(2);
        } else {
            this.plan.amount =
                Number(this.roomStandardPrice) +
                (Number(this.roomStandardPrice) / 100) * event;
            // this.plan.amount.toFixed(2);
        }
    }

    amountChange(event) {
        if (
            this.plan.amount != undefined &&
            this.roomStandardPrice != undefined
        ) {
            this.discountAmount =
                ((Number(this.plan.amount) - Number(this.roomStandardPrice)) *
                    100) /
                Number(this.roomStandardPrice);
        }
    }

    setStatus(status: string) {
        if (status === "Close") {
            this.closedStaus();
        } else {
            this.activeStatus();
        }
    }

    closedStaus() {
        this.amount.disable();
        this.RoomStandardPrice.disable();
        this.localCurrency.disable();
        this.DiscountAmount.disable();
        this.maximumLengthOfStay.disable();
        this.minimumLengthOfStay.disable();
        this.Restriction.disable();
    }

    activeStatus() {
        this.amount.enable();
        this.RoomStandardPrice.enable();
        this.localCurrency.enable();
        this.DiscountAmount.enable();
        this.maximumLengthOfStay.enable();
        this.minimumLengthOfStay.enable();
        this.Restriction.enable();
    }

    getDate(date: Date) {
        let currentDay, currentMonth;

        if (date.getDate().toString().length == 1) {
            currentDay = "0" + date.getDate();
        } else {
            currentDay = "" + date.getDate();
        }

        if ((date.getMonth() + 1).toString().length == 1) {
            currentMonth = "0" + (date.getMonth() + 1);
        } else {
            currentMonth = "" + (date.getMonth() + 1);
        }

        return date.getFullYear() + "-" + currentMonth + "-" + currentDay;
    }

    isUpdateDisabled(): boolean {

        return !this.onAddOrUpdatePlanUpdateForm.valid || 
               (this.plan.channelManagerUpdateType != null &&
                this.plan.channelManagerUpdateType !== undefined &&
                this.plan.channelManagerUpdateType === 'ROOM_RATE_PLAN' &&
                !this.onRateForm.valid) ||
               (this.plan.channelManagerUpdateType != null &&
                this.plan.channelManagerUpdateType !== undefined &&
                this.plan.channelManagerUpdateType === 'ROOM_PLAN_RESTRICTION' &&
                !this.onRestrictionForm.valid);
      }
      

    setPlan(code) {
        this.plan = this.plans.find((data) => data.code === code);
        this.plan.effectiveDate = new Date(Number(this.plan.effectiveDate)).toISOString().split('T')[0];
        this.plan.expiryDate = new Date(Number(this.plan.expiryDate)).toISOString().split('T')[0];
        this.discountAmount = this.plan.deviationFromStandardPlan;

        this.plan.channelManagerUpdateType = "ROOM_RATE_PLAN";

        if (
            this.plan.restriction === null ||
            this.plan.restriction === undefined
        ) {
            this.plan.restriction = "None";
        }
    }

    getPlan(roomId: string) {
        this.loader = true;
        this.bookingService
            .getPlan(String(this.token.getPropertyId()), roomId)
            .subscribe(
                (data) => {
                    this.plans = data.body;

                    this.planCode = this.plan.code;

                    this.loader = false;
                    this.changeDetectorRefs.detectChanges();
                },
                (error) => {
                    this.loader = false;
                }
            );
    }

    async submit() {
        const loader = await this.loadingCtrl.create({
            duration: 5000,
        });

        loader.present();
        this.plan.active = true;

        this.plan.effectiveDate =
            this.dateService.convertMillisecondsToYYYMMDDFormat(
                this.plan.effectiveDate
            );
        this.plan.expiryDate =
            this.dateService.convertMillisecondsToYYYMMDDFormat(
                this.plan.expiryDate
            );

        this.plan.propertyId = this.room.propertyId;
        this.plan.roomTypeId = this.room.id;
        this.plan.deviationFromStandardPlan = Number(this.discountAmount);

        this.loader = true;

        this.bookingService.addRoomPlan(this.plan).subscribe(
            (res) => {
                // Logger.log('Success' + JSON.stringify(res));

                this.presentToast("Rate update successfully");
                this.loader = false;
                loader.dismiss();
                this.router.navigateByUrl(this.router.url, { skipLocationChange: true }).then(() => {
                    this.locationBack.back();
                  });
            },
            (error) => {
                // Logger.log('error' + JSON.stringify(error));
                this.loader = false;
                loader.dismiss();
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

    cancel() {
        this.router.navigateByUrl(this.router.url, { skipLocationChange: true }).then(() => {
            this.locationBack.back();
          });
        // this.locationBack.back();
    }
}
