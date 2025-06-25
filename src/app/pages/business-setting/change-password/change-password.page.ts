import { Logger } from '../../../service/logger.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { Property } from '../../../model/property/Property';
import { FileService } from '../../../service/file.service';
import { TokenStorage } from '../../../token.storage';
import { Location } from '@angular/common';
import { ApplicationUser } from '../../../model/user';
import { PasswordValidationEXP } from '../../../app.component';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  loader: boolean = false;
  property: Property;

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

  constructor(private toastController: ToastController,
    private _location: Location,
    private fileService: FileService,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    private authService: AuthService,
    private token: TokenStorage) {
    this.property = new Property();
    this.property = this.token.getProperty();
    this.changePassword = new ApplicationUser();
  }


  ngOnInit() {
    this.PasswordForm = this.formBuilder.group({
      'Password': ['', Validators.compose([
        Validators.required
      ])],
      'Cpassword': ['', Validators.compose([
        Validators.required
      ])],
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

  navigateToPage() {
    this.navCtrl.navigateForward('/setting');
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

  onSubmit() {
    this.loader = true;
    this.changePassword.email = this.property.email;
    Logger.log(JSON.stringify(this.changePassword));
    this.authService.updatePassword(this.changePassword).subscribe(data => {
      this.PasswordForm.reset();
      this.loader = false;
      this.presentToast('Password Changed Successfully');
      this._location.back();
    },
      error => {
        this.loader = false;
        this.presentToast('Password Changed Fail');
      });
  }


  async presentToast(Message: string) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2000
    });
    toast.present();
  }

}
