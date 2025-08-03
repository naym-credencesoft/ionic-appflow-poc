import { ChangeDetectorRef, Component, NgZone } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import {
    Capacitor,
    Plugins,
    PushNotification,
    PushNotificationActionPerformed,
    PushNotificationToken,
} from "@capacitor/core";
import {
    AlertController,
    LoadingController,
    MenuController,
    NavController,
    Platform,
    ToastController,
} from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { TokenStorage } from "../../src/app/token.storage";
import { PageHeader } from "../app/model/interface/pageHeader";
import { environment } from "../environments/environment";
import { Pages } from "./interfaces/pages";
import { CheckUserType } from "./model/checkUserType";
import { Property } from "./model/property/Property";
import { Room } from "./model/room";
import { TranslateProvider } from "./providers/translate/translate.service";
import { EventService } from "./service/event.service";
import { Logger } from "./service/logger.service";
import { PushNotificationService } from "./service/PusnNotificationService/pushNotification.service";
import { ApplicationUser } from "./model/user";
import { AuthService } from "./service/auth.service";

const { PushNotifications } = Plugins;

/**
 * Main Wrap App Component with starting methods
 *
 * @export
 * @class AppComponent
 */
@Component({
    selector: "app-root",
    templateUrl: "app.component.html",
    styleUrls: ["./app.component.scss"],
})
export class AppComponent {
    /**
     * Creates an Array instance with <Pages> interface that receives all menu list.
     *
     * @type {Array<Pages>}
     * @memberof AppComponent
     */

    public headerPages: Array<PageHeader>;
    public homePages: Array<Pages>;
    public bookOnePages: Array<Pages>;
    public appVersion: any = appVersion;
    useremail: string;
    timeIntevalSeconds = 90;

    /**
     * Creates an instance of AppComponent.
     * @param {Platform} platform
     * @param {SplashScreen} splashScreen
     * @param {StatusBar} statusBar
     * @param {TranslateProvider} translate
     * @param {TranslateService} translateService
     * @param {NavController} navCtrl
     * @memberof AppComponent
     */

    pages = [
        {
            title: "Dashboard",
            url: "/home",
            direct: "root",
            icon: "grid",
            roles: [
                "PROP_ADMIN",
                "PROP_FRONTDESK",
                "PROP_MANAGER",
                "PROP_SERVICE",
                "PROP_HOUSEKEEPING",
                "PROP_FINANCE",
                "PROP_MARKETING",
                "PROP_SERVICE_EXECUTIVE",
                "PROP_FO_EXECUTIVE",
            ],
            children: [],
        },
        {
            title: "Service Dashboard",
            url: "/service-dashboard",
            direct: "root",
            icon: "grid",
            roles: [
                "PROP_ADMIN",
                "PROP_FRONTDESK",
                "PROP_MANAGER",
                "PROP_SERVICE",
                "PROP_HOUSEKEEPING",
                "PROP_FINANCE",
                "PROP_MARKETING",
                "PROP_SERVICE_EXECUTIVE",
                "PROP_FO_EXECUTIVE",
            ],
            children: [],
        },
        {
            title: "Reports Dashboard",
            url: "/report-dashboard",
            direct: "root",
            icon: "grid",
            roles: [
                "PROP_ADMIN",
                "PROP_FRONTDESK",
                "PROP_MANAGER",
                "PROP_SERVICE",
                "PROP_HOUSEKEEPING",
                "PROP_FINANCE",
                "PROP_MARKETING",
                "PROP_SERVICE_EXECUTIVE",
                "PROP_FO_EXECUTIVE",
            ],
            children: [],
        },
        {
            title: "Settings",
            url: "/setting",
            direct: "root",
            icon: "settings",
            roles: [
                "PROP_ADMIN",
                "PROP_FRONTDESK",
                "PROP_MANAGER",
                "PROP_SERVICE",
                "PROP_HOUSEKEEPING",
                "PROP_FINANCE",
                "PROP_MARKETING",
                "PROP_SERVICE_EXECUTIVE",
                "PROP_FO_EXECUTIVE",
            ],
            children: [],
        },

    ];

