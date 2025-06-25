import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from 'src/app/model/property/Property';
import { Room } from 'src/app/model/room';
import { TokenStorage } from 'src/app/token.storage';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.page.html',
  styleUrls: ['./room-details.page.scss'],
})
export class RoomDetailsPage implements OnInit {

    @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;

    slideOptsOne = {
        initialSlide: 0,
        slidesPerView: 1,
        autoplay: true
      };

    room: Room;
    property : Property;
    currency: string;

  constructor(private acRoute: ActivatedRoute,
    private token : TokenStorage,) 
  { 
      this.room = new Room();
      this.property = new Property();

      if(this.property.localCurrency != null && this.property.localCurrency != undefined)
      {
        this.currency = this.property.localCurrency.toUpperCase();
      }
  }

  ngOnInit() 
  {
    this.acRoute.queryParams.subscribe((params) => {
        if (params["room"] != undefined) {
            this.room = JSON.parse(params["room"]);

        } 
    });
  }

  SlideDidChange(object, slideView) {
    this.checkIfNavDisabled(object, slideView);
  }

  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }

  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      object.isBeginningSlide = istrue;
    });
  }
  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
    });
  }

}
