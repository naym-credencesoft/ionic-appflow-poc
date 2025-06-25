import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from 'src/app/model/property/Property';
import { Room } from 'src/app/model/room';
import { Logger } from 'src/app/service/logger.service';
import { TokenStorage } from 'src/app/token.storage';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.page.html',
  styleUrls: ['./room-list.page.scss'],
})
export class RoomListPage implements OnInit {

    room: Room;
    property : Property;
    currency: string;

  constructor(private acRoute: ActivatedRoute,
    private token : TokenStorage,) 
  { 
      this.room = new Room();
      this.property = new Property();

      this.property = this.token.getProperty();

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

            Logger.log('this.room '+ JSON.stringify(this.room));

        } 
    });
  }

}