    // pages = [
    //     {
    //         title: "Dashboard",
    //         url: "/home",
    //         direct: "root",
    //         icon: "grid",
    //         roles: [
    //             "PROP_ADMIN",
    //             "PROP_FRONTDESK",
    //             "PROP_MANAGER",
    //             "PROP_SERVICE",
    //             "PROP_HOUSEKEEPING",
    //             "PROP_FINANCE",
    //             "PROP_MARKETING",
    //             "PROP_SERVICE_EXECUTIVE",
    //             "PROP_FO_EXECUTIVE",
    //         ],
    //         children: [],
    //     },
    //     {
    //         title: "Bookings",
    //         roles: ["BOOKING MANAGEMENT", "PROP_FRONTDESK", "PROP_MANAGER","PROP_FO_EXECUTIVE"],
    //         children: [
    //             {
    //                 title: "Manage Booking",
    //                 url: "/booking-list",
    //                 direct: "forward",
    //                 icon: "bookmarks",
    //             },
    //         ],
    //     },
    //     // {
    //     //     title: 'Order',
    //     //     roles: ["PROP_ADMIN","PROP_FRONTDESK","PROP_MANAGER","PROP_SERVICE","PROP_HOUSEKEEPING"],
    //     //     children: [
    //     //       {
    //     //         title: 'Manage Order',
    //     //         url: '/manage-order',
    //     //         direct: 'forward',
    //     //         icon: 'card'
    //     //       },
    //     //       {
    //     //         title: 'Create Order',
    //     //         url: '/checkout',
    //     //         direct: 'forward',
    //     //         icon: 'card'
    //     //       }

    //     //     ]
    //     //   },
    //     {
    //         title: "Manage Property",
    //         roles: ["PROPERTY MANAGEMENT", "PROP_FRONTDESK", "PROP_MANAGER"],
    //         children: [
    //             {
    //                 title: "Manage Property",
    //                 url: "/manage-property",
    //                 direct: "forward",
    //                 icon: "business-outline",
    //             },
    //         ],
    //     },
    //     {
    //         title: "Manage Room",
    //         roles: [
    //             "ROOM MANAGEMENT",
    //             "PROP_FRONTDESK",
    //             "PROP_MANAGER",
    //             "PROP_HOUSEKEEPING",
    //         ],
    //         children: [
    //             {
    //                 title: "Manage Room",
    //                 url: "/manage-room",
    //                 direct: "forward",
    //                 icon: "bed",
    //             },
    //         ],
    //     },
    //     {
    //         title: "Rates & Availability",
    //         roles: ["BOOKING MANAGEMENT", "PROP_FRONTDESK", "PROP_MANAGER","PROP_FO_EXECUTIVE"],
    //         children: [
    //             {
    //                 title: "Manage Rates & Availability",
    //                 url: "/rate-and-availability",
    //                 direct: "forward",
    //                 icon: "cash",
    //             },
    //         ],
    //     },
    //     {
    //         title: "Service Dashboard",
    //         url: "/service-dashboard",
    //         direct: "root",
    //         roles: [
    //             "PROP_ADMIN",
    //             "PROP_FRONTDESK",
    //             "PROP_MANAGER",
    //             "PROP_SERVICE",
    //             "PROP_HOUSEKEEPING",
    //             "PROP_FINANCE",
    //             "PROP_MARKETING",
    //             "PROP_SERVICE_EXECUTIVE",
    //             "PROP_FO_EXECUTIVE",
    //         ],
    //         icon: "card",
    //         children: [],
    //     },
    //     {
    //         title: "Payment",
    //         roles: [
    //             "Revenue Management",
    //             "PROP_FRONTDESK",
    //             "PROP_MANAGER",
    //             "PROP_SERVICE",
    //         ],
    //         children: [
    //             {
    //                 title: "Manage Payment",
    //                 url: "/payment-list",
    //                 direct: "forward",
    //                 icon: "card",
    //             },
    //         ],
    //     },
    //     {
    //         title: "Expense",
    //         roles: ["Revenue Management", "PROP_FRONTDESK", "PROP_MANAGER"],
    //         children: [
    //             {
    //                 title: "Manage Expense",
    //                 url: "/expence-list",
    //                 direct: "forward",
    //                 icon: "logo-usd",
    //             },
    //         ],
    //     },
    //     {
    //         title: "Reservation",
    //         roles: ["PROP_ADMIN", "PROP_MANAGER", "PROP_SERVICE","PROP_SERVICE_EXECUTIVE",],
    //         children: [
    //             {
    //                 title: "Manage Reservation",
    //                 url: "/reservation-list",
    //                 direct: "forward",
    //                 icon: "calendar-outline",
    //             },
    //             {
    //                 title: "Create Reservation",
    //                 url: "/add-reservation",
    //                 direct: "forward",
    //                 icon: "calendar-outline",
    //             },
    //         ],
    //     },
    //     {
    //         title: "Invoice",
    //         roles: ["BOOKING MANAGEMENT", "PROP_ADMIN", "PROP_MANAGER","PROP_SERVICE_EXECUTIVE",],
    //         children: [
    //             {
    //                 title: "Invoice List",
    //                 url: "/invoice-list",
    //                 direct: "forward",
    //                 icon: "bookmarks-outline",
    //             },
    //         ],
    //     },
    //     {
    //         title: "Guest",
    //         roles: ["PROP_ADMIN", "PROP_FRONTDESK", "PROP_MANAGER","PROP_SERVICE_EXECUTIVE",],
    //         children: [
    //             {
    //                 title: "Manage Guest",
    //                 url: "/manage-customer",
    //                 direct: "forward",
    //                 icon: "logo-usd",
    //             },
    //         ],
    //     },

