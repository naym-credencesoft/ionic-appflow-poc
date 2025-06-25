import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, MenuController, NavController, ToastController } from '@ionic/angular';
import { PasswordValidationEXP } from '../../app.component';
import { HTTPStatus } from '../../app.interceptor';
import { UserRole } from '../../model/role';
import { ApplicationUser } from '../../model/user';
import { TranslateProvider } from '../../providers';
import { AuthService } from '../../service/auth.service';
import { Logger } from '../../service/logger.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public onRegisterForm: FormGroup;

  model: ApplicationUser;
  roles: UserRole;
  loader = false;

  //  passwordNotMatched: any = false;
  passwordMatched: any = false;
  isPasswordValid: any = false;
  password: any;
  confirmPassword: any;


  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private translate: TranslateProvider,
    private authService: AuthService,
    private httpStatus: HTTPStatus,
    private router: Router,
    public toastController: ToastController
  ) {
    this.model = new ApplicationUser();
    this.roles = new UserRole();
    this.showLoader();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.onRegisterForm = this.formBuilder.group({
      'firstname': [null, Validators.compose([
        Validators.required
      ])],
      'lastname': [null, Validators.compose([
        Validators.required
      ])],
      'email': [null, Validators.compose([
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        Validators.required,
        Validators.email

      ])],
      'password': [null, Validators.compose([
        Validators.required
      ])],
      'confirmPassword': [null, Validators.compose([
        Validators.required,
      ])]
    });


  }


  async signUp() {
    const loader = await this.loadingCtrl.create({
      duration: 2000
    });


    this.model.roles = [];
    this.loader = false;

    const signupData = this.onRegisterForm.value;


    this.roles.setUserRole('USER');
    this.model.roles.push(this.roles);

    Logger.log('Text Result : ' + JSON.stringify(this.model));

    this.authService.createUser(this.model).subscribe(response => {
      Logger.log('response.status ' + response.status);
      if (response.status === 201) {

        this.presentToast(this.translate.get('app.pages.reg.text.regiestationsuccessful'));
        this.onRegisterForm.reset();

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      } else if (response.status === 226) {

        this.presentToast(this.translate.get('app.pages.reg.text.accountexist'));

      } else {

        this.presentToast(this.translate.get('app.pages.reg.text.regiestationfail'));
      }
    });

  }

  async presentToast(Message: string) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2000
    });
    toast.present();
  }


  goToLogin() {
    this.navCtrl.navigateRoot('/login');
  }

  showLoader(): void {
    this.httpStatus.getHttpStatus().subscribe((status: boolean) => {
      this.loader = status;
      // showLoader Logger.log(status);
    });
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

    if (pwd == '' && confpwd == '') {
      this.passwordMatched = false;
    }
    else if (pwd == confpwd) {
      // Logger.log("matched");
      this.passwordMatched = true;
      //     this.passwordNotMatched = false;
    } else {
      // Logger.log("not matched");
      //   this.passwordNotMatched = true;
      this.passwordMatched = false;
    }
  }


}
