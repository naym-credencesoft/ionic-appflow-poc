import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, MenuController, NavController, ToastController } from '@ionic/angular';
import { PasswordValidationEXP } from '../../app.component';
import { ResetPassword } from '../../model/resetPassword';
import { TranslateProvider } from '../../providers';
import { AuthService } from '../../service/auth.service';
import { Logger } from '../../service/logger.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})

export class ResetPasswordPage implements OnInit {

  uuid: string;

  headerMessage: string;

  public onResetPasswordForm: FormGroup;

  model: ResetPassword;

  passwordMatched: any = false;
  isPasswordValid: any = false;
  isDisableInput: any = true;

  password: any;
  confirmPassword: any;

  constructor(
    private activateRoute: ActivatedRoute,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private translate: TranslateProvider,
    private authService: AuthService,
    // private httpStatus: HTTPStatus,
    private router: Router,
    public toastController: ToastController
  ) {

    this.model = new ResetPassword();
  }

  ngOnInit() {
    this.uuid = this.activateRoute.snapshot.paramMap.get('routeid');
    Logger.log('uuid : ' + this.uuid);


    this.onResetPasswordForm = this.formBuilder.group({
      password: [null, Validators.compose([
        Validators.required
      ])],
      confirmPassword: [null, Validators.compose([
        Validators.required,
      ])]
    });


    // .. check uuid valid or not
    this.authService.isUuidValid(this.uuid).subscribe(data => {
      // Logger.log('responce result : '+" -- "+ data +' --  '+data.ok);
      if (data.ok) {
        this.isDisableInput = false;
        Logger.log('Ok true');
        this.headerMessage = this.translate.get('app.name');
        // this.headerMessage = this.translate.get('app.pages.forgotpassword.alreadyuseurl');
      }
      else {
        this.isDisableInput = true;
        Logger.log('Ok false');
        this.headerMessage = this.translate.get('app.pages.forgotpassword.alreadyuseurl');
      }

    }, error => {

      this.isDisableInput = true;
      Logger.log('error : ' + error.status);
      this.headerMessage = this.translate.get('app.pages.forgotpassword.alreadyuseurl');
    });
  }

  async ChangePassword() {

    const loader = await this.loadingCtrl.create({
    });

    loader.present();

    this.model.setUUID(this.uuid);

    Logger.log('Model Ob : ' + JSON.stringify(this.model));

    this.authService.resetPassswordRequest(this.model).subscribe(data => {
      Logger.log('responce result : ' + ' -- ' + data + ' --  ');

      if (data.ok) {
        loader.dismiss();
        this.presentToast(this.translate.get('app.pages.forgotpassword.password.change.successfully'));
        this.onResetPasswordForm.reset();

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);

      }
      else {
        loader.dismiss();
        this.presentToast(this.translate.get('app.pages.forgotpassword.password.change.fail'));
        this.onResetPasswordForm.reset();
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

  passwordFunction(passwordValue) {
    this.password = passwordValue;

    const result = PasswordValidationEXP.test(this.password);

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

    if (pwd === '' && confpwd === '') {
      this.passwordMatched = false;
    }
    else if (pwd === confpwd) {
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