    //     {
    //         title: "Report",
    //         roles: ["PROP_ADMIN"],
    //         children: [
    //             {
    //                 title: "Night Audit Report",
    //                 url: "/night-audit-report",
    //                 direct: "forward",
    //                 icon: "bookmarks",
    //             },
    //             {
    //                 title: "Daily Report",
    //                 url: "/daily-report",
    //                 direct: "forward",
    //                 icon: "bookmarks",
    //             },
    //         ],
    //     },

    //     {
    //         title: "Product",
    //         roles: ["Product"],
    //         children: [
    //             {
    //                 title: "Manage Product",
    //                 url: "/manage-product",
    //                 direct: "forward",
    //                 icon: "card",
    //             },
    //             {
    //                 title: "Manage Product Group",
    //                 url: "/product-group-list",
    //                 direct: "forward",
    //                 icon: "card",
    //             },
    //         ],
    //     },
    //     //   {
    //     //     title: 'Property',
    //     //     roles: ['Property'],
    //     //     children: [
    //     //       {
    //     //         title: 'Manage Property',
    //     //         url: '/manage-property',
    //     //         direct: 'forward',
    //     //         icon: 'card'
    //     //       },
    //     //     ]
    //     //   },
    //     // {
    //     //   title: 'Service',
    //     //   roles: ['Service Management'],
    //     //   children: [
    //     //     {
    //     //       title: 'Service Dashboard',
    //     //       url: '/service-dashboard',
    //     //       direct: 'forward',
    //     //       icon: 'card'
    //     //     },
    //     //     {
    //     //       title: 'Add Reservation',
    //     //       url: '/add-reservation',
    //     //       direct: 'forward',
    //     //       icon: 'card'
    //     //     },
    //     //     {
    //     //       title: 'Reservation List',
    //     //       url: '/reservation-list',
    //     //       direct: 'forward',
    //     //       icon: 'card'
    //     //     }
    //     //   ]
    //     // }

    //     //   ,{
    //     //     title: 'External Reservations',
    //     //     children: [
    //     //       {
    //     //           title: 'External Reservations',
    //     //           url: '/external-reservation',
    //     //           direct: 'forward',
    //     //           icon: 'bookmarks'
    //     //       }
    //     //     ]
    //     //   }
    // ];

