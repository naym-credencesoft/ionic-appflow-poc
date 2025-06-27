import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderEventsService {
  private orderUpdatedSource = new Subject<void>();

  // Observable the Order Details page will subscribe to
  orderUpdated$ = this.orderUpdatedSource.asObservable();

  // Call this when order is updated or cancelled
  notifyOrderUpdated() {
    this.orderUpdatedSource.next();
  }
}
