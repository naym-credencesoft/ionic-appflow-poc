import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Address } from '../../model/Customer/address';
import { ImageModel } from '../../model/imageFile';
import { ApplicationUser } from "../../model/user";
import { TranslateProvider } from '../../providers';
import { AuthService } from '../../service/auth.service';
import { FileService } from '../../service/file.service';
import { Logger } from '../../service/logger.service';
import { HTTPStatus } from './../../app.interceptor';
import { TokenStorage } from './../../token.storage';
import { Property } from '../../model/property/Property';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {


  formData: FormData;
  userAddress: Address;
  userData: ApplicationUser;
  imagedataModel: ImageModel;
  profilePicture: any;
  property: Property;

  addressText: string;
  loader = false;

  onProfileForm: FormGroup;
  firstname: FormControl = new FormControl();
  lastname: FormControl = new FormControl();
  businessName: FormControl = new FormControl();
  email: FormControl = new FormControl();
  mobileNumber: FormControl = new FormControl();
  landphoneNumber: FormControl = new FormControl();

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private translate: TranslateProvider,
    private token: TokenStorage,
    private changeDetectorRefs: ChangeDetectorRef,
    private httpStatus: HTTPStatus,
    private formBuilder: FormBuilder,
    private _location: Location,
    private authService: AuthService,
    private fileService: FileService
  ) {
    this.userAddress = new Address();
    this.imagedataModel = new ImageModel();
    this.userData = new ApplicationUser();
    this.property = new Property();
    this.property = this.token.getProperty();

    this.onProfileForm = this.formBuilder.group({
      'firstname': ['', Validators.compose([
        Validators.required
      ])],
      'lastname': ['', Validators.compose([
        Validators.required
      ])],
      'businessName': ['', Validators.compose([
        Validators.required
      ])],
      'email': ['', Validators.compose([
        Validators.nullValidator
      ])],
      'mobileNumber': ['', Validators.compose([
        Validators.nullValidator
      ])],

      'landphoneNumber': ['', Validators.compose([
        Validators.nullValidator,
      ])]
    });
  }




  ngOnInit() {
    this.getUserData();
  }

  navigateToPage() {
    this.navCtrl.navigateForward('/setting');
  }

  getUserData() {
    this.loader = true;
    const UserId = this.token.getUserId();
    this.authService.getUserByUserId(UserId).subscribe(data => {
      Logger.log('json data : ' + JSON.stringify(data.body));
      this.userData = data.body;
      this.loader = false;

      Logger.log('this.userData : ' + JSON.stringify(this.userData));

      this.changeDetectorRefs.detectChanges();

    }, error => {
      this.loader = false;
    });

  }

  async onImageSelect(event) {

    const loader = await this.loadingCtrl.create({
      duration: 2000
    });
    loader.present();

    this.loader = true;

    const file1 = event.target.files[0];
    //const file1 = this.uploadedImage

    // file['value'] = (file1) ? file1.name : '';
    this.imagedataModel.receiptFileName = file1.name;
    this.formData = new FormData();
    this.formData.append('file', file1, this.imagedataModel.receiptFileName);

    this.fileService.fileUploadToCloud(this.formData).subscribe(fileUploadResponse => {
      Logger.log('fileUploadResponse.status : ' + JSON.stringify(fileUploadResponse));
      this.loader = false;
      loader.dismiss();

      this.userData.logoUrl = fileUploadResponse.url;
      this.onUpdateProfilePicture();

    }, (error) => {

      Logger.log('error : ' + JSON.stringify(error));

      if (error instanceof HttpErrorResponse) {
        this.loader = false;
        loader.dismiss();
      }
    });

  }

  onUpdateProfilePicture() {

    this.loader = true;

    const UserId = this.token.getUserId();
    this.userData.id = parseInt(UserId);

    this.authService.updateUserProfilePicture(this.userData).subscribe(response => {

      this.loader = false;
      this.presentToast("Picture Uploaded Successfully");

    }, error => {
      this.loader = false;
    });

  }


  onSubmit() {

    this.loader = true;

    const UserId = this.token.getUserId();
    this.userData.id = parseInt(UserId);

    Logger.log('User update data : ' + JSON.stringify(this.userData));

    this.authService.updateUserProfile(this.userData).subscribe(response => {
      Logger.log('response.status ' + response.status);

      this.loader = false;
      this.presentToast("Profile Update Successfully");
      this.back();

    }, error => {
      this.loader = false;
    });

  }

  async presentToast(Message: string) {
    const toast = await this.toastCtrl.create({
      message: Message,
      duration: 2000
    });
    toast.present();
  }

  back() {
    this._location.back();
  }


}