    Starter = [
        {
            title: "Dashboard",
            url: "/service-dashboard",
            direct: "root",
            icon: "grid-outline",
        },
        {
            title: "Notifications",
            url: "/notification",
            direct: "forward",
            icon: "notifications-outline",
        },
        // {
        //   title: 'Business',
        //   roles: ['BOOKING MANAGEMENT'],
        //   children: [
        //     {
        //         title: 'Business Profile',
        //         url: '/booking-list',
        //         direct: 'forward',
        //         icon: 'bookmarks-outline'
        //     },
        //   ]
        // },
        {
            title: "Payment",
            roles: ["Revenue Management"],
            children: [
                {
                    title: "Manage Payment",
                    url: "/payment-list",
                    direct: "forward",
                    icon: "card-outline",
                },
            ],
        },
        // {
        //   title: 'Expense',
        //   roles: ['Revenue Management'],
        //   children: [
        //     {
        //       title: 'Manage Expense',
        //       url: '/expence-list',
        //       direct: 'forward',
        //       icon: 'logo-usd'
        //     }
        //   ]
        // },
        // {
        //   title: 'Order',
        //   roles: ['Order'],
        //   children: [
        //     {
        //       title: 'Manage Order',
        //       url: '/manage-order',
        //       direct: 'forward',
        //       icon: 'card-outline'
        //     },
        //     {
        //       title: 'Create Order',
        //       url: '/checkout',
        //       direct: 'forward',
        //       icon: 'card-outline'
        //     }

        //   ]
        // },
        {
            title: "Reservation",
            roles: ["Reservation"],
            children: [
                {
                    title: "Manage Reservation",
                    url: "/reservation-list",
                    direct: "forward",
                    icon: "calendar-outline",
                },
                // {
                //   title: 'Create Reservation',
                //   url: '/add-reservation',
                //   direct: 'forward',
                //   icon: 'calendar-outline'
                // }
            ],
        },
        // {
        //   title: 'Invoice',
        //   roles: ['BOOKING MANAGEMENT'],
        //   children: [
        //     {
        //       title: 'Invoice List',
        //       url: '/invoice-list',
        //       direct: 'forward',
        //       icon: 'bookmarks-outline'
        //     },
        //   ]
        // },
        //   {
        //     title: 'Bookings',
        //     roles: ['BOOKING MANAGEMENT'],
        //     children: [
        //       {
        //           title: 'Manage Booking',
        //           url: '/booking-list',
        //           direct: 'forward',
        //           icon: 'bookmarks'
        //       },
        //     ]
        //   },
    ];

    //   stater = [
    //     {

    //       title: 'Business Profile',
    //       url: '/home',
    //       direct: 'root',
    //       icon: 'grid'

    //     },
    //   ];

    essential = [
        {
            title: "Service Dashboard",
            url: "/service-dashboard",
            direct: "root",
            icon: "grid-outline",
        },
        {
            title: "Notifications",
            url: "/notification",
            direct: "forward",
            icon: "notifications-outline",
        },
        // {
        //   title: 'Business',
        //   roles: ['BOOKING MANAGEMENT'],
        //   children: [
        //     {
        //         title: 'Business Profile',
        //         url: '/booking-list',
        //         direct: 'forward',
        //         icon: 'bookmarks-outline'
        //     },
        //   ]
        // },
        {
            title: "Payment",
            roles: ["Revenue Management"],
            children: [
                {
                    title: "Manage Payment",
                    url: "/payment-list",
                    direct: "forward",
                    icon: "card-outline",
                },
            ],
        },
        {
            title: "Order",
            roles: ["Order"],
            children: [
                {
                    title: "Manage Order",
                    url: "/manage-order",
                    direct: "forward",
                    icon: "card-outline",
                },
                {
                    title: "Create Order",
                    url: "/checkout",
                    direct: "forward",
                    icon: "card-outline",
                },
            ],
        },
        {
            title: "Reservation",
            roles: ["Reservation"],
            children: [
                {
                    title: "Manage Reservation",
                    url: "/reservation-list",
                    direct: "forward",
                    icon: "calendar-outline",
                },
                {
                    title: "Create Reservation",
                    url: "/add-reservation",
                    direct: "forward",
                    icon: "calendar-outline",
                },
            ],
        },
    ];

    premium = [
        {
            title: "Service Dashboard",
            url: "/service-dashboard",
            direct: "root",
            icon: "grid-outline",
        },
        {
            title: "Notifications",
            url: "/notification",
            direct: "forward",
            icon: "notifications-outline",
        },
        // {
        //   title: 'Business',
        //   roles: ['BOOKING MANAGEMENT'],
        //   children: [
        //     {
        //         title: 'Business Profile',
        //         url: '/booking-list',
        //         direct: 'forward',
        //         icon: 'bookmarks-outline'
        //     },
        //   ]
        // },
        {
            title: "Payment",
            roles: ["Revenue Management"],
            children: [
                {
                    title: "Manage Payment",
                    url: "/payment-list",
                    direct: "forward",
                    icon: "card-outline",
                },
            ],
        },
        {
            title: "Expense",
            roles: ["Revenue Management"],
            children: [
                {
                    title: "Manage Expense",
                    url: "/expence-list",
                    direct: "forward",
                    icon: "logo-usd",
                },
            ],
        },
        {
            title: "Order",
            roles: ["Order"],
            children: [
                {
                    title: "Manage Order",
                    url: "/manage-order",
                    direct: "forward",
                    icon: "card-outline",
                },
                {
                    title: "Create Order",
                    url: "/checkout",
                    direct: "forward",
                    icon: "card-outline",
                },
            ],
        },
        {
            title: "Reservation",
            roles: ["Reservation"],
            children: [
                {
                    title: "Manage Reservation",
                    url: "/reservation-list",
                    direct: "forward",
                    icon: "calendar-outline",
                },
                {
                    title: "Create Reservation",
                    url: "/add-reservation",
                    direct: "forward",
                    icon: "calendar-outline",
                },
            ],
        },
        {
            title: "Invoice",
            roles: ["BOOKING MANAGEMENT"],
            children: [
                {
                    title: "Invoice List",
                    url: "/invoice-list",
                    direct: "forward",
                    icon: "bookmarks-outline",
                },
            ],
        },
        //   {
        //     title: 'Bookings',
        //     roles: ['BOOKING MANAGEMENT'],
        //     children: [
        //       {
        //           title: 'Manage Booking',
        //           url: '/booking-list',
        //           direct: 'forward',
        //           icon: 'bookmarks'
        //       },
        //     ]
        //   },
    ];

