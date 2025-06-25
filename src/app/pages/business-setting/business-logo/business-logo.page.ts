import { Logger } from '../../../service/logger.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Property } from '../../../model/property/Property';
import { TokenStorage } from '../../../token.storage';
import { Location } from '@angular/common';
import { ImageModel } from '../../../model/imageFile';
import { HttpErrorResponse } from '@angular/common/http';
import { FileService } from '../../../service/file.service';
import { PropertyService } from '../../../service/property/property.service';

@Component({
  selector: 'app-business-logo',
  templateUrl: './business-logo.page.html',
  styleUrls: ['./business-logo.page.scss'],
})
export class BusinessLogoPage implements OnInit {

  loader: boolean = false;
  imagedataModel: ImageModel;
  property: Property;

  formData: FormData;

  constructor(private toastController: ToastController,
    public navCtrl: NavController,
    private _location: Location,
    private fileService: FileService,
    public loadingCtrl: LoadingController,
    private propertyService: PropertyService,
    private token: TokenStorage) {
    this.property = new Property();
    this.property = this.token.getProperty();

    this.imagedataModel = new ImageModel();
  }

  ngOnInit() {
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

      this.property.logoUrl = fileUploadResponse.url;
      this.Update();


    }, (error) => {

      Logger.log('error : ' + JSON.stringify(error));

      if (error instanceof HttpErrorResponse) {
        this.loader = false;
        loader.dismiss();
      }
    });

  }

  navigateToPage() {
    this.navCtrl.navigateForward('/setting');
  }

  Update() {
    this.loader = true;

    this.propertyService.updateProperty(this.property).subscribe(res => {
      this.loader = false;
      this.token.saveProperty(this.property);
      this.presentToast('Business logo update successfully');
      this.back();

    }, error => {
      this.loader = false;
      Logger.log('' + JSON.stringify(error));
    });
  }

  back() {
    this._location.back();
  }

  async presentToast(Message: string) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2000
    });
    toast.present();
  }

}
