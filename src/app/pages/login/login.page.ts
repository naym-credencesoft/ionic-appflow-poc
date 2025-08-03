import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
    ActionSheetController,
    AlertController,
    LoadingController,
    MenuController,
    NavController,
    ToastController,
} from "@ionic/angular";
import { EventService } from "src/app/service/event.service";
import { HTTPStatus } from "../../app.interceptor";
import { CheckUserType } from "../../model/checkUserType";
import { ApplicationUser } from "../../model/user";
import { TranslateProvider } from "../../providers";
import { AuthService } from "../../service/auth.service";
import { CountryConfigService } from "../../service/CountryConfig/countryConfig.service";
import { Logger } from "../../service/logger.service";
import { PushNotificationService } from "../../service/PusnNotificationService/pushNotification.service";
import { TokenStorage } from "../../token.storage";
import { appVersion } from "./../../app.component";

const TOKEN_PREFIX = "Bearer ";

@Component({
    selector: "app-login",
    templateUrl: "./login.page.html",
    styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
    public onLoginForm: FormGroup;
    public model: ApplicationUser;
    loader = false;
    forgotPassEmail: string;

    isChecked: boolean;
    checkIcon: string;

    checkUserType: CheckUserType;
    appVersion: any = appVersion;

    selectedCountry: string;
    subscriptionSelected: any = [];
    passwordFieldType: string = 'password';

    selectCountryAlertOptions: any = {
        header: "Change Country",
    };

    constructor(
        public navCtrl: NavController,
        public menuCtrl: MenuController,
        public toastCtrl: ToastController,
        public events: EventService,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        private translate: TranslateProvider,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private route: ActivatedRoute,
        private token: TokenStorage,
        private router: Router,
        private httpStatus: HTTPStatus,
        private pushNotificationService: PushNotificationService,
        private countryConfig: CountryConfigService,
        public actionSheetController: ActionSheetController
    ) {
        this.model = new ApplicationUser();
        this.checkUserType = new CheckUserType();
        this.showLoader();
    }

    ionViewWillEnter() {
        this.menuCtrl.enable(false);
    }

    ngOnInit() {
        // document.querySelector('video').play();

        this.onLoginForm = this.formBuilder.group({
            email: [null, Validators.compose([Validators.required])],
            password: [null, Validators.compose([Validators.required])],
        });

        Logger.log(
            "remember details  " +
                this.token.getLoginUserEmail() +
                " " +
                this.token.getLoginPassword()
        );

        if (
            this.token.getLoginUserEmail() == null &&
            this.token.getLoginPassword() == null
        ) {
            this.model.username = "";
            this.model.password = "";
            this.isChecked = true;
            this.checkIcon = "square";
        } else {
            this.model.username = this.token.getLoginUserEmail();
            this.model.password = this.token.getLoginPassword();
            this.isChecked = false;
            this.checkIcon = "checkbox";
        }
    }

    async forgotPass() {
        this.navCtrl.navigateForward("forgot-password");
        // const alert = await this.alertCtrl.create({
        //   header: this.translate.get('app.pages.login.label.forgot'),
        //   message: this.translate.get('app.pages.login.text.forgot'),

        //   inputs: [
        //     {
        //       name: 'email',
        //       type: 'email',
        //       value: this.forgotPassEmail,
        //       placeholder: this.translate.get('app.label.email')
        //     }
        //   ],
        //   backdropDismiss: false,
        //   buttons: [
        //     {
        //       text: this.translate.get('app.pages.login.forgotpassword.cancel'),
        //       role: 'cancel',
        //       cssClass: 'secondary',
        //       handler: () => {
        //         Logger.log('Confirm Cancel');
        //       }
        //     }, {
        //       text: this.translate.get('app.pages.login.forgotpassword.confirm'),
        //       handler: inputdata => {

        //         const result = EmailValidationEXP.test(inputdata.email);

        //         if (result) {
        //           this.forgotPassEmail = '';
        //           this.model.email = inputdata.email;
        //           Logger.log('Email : true' + JSON.stringify(this.model));

        //           this.requestforgotpass(this.model);
        //         } else {
        //           this.forgotPassEmail = inputdata.email;
        //           this.forgotPass();
        //           this.presentToast(this.translate.get('app.pages.login.forgotpassword.invalidemail'));
        //           Logger.log('Email : false');
        //         }
        //         // confirm button end
        //       }
        //     }

        //   ]

        // });
        // await alert.present();
    }

    togglePasswordVisibility(): void {
        this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
      }

    async requestforgotpass(model: ApplicationUser) {
        const loader = await this.loadingCtrl.create({
            duration: 5000,
        });

        loader.present();

        this.authService.forgotPassswordRequest(model).subscribe(
            (data) => {
                Logger.log(
                    "responce result : " + " -- " + JSON.stringify(data)
                );

                if (!data.ok) {
                    loader.dismiss();
                    this.presentToast(
                        this.translate.get(
                            "app.pages.login.forgotpassword.tryagain"
                        )
                    );
                } else {
                    loader.dismiss();
                    this.presentToast(
                        this.translate.get("app.pages.login.text.sended")
                    );
                }
            },
            (error) => {
                Logger.log("error : " + error.status);
                loader.dismiss();
                this.presentToast(
                    this.translate.get("app.label.errors.server")
                );
            }
        );
    }

    // // //
    goToRegister() {
        this.navCtrl.navigateRoot("/register");
    }

    getSubscriptionForProperty(propertyId: number, userId: string) {
        this.authService.getPropertySubcription(propertyId, userId).subscribe(
            (data) => {
                this.subscriptionSelected = data;
                this.token.saveSubscriptionList(this.subscriptionSelected);
            },
            (error) => {}
        );
    }

    async login() {
        // const loader = await this.loadingCtrl.create({});

        // loader.present();
        this.authService.login(this.model).subscribe(
            (resp) => {
                if (
                    resp.body.property !== undefined &&
                    resp.body.property !== null &&
                    resp.body.property.propertyStatus != null &&
                    resp.body.property.propertyStatus != undefined &&
                    resp.body.property.propertyStatus === "INACTIVE"
                ) {
                    this.presentToast(
                        "Your current subscription has expired, please pay your subscription fee to reactive your account."
                    );
                } else {
                    if (resp.body && resp.body.token && resp.body.userId) {
                        // Logger.log('resp : ' + JSON.stringify(resp));

                        if (this.checkIcon === "checkbox") {
                            this.token.saveLoginInfo(
                                this.model.username,
                                this.model.password
                            );
                        } else {
                            this.token.clearRememberMe();
                        }

                        this.events.publishSomeData({
                            role: resp.body.roles,
                        });

                        this.token.saveToken(TOKEN_PREFIX + resp.body.token);
                        this.token.saveUserId(resp.body.userId);
                        this.token.saveUserName(this.model.username);

                        this.token.saveProperty(resp.body.property);
                        this.token.savePropertyId(resp.body.property.id);

                        this.token.saveRole(resp.body.roles);
                        this.token.saveRoomTypes(resp.body.rooms);

                        this.getSubscriptionForProperty(
                            resp.body.property.id,
                            String(resp.body.userId)
                        );

                        if (resp.body.roles.length > 0) {
                            resp.body.roles.forEach((item, index) => {
                                this.onLoginForm.reset();

                                if (
                                    this.checkUserType.isHotelAdmin(item) ==
                                    true 
                                ) {
                                    this.token.savePropertyId(
                                        resp.body.property.id
                                    );
                                    this.token.saveProperty(resp.body.property);

                                    this.presentToast(
                                        this.translate.get(
                                            "app.pages.login.text.success"
                                        )
                                    );
                                    const returnUrl =
                                        this.route.snapshot.queryParamMap.get(
                                            "returnUrl"
                                        );
                                    // this.router.navigate([returnUrl || 'service-dashboard']);

                                    if (
                                        this.token.getProperty() != null &&
                                        this.token.getProperty()
                                            .businessType !== undefined &&
                                        this.token
                                            .getProperty()
                                            .businessType.toLocaleLowerCase() !==
                                            "accommodation"
                                    ) {
                                        if (
                                            this.token.getProperty()
                                                .propertyStatus != "COMPLETED"
                                        ) {
                                            this.presentToast(
                                                "On board this business from web app"
                                            );
                                        } else {
                                            // if (this.token.getProperty().plan === 'Business Starter') {
                                            //   this.presentToastLong('Only Essential & Premium Subscribed users can use mobile app');
                                            // }
                                            // else {
                                            //   this.router.navigate([returnUrl || 'service-dashboard']);
                                            //   this.updatePushNotificationToken();
                                            // }
                                            this.router.navigate([
                                                returnUrl ||
                                                    "service-dashboard",
                                            ]);
                                            this.updatePushNotificationToken();
                                        }
                                    } else if(this.token.getRole() === '["PROP_SERVICE"]' || this.token.getRole() === '["PROP_SERVICE_EXECUTIVE"]' || this.token.getRole() === '["FB_OPERATOR"]'){
                                        this.router.navigate([
                                            returnUrl ||
                                                "service-dashboard",
                                        ]);
                                        this.updatePushNotificationToken();
                                    } else{
                                        this.router.navigate([
                                            returnUrl || "home",
                                        ]);
                                        this.updatePushNotificationToken();
                                    }
                                } else {
                                    this.presentToast(
                                        "You have no access to login"
                                    );
                                }
                            });
                        }

                        this.loader = false;
                    }
                }
                                        this.loader = false;
            },
            (error) => {
                if (error.status === 401) {
                                            this.loader = false;
                    this.presentToast(
                        this.translate.get("app.pages.login.text.invalid.user")
                    );
                    Logger.log(
                        "invaild username and password: " + error.status
                    );
                } else {
                                            this.loader = false;
                    this.presentToast(
                        this.translate.get("app.pages.login.text.try.later")
                    );
                    Logger.log("try again later");
                }
            }
        );
    }

    updateCheckedOptions() {
        Logger.log("check box");
        if (this.isChecked == true) {
            this.isChecked = true;
            this.presentAlert();
        } else {
            this.isChecked = true;
            this.checkIcon = "square";
            this.token.clearRememberMe();
        }
    }

    async presentAlert() {
        const alert = await this.alertCtrl.create({
            header: "Login Information",
            message: "Save your email address and password",
            buttons: [
                {
                    text: "Cancel",
                    role: "cancel",
                    cssClass: "secondary",
                    handler: (blah) => {
                        this.isChecked = true;
                        this.checkIcon = "square";
                    },
                },
                {
                    text: "Okay",
                    handler: () => {
                        this.isChecked = false;
                        this.checkIcon = "checkbox";
                        this.token.saveLoginInfo(
                            this.model.username,
                            this.model.password
                        );
                    },
                },
            ],
        });

        await alert.present();
    }

    updatePushNotificationToken() {
        const pushTokenDto =
            this.pushNotificationService.generatePushNotificationDto();
        Logger.info(
            "updatePushNotificationToken",
            JSON.stringify(pushTokenDto)
        );

        if (
            pushTokenDto.token != null &&
            pushTokenDto.token != undefined &&
            pushTokenDto.token.trim().length
        ) {
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

    async presentToast(Message: string) {
        const toast = await this.toastCtrl.create({
            message: Message,
            duration: 2000,
        });
        toast.present();
    }

    async presentToastLong(Message: string) {
        const toast = await this.toastCtrl.create({
            message: Message,
            duration: 4000,
        });
        toast.present();
    }

    showLoader(): void {
        this.httpStatus.getHttpStatus().subscribe((status: boolean) => {
            this.loader = status;
            //  Logger.log(status);
        });
    }

    countrySelected(countryCode) {
        Logger.info("Country Selected", countryCode);
        this.loadingCtrl.create({}).then((loader) => {
            loader.present();

            this.countryConfig.setCountry(countryCode);

            loader.dismiss();
        });
    }

    countryChanged(event: CustomEvent) {
        this.countrySelected(this.selectedCountry);
    }

    selectedCountryCode() {
        return this.countryConfig.getStoredCountry().code;
    }

    selectedCountryName() {
        return this.countryConfig.getStoredCountry().name;
    }

    availableCountries(): any {
        return this.countryConfig.getAllCountries();
    }
}