    isLogedIn = false;
    property: Property;

    mainItem: any = [];
    subItem: any = [];

    roleArray: any = [];
    role: any = [];
    menuItems: any = [];
    mainArray: any = [];
    adminArray: any = [];
    subscriptionSelected: any = [];

    onboardingPropertyValue: any = [];
    onboardingRoomValue: any = [];

    subscriptionValue: any = [];
    channelManagementValue: any = [];

    subscriptionArray: any = [];
    onBoardingArray: any = [];
    subscriptionFilterArray: any = [];
    onboardingFilterArray: any = [];
    checkUserType: CheckUserType;

    rooms: Room[] = [];
    pagesData: any;

    rating: number;
    applicationUser: ApplicationUser;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        public toastCtrl: ToastController,
        private statusBar: StatusBar,
        private changeDetectorRefs: ChangeDetectorRef,
        private token: TokenStorage,
        private translate: TranslateProvider,
        private translateService: TranslateService,
        public navCtrl: NavController,
        private events: EventService,
        private menuController: MenuController,
        private alertCtrl: AlertController,
        private router: Router,
        private pushNotificationService: PushNotificationService,
        private loadingCtrl: LoadingController,
        private authService: AuthService,
        private changeDetectorRef: ChangeDetectorRef,
        private ngZone: NgZone
    ) {
        this.checkUserType = new CheckUserType();
        this.menuItems = [];
        this.rooms = this.token.getRoomTypes();
        this.property = new Property();
        this.roleArray = this.token.getRole();
        this.role = [];
        this.applicationUser = new ApplicationUser();

        if (this.roleArray != null && this.roleArray.length > 0) {
            JSON.parse(this.roleArray).forEach((item) => {
                this.role.push(item);
            });

            const filters = {
                roles: (roles) =>
                    roles.find((x) => this.roleArray.includes(x.toUpperCase())),
            };
        }

        if (
            this.role != null &&
            this.role != undefined &&
            this.role.length > 0
        ) {
            this.menuAccess(this.role[0]);
        }

        this.initializeApp();

        this.events.getObservable().subscribe((data) => {
            this.roleArray = data.role;

            if (
                this.roleArray != null &&
                this.roleArray != undefined &&
                this.roleArray.length > 0
            ) {
                this.menuAccess(this.roleArray[0]);
            }
        });
    }

    ngOnInit() {

        if (this.token.getUserId() != null && this.token.getUserId() != undefined) {
          this.getUserInfoById(this.token.getUserId());
        }
      }

      ionViewWillEnter(){
       this.getUserInfoById(this.token.getUserId());
      }

    
      getUserInfoById(userId: string) {
        this.authService.getUserByUserId(userId).subscribe({
          next: (response) => {
            this.applicationUser = response.body;
            // console.log("appuser", this.applicationUser);
      
            // Mark for check or detect changes
            this.changeDetectorRef.markForCheck();
            this.changeDetectorRef.detectChanges();
          },
          error: (error) => {
            console.error("Error fetching user info", error);
          }
        });
      }
      

    menuAccess(roleName: any) {
        const refreshIntervalId = setInterval(() => {
            if (
                this.token.getProperty() != null ||
                this.token.getProperty() != undefined
            ) {
                this.useremail = this.token.getUserName();

                this.property = this.token.getProperty();

                this.isLogedIn = true;
                this.menuItems = [];
                this.initMenu(roleName);

                clearInterval(refreshIntervalId);
            }
        }, this.timeIntevalSeconds * 10);
    }

    initMenu(roleName: any) {
        if (this.token.getProperty().propertyStatus === "COMPLETED") {
            if (
                this.token.getProperty() != null &&
                this.token.getProperty().businessType !== undefined &&
                this.token.getProperty().businessType.toLocaleLowerCase() !==
                    "accommodation"
            ) {
                if (
                    this.token.getPropertyId() != null ||
                    this.token.getPropertyId() != undefined
                ) {
                    this.getSubscriptionFormTokenStorage();
                }
            } else {
                if (
                    this.checkUserType.isPropAdmin(roleName) == true &&
                    this.token.getProperty().subscriptionList != null &&
                    this.token.getProperty().subscriptionList != undefined &&
                    this.token.getProperty().subscriptionList.length > 0
                ) {
                    this.getSubscriptionForProperty(roleName);
                } else {
                    this.getSubscriptionForRole(roleName);
                }
            }
        } else {
            this.menuItems = [];
            this.presentToast("Please onboard property first");
        }
    }

    getSubscriptionForRole(roleName: string) {
        this.menuItems = [];
        this.subscriptionFilterArray = [];
        this.subscriptionFilterArray.push(roleName);

        const filtersSubscriptions = {
            roles: (roles) =>
                roles.find((x) =>
                    this.subscriptionFilterArray.includes(x.toUpperCase())
                ),
        };

        this.subscriptionArray = this.filterArray(
            this.pages,
            filtersSubscriptions
        );
        this.menuItems = this.subscriptionArray;
        this.getUserInfoById(this.token.getUserId());
        // console.log(roleName+' this.menuItems ' + JSON.stringify(filtersSubscriptions));
        this.changeDetectorRefs.detectChanges();
    }

    getSubscriptionForProperty(roleName) {
        this.menuItems = [];
        if (
            this.token.getSubscriptionList() != null &&
            this.token.getSubscriptionList() != undefined
        ) {
            this.subscriptionSelected = this.token.getSubscriptionList();
        }

        if (this.subscriptionSelected.length > 0) {
            this.subscriptionFilterArray = [];

            this.subscriptionFilterArray.push(roleName);

            for (let i = 0; i < this.subscriptionSelected.length; i++) {
                this.subscriptionFilterArray.push(
                    this.subscriptionSelected[i].name.trim().toUpperCase()
                );
            }

            const filtersSubscriptions = {
                roles: (roles) =>
                    roles.find((x) =>
                        this.subscriptionFilterArray.includes(x.toUpperCase())
                    ),
            };

            this.subscriptionArray = this.filterArray(
                this.pages,
                filtersSubscriptions
            );
            this.menuItems = this.subscriptionArray;
            this.changeDetectorRefs.detectChanges();
        }
    }

    getSubscriptionFormTokenStorage() {
        this.menuItems = [];

        if (
            this.token.getProperty().plan === undefined ||
            this.token.getProperty().plan === null ||
            this.token.getProperty().plan === "Business Starter"
        ) {
            this.menuItems = this.Starter;
        } else if (this.token.getProperty().plan === "Business Premium") {
            this.menuItems = this.premium;
        } else if (this.token.getProperty().plan === "Business Essentials") {
            this.menuItems = this.essential;
        }
        this.changeDetectorRefs.detectChanges();
    }

    async presentToast(Message: string) {
        const toast = await this.toastCtrl.create({
            message: Message,
            duration: 2000,
        });
        toast.present();
    }

    filterArray(array, filters) {
        const filterKeys = Object.keys(filters);
        return array.filter((item) => {
            // validates all filter criteria
            return filterKeys.every((key) => {
                // ignores non-function predicates
                if (typeof filters[key] !== "function") {
                    return true;
                }
                return filters[key](item[key]);
            });
        });
    }

    initializeApp() {
        this.platform
            .ready()
            .then(() => {
                this.initPushNotification();
                this.statusBar.styleDefault();

                setTimeout(() => {
                    this.splashScreen.hide();
                }, 1000);
                // Set language of the app.
                this.translateService.setDefaultLang(environment.language);
                this.translateService.use(environment.language);
                this.translateService
                    .getTranslation(environment.language)
                    .subscribe((translations) => {
                        this.translate.setTranslations(translations);
                    });
            })
            .catch(() => {
                // Set language of the app.
                this.translateService.setDefaultLang(environment.language);
                this.translateService.use(environment.language);
                this.translateService
                    .getTranslation(environment.language)
                    .subscribe((translations) => {
                        this.translate.setTranslations(translations);
                    });
            });
    }

    /**
     * Init Push Notifications
     */
    initPushNotification() {
        const isPushNotificationsAvailable =
            Capacitor.isPluginAvailable("PushNotifications");

        if (!isPushNotificationsAvailable) {
            Logger.warn("Push Notifications is not available");

            return;
        }

        Logger.log("initPushNotification");

        PushNotifications.requestPermission()
            .then((result) => {
                if (result.granted) {
                    // Register with Apple / Google to receive push via APNS/FCM
                    PushNotifications.register();
                } else {
                    this.presentToast("Error enabling push notifications");
                }
            })
            .catch((e) => {
                Logger.error("Error requesting PushNotification", e);
            });

        PushNotifications.addListener(
            "registration",
            (token: PushNotificationToken) => {
                Logger.log(
                    "initPushNotification: Push registration success, token: " +
                        token.value
                );
                this.token.savePushNotificationToken(token.value);

                if (this.isLogedIn) {
                    const pushTokenDto =
                        this.pushNotificationService.generatePushNotificationDto();
                    Logger.info(
                        "updatePushNotificationToken",
                        JSON.stringify(pushTokenDto)
                    );
                    this.pushNotificationService
                        .saveUserToken(pushTokenDto)
                        .subscribe((t) => {
                            Logger.info(
                                "Push Notification Token Saved",
                                JSON.stringify(t)
                            );
                        });
                }
            }
        );

        PushNotifications.addListener("registrationError", (error: any) => {
            Logger.error(
                "initPushNotification: Error on registration: " +
                    JSON.stringify(error)
            );
            this.presentToast("Error registering push notifications");
        });

        PushNotifications.addListener(
            "pushNotificationReceived",
            (notification: PushNotification) => {
                Logger.log(
                    "initPushNotification: Push received: " +
                        JSON.stringify(notification)
                );
                this.alertCtrl
                    .create({
                        header: notification.title,
                        message: notification.subtitle || notification.body,
                        buttons: [
                            {
                                text: "Close",
                                role: "cancel",
                            },
                            {
                                text: "View",
                                handler: () => {
                                    this.onNotificationClickedRedir(
                                        notification
                                    );
                                },
                            },
                        ],
                    })
                    .then((o) => {
                        o.present();
                    });
            }
        );

        PushNotifications.addListener(
            "pushNotificationActionPerformed",
            (notification: PushNotificationActionPerformed) => {
                Logger.log(
                    "initPushNotification: Push action performed: " +
                        JSON.stringify(notification)
                );

                this.onNotificationClickedRedir(notification.notification);
            }
        );
    }

    onNotificationClickedRedir(notif: PushNotification) {
        if (
            notif != null &&
            typeof notif == "object" &&
            notif.data != null &&
            typeof notif.data == "object"
        ) {
            const row = notif.data;

            if (
                row.notificationType != null &&
                typeof row.notificationType == "string"
            ) {
                if (row.notificationType.toLowerCase() === "order") {
                    if (row.referenceId) {
                        let navigationExtras: NavigationExtras = {
                            queryParams: {
                                orderId: row.referenceId,
                            },
                        };
                        this.navCtrl.navigateForward(
                            ["order-details"],
                            navigationExtras
                        );
                    } else {
                        this.navCtrl.navigateForward(["manage-order"]);
                    }
                } else if (row.notificationType.toLowerCase() === "invoice") {
                    this.navCtrl.navigateForward(["invoice-list"]);
                } else if (row.notificationType.toLowerCase() === "booking") {
                    if (row.referenceId) {
                        let navigationExtras: NavigationExtras = {
                            queryParams: {
                                bookingId: row.referenceId,
                            },
                        };

                        this.navCtrl.navigateForward(
                            ["booking"],
                            navigationExtras
                        );
                    } else {
                        this.navCtrl.navigateForward(["booking-list"]);
                    }
                } else if (row.notificationType.toLowerCase() === "payment") {
                    this.navCtrl.navigateForward(["payment-list"]);
                } else if (
                    row.notificationType.toLowerCase() === "reservation"
                ) {
                    this.navCtrl.navigateForward([
                        "reservation-details/" + row.referenceId,
                    ]);
                } else if (
                    row.notificationType.toLowerCase() === "availability"
                ) {
                    this.navCtrl.navigateForward(["rate-and-availability"]);
                }
            }
        }
    }

    /**
     * Navigate to Edit Profile Page
     *
     * @memberof AppComponent
     */
    goToEditProgile() {
        // this.navCtrl.navigateForward('edit-profile');
        this.navCtrl.navigateForward("setting");
    }
    /**
     * Logout Method
     *
     * @memberof AppComponent
     */
    async logout() {
        const pushDto =
            this.pushNotificationService.generatePushNotificationDto();

        if (pushDto.deviceId != null) {
            const loader = await this.loadingCtrl.create({
                duration: 5000,
            });
            loader.present();

            Logger.info("Removing Token", pushDto.deviceId, pushDto.appId);
            this.pushNotificationService
                .removeUserToken(pushDto)
                .toPromise()
                .then((e) => {
                    loader.dismiss();
                    this.actualLogout();
                })
                .catch((e) => {
                    Logger.error(
                        "Unable to remove Push Token",
                        JSON.stringify(e)
                    );

                    loader.dismiss();
                    this.actualLogout();
                });
        } else {
            this.actualLogout();
        }
        window.localStorage.clear();
        window.sessionStorage.clear();
    }

    actualLogout() {
        this.token.signOut();
        this.navCtrl.navigateForward("login");
        Logger.log("Logout");
        this.menuItems = [];
        this.logoutIntervalStart();
    }

    logoutIntervalStart() {
        Logger.log("hit work");
        const refreshIntervalId = setInterval(() => {
            Logger.log("hit");

            if (
                this.token.getProperty() != null ||
                this.token.getProperty() != undefined
            ) {
                Logger.log("hit success");
                this.useremail = this.token.getUserName();
                this.property = this.token.getProperty();
                this.isLogedIn = true;

                this.initMenu(this.role);

                clearInterval(refreshIntervalId);
            }
        }, this.timeIntevalSeconds * 10);
    }

     menuClosed() {
        this.menuController.close('mainMenu');
    }

    childMenu() {
        this.menuController.open("first");
    }
}

