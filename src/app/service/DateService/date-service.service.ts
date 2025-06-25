import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

    constructor() { }
  
    convertMillisecondsToDateFormat(milliseconds: any):string{
      const d = new Date(milliseconds);
      const year = d.getFullYear();
      const date = d.getDate();
  
      const month = d.getMonth() + 1;
  
      let month1;
      let day1;
      if (month < 10) {
        month1 = `0${month}`;
      } else {
        month1 = `${month}`;
      } if (date < 10) {
        day1 = `0${date}`;
      } else {
        day1 = `${date}`;
      }
      //return `${year.getFullYear()}-${month1}-${day1}`;
  
      return `${day1}-${month1}-${year}`;
    }
  
    convertMillisecondsToYYYMMDDFormat(milliseconds: any):string{
      const d = new Date(milliseconds);
      const year = d.getFullYear();
      const date = d.getDate();
  
      const month = d.getMonth() + 1;
  
      let month1;
      let day1;
      if (month < 10) {
        month1 = `0${month}`;
      } else {
        month1 = `${month}`;
      } if (date < 10) {
        day1 = `0${date}`;
      } else {
        day1 = `${date}`;
      }
      //return `${year.getFullYear()}-${month1}-${day1}`;
  
      return `${year}-${month1}-${day1}`;
    }

    convertMillisecondsToYYMMDDTHHMMFormat(milliseconds: any):string{
        const d = new Date(milliseconds);
        const year = d.getFullYear();
        const date = d.getDate();
    
        const month = d.getMonth() + 1;

        const hour = d.getHours();
        const min = d.getMinutes();
    
        let month1;
        let day1;
        let Hour;
        let Min;

        if (hour < 10) {
           Hour = `0${hour}`;
        } else {
           Hour = `${hour}`;
        }

        if (min < 10) {
            Min = `0${min}`;
         } else {
            Min = `${min}`;
         }

        if (month < 10) {
          month1 = `0${month}`;
        } else {
          month1 = `${month}`;
        } if (date < 10) {
          day1 = `0${date}`;
        } else {
          day1 = `${date}`;
        }
        //return `${year.getFullYear()}-${month1}-${day1}`;
    
        return `${year}-${month1}-${day1}T${Hour}:${Min}`;
      }
  
    convertMillisecondsToMMDDYYYYFormat(milliseconds: string):string{
  
      const d = new Date(milliseconds);
      const year = d.getFullYear();
      const date = d.getDate();
  
      const month = d.getMonth() + 1;
  
      let month1;
      let day1;
      if (month < 10) {
        month1 = `0${month}`;
      } else {
        month1 = `${month}`;
      } if (date < 10) {
        day1 = `0${date}`;
      } else {
        day1 = `${date}`;
      }
  
      return `${month1}-${day1}-${year} `;
    }
  
    convertMillisecondsToCalenderDateFormat(milliseconds: string):Date{
  
      const d = new Date(milliseconds);
      return d;
    }
  
  }
  