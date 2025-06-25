import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { PasswordValidationEXP } from 'src/app/app.component';
import { CountryCode } from 'src/app/model/countryCode';
import { Customer } from 'src/app/model/Customer/customer';
import { ApplicationUser } from 'src/app/model/user';
import { TranslateProvider } from 'src/app/providers';
import { AuthService } from 'src/app/service/auth.service';
import { ForgotPasswordService } from 'src/app/service/forgot-password.service';
import { Logger } from 'src/app/service/logger.service';
import { TokenStorage } from 'src/app/token.storage';
import { MessageDto } from './messageDto';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

    countryCode: CountryCode;
    isPhoneChecking : boolean = false;
  
    messageDto: MessageDto;
    loader = false;
  
    CodeNumber: string;
    verifyOption: string;
  
    isCodeSelect = false;

    isUserCheckRq : boolean = false;
  
    EmailControll: FormControl = new FormControl();
  
    onCheckEmailForm: FormGroup;
    model: ApplicationUser;

    isUserExisting : boolean = false;
    stepNumber : string  = '1';

    isOtpSendSuccessFully : boolean = false;

    //

    PasswordForm: FormGroup;
    Password: FormControl = new FormControl();
    Cpassword: FormControl = new FormControl();
  
    changePassword: ApplicationUser;
  
    formData: FormData;
  
    //  passwordNotMatched: any = false;
    passwordMatched: any = false;
    isPasswordValid: any = false;
    password: any;
    confirmPassword: any;
    hasLength: boolean = false;
  

    constructor(
        private formBuilder: FormBuilder,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        private acRoute : ActivatedRoute,
        private token : TokenStorage,
        private changeDetectorRefs: ChangeDetectorRef,
        public toastController: ToastController,
        private router: Router,
        private passwordService: ForgotPasswordService
        ){
         
          this.countryCode = new CountryCode();
          this.model = new ApplicationUser();
          this.messageDto = new MessageDto();
          this.changePassword = new ApplicationUser();
    
          this.onCheckEmailForm = this.formBuilder.group({
            EmailControll: ['', Validators.compose([
              Validators.required,
              Validators.email
            ])],
          });
      
      }
    
      ngOnInit()
      {
        this.PasswordForm = this.formBuilder.group({
            'Password': ['', Validators.compose([
              Validators.required
            ])],
            'Cpassword': ['', Validators.compose([
              Validators.required
            ])],
          });
      }
    
      ionViewDidEnter() {
     
       
      }

      onCodeChanged(code: string) {
    }
   

    onCodeCompleted(code: string) {
  
      Logger.log('code'+ code);
      this.messageDto.verificationCode = code;
      this.varificationSend(this.messageDto);
    }

    async varificationSend(message: MessageDto) {
        this.loader = true;
        const loader = await this.loadingCtrl.create({
            duration: 5000
          });
      
          loader.present();
        this.passwordService.verifyAuthorisationToken(message).subscribe(
          (response) => {
            this.loader = false;
    
            Logger.log('verification data', JSON.stringify(response));
            const data: any = response;
            loader.dismiss();
            this.messageDto.verificationStatus = data.verificationStatus;
            this.messageDto.notificationStatus = data.notificationStatus;
            this.loader = false;
            if (data.verificationStatus === 'approved') {
    
              this.stepNumber = '3';
              this.presentToast('Success');
              //this.navigateToCode(message.email);
    
            } else if (data.verificationStatus === 'pending') {
    
              this.presentToast('Incorrect varification code');
    
            } else {
    
            }
          },
          (_error) => {
            this.loader = false;
            loader.dismiss();
            this.presentToast('Incorrect varification code');
          }
        );
      }

      onResend() {
        this.getToken(this.messageDto);
      }
    
    
    
      async presentToast(Message: string) {
        const toast = await this.toastController.create({
          message: Message,
          duration: 2000
        });
        toast.present();
      }

      async checkUser()
      {
        this.loader = true;
        this.messageDto.email = this.model.email;

        const loader = await this.loadingCtrl.create({
            duration: 5000
          });
      
          loader.present();
    
        this.passwordService.findUserByEmail( this.model.email).subscribe(
          (data) => {
            Logger.log('Get customer ' + JSON.stringify(data.body));
    
            this.isUserCheckRq = true;
            this.isUserExisting = true;
            this.stepNumber = '2';
            this.loader = false;
            loader.dismiss();
    
           // this.title = "Verification code send to your email";
            this.changeDetectorRefs.detectChanges();
            this.getToken(this.messageDto);
          },
          (_error) => {
    
            loader.dismiss();
            this.isUserCheckRq = true;
            this.isUserExisting = false;
            this.loader = false;
            this.changeDetectorRefs.detectChanges();
          }
        );
      }

      async getToken(message: MessageDto) {
        this.loader = true;
        const loader = await this.loadingCtrl.create({
            duration: 5000
          });
      
        loader.present();
        this.passwordService.authorisationToken(message).subscribe((response) => {
    
          Logger.log('authorisationToken data', JSON.stringify(response));
          const data: any = response;
          this.messageDto.verificationStatus = data.verificationStatus;
          this.messageDto.sid = data.sid;
          this.messageDto.notificationStatus = data.notificationStatus;
          this.isOtpSendSuccessFully = true;
          this.loader = false;
          loader.dismiss();
          this.changeDetectorRefs.detectChanges();
        }),
          (error) => {
            this.loader = false;
            loader.dismiss();
          };
      }

      passwordFunction(passwordValue) {
        this.password = passwordValue;
    
        let result = PasswordValidationEXP.test(this.password);
    
        if (result) {
          this.isPasswordValid = true;
        }
        else {
          this.isPasswordValid = false;
        }
    
    
        this.passwordMatchedFunction(this.password, this.confirmPassword);
      }
    
      confirmPasswordFunction(confirmPasswordValue) {
        this.confirmPassword = confirmPasswordValue;
        this.passwordMatchedFunction(this.password, this.confirmPassword);
      }
    
      passwordMatchedFunction(pwd, confpwd) {
    
        if (this.changePassword.confirmPassword.length > 2) {
          this.hasLength = true;
    
          if (pwd == "" && confpwd == "") {
            this.passwordMatched = false;
          }
          else if (pwd == confpwd) {
            Logger.log("matched");
            this.passwordMatched = true;
            //     this.passwordNotMatched = false;
          } else {
            Logger.log("not matched");
            //   this.passwordNotMatched = true;
            this.passwordMatched = false;
          }
        }
        else {
          this.hasLength = false;
        }
      }

      async onSubmit() {
        this.loader = true;
        this.changePassword.email = this.messageDto.email;
        Logger.log(JSON.stringify(this.changePassword));

        const loader = await this.loadingCtrl.create({
            duration: 5000
          });
      
        loader.present();

        this.passwordService.updatePassword(this.changePassword).subscribe(data => {
            loader.dismiss();
            this.loader = false;
            this.PasswordForm.reset();
            this.presentToast('Password Changed Successfully');
            this.router.navigate(['/login']);
          },
            error => {
            });
      }
    
    
    
    
    }
    