////// ..................... main api.........................
export const SMS_NUMBER = "+1 956 903 2629";
export const appVersion = "2.19";
// export const AUDIT_CHECK_IN = "CHECK_IN";
export const AUDIT_NEW_BOOKING = "NEW_BOOKING";
// export const SESSION_APP_ID = 'BOOKONE_MOBILE_APP_BUSINESS';
export const SESSION_APP_ID = environment.sessionAppId;
export const APP_ID = "BookOneLocal";
export const AUDIT_ROOM_RELEASE = "ROOM_RELEASE";
export const AUDIT_ROOM_CATEGORY_CHANGE = "ROOM_CATEGORY_CHANGE";
export const AUDIT_DATE_CHANGE = "DATE_CHANGE";
export const AUDIT_ROOM_ALLOCATION = "ROOM_ALLOCATION";
export const AUDIT_GUEST_DETAILS_UPDATE = "GUEST_DETAILS_UPDATE";
export const AUDIT_BOOKING_CHECKOUT = "BOOKING_CHECKOUT";
export const AUDIT_CHECK_IN = "CHECK_IN";
export const AUDIT_ROOM_SHIFT = "ROOM_SHIFT";
export const AUDIT_BOOKING_CANCELLED = "BOOKING_CANCELLED";
// export const API_URL = environment.url.coreApi;
// export const API_URL_ADDRESS = environment.url.addressApi;
// export const API_URL_PROMOTION = environment.url.promotionApi;
// export const CM_API_URL = environment.url.channelIntegrationApi;

export const AUDIT_ORDER_CREATE = "ORDER_CREATE";
export const AUDIT_ORDER_UPDATE = "ORDER_UPDATE";
export const AUDIT_ORDER_CANCEL = "ORDER_CANCEL";
export const AUDIT_ORDER_DELETE = "ORDER_DELETE";
export const AUDIT_ORDER_ITEM_SHIFT = "ORDER_ITEM_SHIFT";
/// regular expression
export const PasswordValidationEXP =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*_-]).{8,}$/;
// tslint:disable-next-line: max-line-length
export const EmailValidationEXP =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const NumberValidationEXP = /^\d+$/;
export const PhoneNumberEXP = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

export const CUSTOMER_APP_URL = "https://bookone-customer-app.web.app/#/";

export const EXTRAADULT = "Extra-Adult";
export const EXTRACHILD = "Extra-Child";
