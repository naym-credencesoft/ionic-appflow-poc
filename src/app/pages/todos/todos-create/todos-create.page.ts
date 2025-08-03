import { EmployeeService } from './../../../service/employee/employee.service';
import { DateService } from 'src/app/service/DateService/date-service.service';
import { BookingService } from 'src/app/service/manage-booking/booking-service.service';
import { ReservationService } from 'src/app/service/ReservationService/reservation-service.service';
import { TokenStorage } from 'src/app/token.storage';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/model/Reservation/businessServic';
import { Todos } from '../todos';
import { Room } from 'src/app/model/room';
import { Customer } from 'src/app/model/Customer/customer';
import { Booking } from 'src/app/model/manage-booking/Booking/Booking';
import { RoomInfo } from '../../manage-room/manage-room.page';
import { RoomDetails } from 'src/app/model/RoomDetails/RoomDetails';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomerService } from 'src/app/service/Customer/customer.service';
import { CountryList } from 'src/app/model/Customer/country';
import { ActivatedRoute } from '@angular/router';
import { CountryCode } from 'src/app/model/countryCode';
import { LoadingController, ToastController } from '@ionic/angular';
import { ImageModel } from 'src/app/model/imageFile';
import { FileService } from 'src/app/service/file.service';
import { TodoService } from '../todo-service.service';
import { Location } from '@angular/common';
import { Employee } from 'src/app/model/emp/employee';
import { NavController } from "@ionic/angular";
import { Property } from "src/app/model/property/Property";

@Component({
  selector: 'app-todos-create',
  templateUrl: './todos-create.page.html',
  styleUrls: ['./todos-create.page.scss'],
})
export class TodosCreatePage implements OnInit {
    property: Property;
    Selection : string = '1';
    noOfIndex : any[] = ['1'];
    roomNumbers: any[] = [];
    logoUrl: any ="assets/img/user_profile.svg";
    msgs: any[];
    minDate: string;
    maxDate: string;
    toMinDate: string;
    toMaxDate: string;
    customerSearchResult : string;
    countryCode: string;
    PhoneNumberWithoutCode: string;
 

assigneeForm: FormGroup;
formData: FormData;
   onInfoForm : FormGroup;
   bookingForm : FormGroup;
   guestForm: FormGroup;
   roomInfoForm: FormGroup;

   isShowCustomerList: boolean = false;
   isReadOnly : boolean = false;
   loader : boolean = false;
   isRoomTab: boolean = false;
   isGuestTab: boolean = false;
   isBookingTab: boolean = false;
   isServiceDisabled: boolean = false;
   isReadOnlyCustomerInfo: boolean = false;
   isAnotherAccountExist: boolean = false;
   
   todos : Todos;
   businessService : BusinessService;
   businessServices : BusinessService[] = [];
   rooms : Room[] =[];
   room : Room;
   roomDetails : RoomDetails[] = [];
   customer : Customer;
   booking : Booking;
   customers : Customer[]= [];
   customersFilter : Customer[]= [];
   CountryArray: CountryList;
   imagedataModel: ImageModel;

   employees :Employee[]=[];
   employeesFilter :Employee[]=[];

   TaskType: FormControl = new FormControl();
   Notes: FormControl = new FormControl();
   businesService: FormControl = new FormControl();

   roomTypeBooking: FormControl = new FormControl();
   bookingFromDate: FormControl = new FormControl();
   bookingToDate: FormControl = new FormControl();
   bookingRoomNo: FormControl = new FormControl();
   
   FirstName: FormControl = new FormControl();
   LastName: FormControl = new FormControl();
   bookingEmail: FormControl = new FormControl();
   country: FormControl = new FormControl();
   bookingContact: FormControl = new FormControl();
   CountryCodeController: FormControl = new FormControl();

   roomType: FormControl = new FormControl();
   roomNo: FormControl = new FormControl();


   StartDate: FormControl = new FormControl();
   DueDate: FormControl = new FormControl();
   AssignedToContact: FormControl = new FormControl();
   Assignee: FormControl = new FormControl();
  
 
 
  isArrivalSelected : boolean = false;
  isDepartureSelected : boolean = false;

   permission: any;
    

  
  constructor(private formBuilder: FormBuilder, 
    public token : TokenStorage, 
    private dateService : DateService,
    private _location: Location,
    private customerService: CustomerService,
    private bookingService : BookingService, 
    public loadingCtrl: LoadingController,
    private employeeService : EmployeeService,
    private toastController: ToastController,
    private todosService : TodoService,
    private fileService: FileService,
    private acRoute: ActivatedRoute, 
    private reservationService : ReservationService,
    private changeDetectorRefs: ChangeDetectorRef,public navCtrl: NavController,) 
  { 
    this.todos = new Todos();
    this.businessService = new BusinessService();
    this.room = new Room();
    this.booking = new Booking();
    this.customer = new Customer();
    this.CountryArray = new CountryList();
    this.imagedataModel = new ImageModel(); 
    this.property = new Property();

    this.rooms = this.token.getRoomTypes();

    this.onInfoForm = this.formBuilder.group({
        'TaskType': ['', Validators.compose([
          Validators.required
        ])],
        'Notes': ['', Validators.compose([
            Validators.nullValidator
          ])],
        'businesService': ['', Validators.compose([
            Validators.required
          ])],
      });

      this.bookingForm = this.formBuilder.group({
        'roomTypeBooking': ['', Validators.compose([
          Validators.required
        ])],
        'bookingFromDate': ['', Validators.compose([
            Validators.required
          ])],
        'bookingToDate': ['', Validators.compose([
            Validators.required
          ])],
        'bookingRoomNo': ['', Validators.compose([
        Validators.nullValidator
        ])],
      });

      this.guestForm = this.formBuilder.group({
        'FirstName': ['', Validators.compose([
          Validators.required
        ])],
        'LastName': ['', Validators.compose([
            Validators.required
          ])],
        'bookingEmail': ['', Validators.compose([
            Validators.nullValidator
          ])],
        'country': ['', Validators.compose([
        Validators.nullValidator
        ])],
        'bookingContact': ['', Validators.compose([
            Validators.nullValidator
        ])],
        'CountryCodeController': ['', Validators.compose([
            Validators.nullValidator
        ])],
      });

      this.roomInfoForm= this.formBuilder.group({
        'roomType': ['', Validators.compose([
          Validators.nullValidator
        ])],
        'roomNo': ['', Validators.compose([
            Validators.nullValidator
          ])],
      });

      this.assigneeForm = this.formBuilder.group({
        'Assignee': ['', Validators.compose([
          Validators.nullValidator
        ])],
        'AssignedToContact': ['', Validators.compose([
            Validators.nullValidator
          ])],
        'StartDate': ['', Validators.compose([
        Validators.nullValidator
        ])],
        'DueDate': ['', Validators.compose([
            Validators.nullValidator
        ])],
      });
  
  }

  ngOnInit() 
  {
    this.property = this.token.getProperty();

    this.acRoute.queryParams.subscribe((params) => {
        if (JSON.parse(params["data"]) != undefined && JSON.parse(params["data"]) != null) {
            this.todos = JSON.parse(params["data"]);
            this.changeDetectorRefs.detectChanges();

        } 
        if (params["permission"] != undefined) {
            this.permission = (params["permission"]); 

            if (this.permission === '0') {
                this.checkDefaultCountryCode();
              }
              else if (this.permission === '1') {
                this.getTodosById( this.todos.id);
                this.isReadOnly = true;
                this.isReadOnlyCustomerInfo = true;
              }
              else if (this.permission === '2') {
                this.getTodosById( this.todos.id);
                this.isReadOnly = false;
              }
        }
    });

    this.setCalenderDateLimit();
    this.getAllBusinessService();
    this.getCustomerist();
    this.getEmpList();
  }

  navigateToPage() {
    this.navCtrl.navigateForward('/todos-list');
  }
  getTodosById(id : number)
  {
    this.loader = true;
    this.todosService.getTodosById(id).subscribe(data => {

      this.loader = false;
      console.log(JSON.stringify( data.body));
      if(data.body != null && data.body != undefined)
      {
        this.todos = data.body;

        if(this.todos.roomNo  != null && this.todos.roomNo  != undefined && this.todos.roomNo.length >0)
        {
          this.roomNumbers = this.todos.roomNo.split(',');
        }

        if(this.todos.mobile != null && this.todos.mobile != undefined)
        {
            this.setMobileNumberByCode(this.todos.mobile);
            this.isReadOnlyCustomerInfo = true;
        }


        if(this.todos.roomId != null && this.todos.roomId != undefined)
        {
          this.setRoom(this.todos.roomId);
        }
        this.setTaskTypeByTodos(this.todos.taskType);

        this.todos.propertyId = Number(this.token.getPropertyId());
        this.todos.applicationUserId = Number(this.token.getUserId());

        if(this.todos.startDate != null && this.todos.startDate != undefined){
          this.todos.startDate =this.dateService.convertMillisecondsToYYMMDDTHHMMFormat(
            this.todos.startDate
            
          );
        }

        if(this.todos.dueDate != null && this.todos.dueDate != undefined){
          this.todos.dueDate =this.dateService.convertMillisecondsToYYMMDDTHHMMFormat(
            this.todos.dueDate
           
          );
        }

        if(this.todos.checkInDate != null && this.todos.checkInDate != undefined){
          this.todos.checkInDate =this.dateService.convertMillisecondsToYYMMDDTHHMMFormat(
            this.todos.checkInDate
          );
        }

        if(this.todos.checkOutDate != null && this.todos.checkOutDate != undefined){
          this.todos.checkOutDate =this.dateService.convertMillisecondsToYYMMDDTHHMMFormat(
            this.todos.checkOutDate
          );
        }

        if(this.todos.guestPhotoUrl != null && this.todos.guestPhotoUrl != undefined)
        {
          this.logoUrl =this.todos.guestPhotoUrl;
        }

      }

      this.changeDetectorRefs.detectChanges();
      // Logger.log(JSON.stringify( this.businessServices));
    }, error => {
      this.loader = false;
    });
  }

  setTaskTypeByTodos(name)
{
  this.isRoomTab = false;
  this.isGuestTab = false;
  this.isBookingTab  = false;
  if(name === 'Transport Arrangement' || name === 'Room Cleaning' || name === 'Luggage PickUp')
  {
    this.isRoomTab = true;
    this.isServiceDisabled = false;
    this.noOfIndex = ["1","4","5","f"];
  }
  else if(name === 'Booking' || name === 'OTA Booking Entry')
  {
    this.isGuestTab = true;
    this.isBookingTab  = true;
    this.isServiceDisabled = true;
    this.checkAvailabilty();
    this.noOfIndex = ["1","2","3","f"];
  }
  else
  {
    this.isServiceDisabled = false;
    this.noOfIndex = ["1","5","f"];
  }
}


  getEmpList() {

    this.loader = true;
    this.employees = [];
    this.employeesFilter = [];
    this.employeeService.getAllEmployeeByPropertyId(this.token.getProperty().id).subscribe(res => {
        console.log('res '+ JSON.stringify(res));
      if(res.body != null && res.body != undefined && res.body.length >0)
      {
        this.employees = res.body;
        this.employeesFilter = res.body;
      }

      this.loader = false;
      this.changeDetectorRefs.detectChanges();
    },error=>{
      this.loader = false;
    })
  }

  
  checkDefaultCountryCode()
  {

    if(this.token.getProperty().address != undefined && this.token.getProperty().address != null && this.token.getProperty().address.country != null && this.token.getProperty().address.country != undefined)
    {
      let code = this.CountryArray.countries.find((data) => data.value.toLowerCase() === this.token.getProperty().address.country.toLowerCase()).countryCode;

      if (code != undefined) {
        this.countryCode = code;
       // Logger.log('countryCode '+ this.countryCode);
      }
    }
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
      this.loader = false;
      loader.dismiss();

      this.todos.guestPhotoUrl = fileUploadResponse.url;
      this.logoUrl = fileUploadResponse.url;


    }, (error) => {


      if (error instanceof HttpErrorResponse) {
        this.loader = false;
        loader.dismiss();
      }
    });

  }


  getCustomerist() {

    this.loader = true;
    this.customers = [];
    this.customersFilter = [];
    this.customerService.getAllCustomerByPropertyId(this.token.getProperty().id).subscribe(res => {
      if(res.body != null && res.body != undefined && res.body.length >0)
      {
        this.customers = res.body;
        this.customersFilter = res.body;
      }

      this.loader = false;
      this.changeDetectorRefs.detectChanges();
    },error=>{
      this.loader = false;
    })
  }

  getAllBusinessService() {
    this.loader = true;
    this.reservationService.getAllBusinessServiceByPropertyId(String(this.token.getPropertyId())).subscribe(data => {
      this.businessServices = data.body;
      this.loader = false;

      if(this.todos.id === undefined)
      {
        this.businessService = this.businessServices.find(
          (data) => data.name === "Accommodation"
        );

        this.todos.businessServiceId = this.businessService.id;
        this.todos.businessServiceName = this.businessService.name;
      }
      else
      {
        this.businessService.id =  this.todos.businessServiceId;
      }



      this.changeDetectorRefs.detectChanges();
      // Logger.log(JSON.stringify( this.businessServices));
    }, error => {
      this.loader = false;
    });
  }

  setCalenderDateLimit() {
    let date: Date = new Date();
    this.minDate = this.getDate(date);
    date.setFullYear(date.getFullYear() + 5);
    this.maxDate = this.getDate(date);
}

fromDateChange() {
    this.todos.checkOutDate = '';
    let toDate = new Date(this.todos.checkInDate);
    this.isArrivalSelected = true;
    toDate.setDate(toDate.getDate() + 1);
    this.toMinDate = this.getDate(toDate);

    toDate.setDate(toDate.getDate() + 30);
    this.toMaxDate = this.getDate(toDate);

    if(this.bookingForm.valid === true && this.todos.checkOutDate != '')
    {
      this.checkAvailabilty();
    }
}

onCheckOutDateChange() {

    if(this.bookingForm.valid === true && this.todos.checkOutDate != '')
    {
      this.checkAvailabilty();
    }
      this.isDepartureSelected = true;
}

checkAvailabilty() {

    this.booking.businessEmail = this.token.getProperty().email;
    this.booking.businessName = this.token.getProperty().name;
    this.booking.roomBooking = true;
    this.booking.groupBooking = false;
    this.booking.roomId = this.room.id;


    if(this.roomNumbers  != null && this.roomNumbers  != undefined && this.roomNumbers.length >0)
    {
      this.booking.noOfRooms =  this.roomNumbers.length;
    }

    this.booking.roomPrice = (this.room.roomOnlyPrice);
    this.booking.roomName = this.room.name;


    this.booking.propertyId = this.token.getProperty().id;
    this.msgs = [];

  
    this.booking.fromDate = this.dateService.convertMillisecondsToYYYMMDDFormat(
        this.todos.checkInDate
    );
    this.booking.toDate = this.dateService.convertMillisecondsToYYYMMDDFormat(
        this.todos.checkOutDate
    );

    const checkAvailabilityObsrv = this.bookingService
      .checkAvailability(this.booking)
      .subscribe(
        (response) => {


          if (response.status === 200) {

            this.booking.available = response.body.available;
            // this.booking.fromTime = this.datepipe.transform(this.booking.fromDate, 'yyyy-MM-ddTHH:mm');
            // this.booking.toTime = this.datepipe.transform(this.booking.toDate, 'yyyy-MM-ddTHH:mm');



            if (this.booking.available === false) {
              this.msgs.push({
                severity: "warn",
                summary:
                  "Appologies ! Seems we are soldout for the selected dates,please try another date. ",
              });
              // this.bookingButtonLabel = "Enquire";
              if (
                response.body.message != null &&
                response.body.message != undefined &&
                response.body.message != ""
              ) {
                this.msgs.push({
                  severity: "error",
                  summary:   response.body.message,
                });

              } else {
                this.msgs.push({
                  severity: "error",
                  summary:    "Appologies ! Seems we are soldout for the selected dates,please try another date. ",
                });

              }
            } else {
             // this.bookingButtonLabel = "Book";
            }
          } else {
            this.msgs.push({
              severity: "error",
              summary: response.status + ":" + response.statusText,
            });
          }
        },
        (error) => this.handleError(error)
      );
  }

  private handleError(error: HttpErrorResponse) {
    this.msgs = [];
    if (error.error instanceof ErrorEvent) {
      this.msgs.push({
        severity: "error",
        summary: ` The server responded with  erorr code : ${error.status} ,
            please email   ${this.booking.businessEmail} to the proceed with the booking `,
      });
    } else {
      this.msgs.push({
        severity: "error",
        summary: ` Erorr code : ${error.status} ,
            please  email   ${this.booking.businessEmail} to the proceed with the booking `,
      });
    }
  }


getDate(date: Date) {
    let currentDay,currentMonth;

    if (date.getDate().toString().length == 1) {
       currentDay = "0" + date.getDate();
    } else {
       currentDay = "" + date.getDate();
    }

    if ((date.getMonth() + 1).toString().length == 1) {
       currentMonth = "0" + (date.getMonth() + 1);
    } else {
       currentMonth = "" + (date.getMonth() + 1);
    }

    return (
        date.getFullYear() + "-" +currentMonth + "-" +currentDay
    );
}

dataCheck(data)
 {
   if(data != null && data != undefined && data !='')
   {
     return data;
   }
   else
   {
     return 'No Data Found';
   }
 }

emailCheck()
{
  if(this.customers.length>0 &&  this.isReadOnlyCustomerInfo === false)
  {
      if(this.todos.email != null && this.todos.email != undefined && this.todos.email != '')
      {
        let customer = this.customers.find((data )=> this.dataCheck(data.email).toLowerCase() === this.dataCheck(this.todos.email).toLowerCase());

        if(customer != null && customer != undefined)
        {
          if(String(customer.id)!= this.todos.customerId)
          {
            this.isAnotherAccountExist = true;
            return customer;
          }
          else
          {
            //this.AddHere(customer);
            return null;
          }

        }
        else
        {
          return null;
        }
      }
      else
  {
    return null;
  }


  }
  else
  {
    return null;
  }
}

phoneCheck()
{
  if(this.customers.length>0 &&  this.isReadOnlyCustomerInfo === false)
  {
      let customer = this.customers.find((data )=> this.dataCheck(data.mobile).toLowerCase() === this.dataCheck(this.countryCode+this.PhoneNumberWithoutCode).toLowerCase());

      if(customer != null && customer != undefined)
      {
       if(String(customer.id)!= this.todos.customerId)
        {
          this.isAnotherAccountExist = true;
          return customer;
        }
        else
        {
          return null;
        }

      }
      else
      {
        return null;
      }
  }
  else
  {
    return null;
  }
}

AddHere(customer)
{
  this.isAnotherAccountExist = false;
  this.todos.customerId = customer.id;
  this.todos.firstName = customer.firstName;
  this.todos.lastName = customer.lastName;
  this.todos.email = customer.email;
  this.todos.mobile = customer.mobile;
  this.todos.guestPhotoUrl = customer.imageUrl;
  this.isReadOnlyCustomerInfo = true;

  if(this.todos.mobile != null && this.todos.mobile != undefined)
  {
      this.setMobileNumberByCode(this.todos.mobile);
  }
}

  setTaskType(name)
 {
  this.isRoomTab = false;
  this.isGuestTab = false;
  this.isBookingTab  = false;
  if(name === 'Transport Arrangement' || name === 'Room Cleaning' || name === 'Luggage PickUp')
  {
    this.isRoomTab = true;
    this.isServiceDisabled = false;
    this.noOfIndex = ["1","4","5","f"];
  }
  else if(name === 'Booking' || name === 'OTA Booking Entry')
  {
    this.isGuestTab = true;
    this.isBookingTab  = true;

    this.businessService = this.businessServices.find(
      (data) => data.name === "Accommodation"
    );

    this.todos.businessServiceId = this.businessService.id;
    this.todos.businessServiceName = this.businessService.name;
    this.isServiceDisabled = true;
   // this.setTab(4);
   this.noOfIndex = ["1","2","3","f"];
  }
  else
  {
    this.isServiceDisabled = false;
    this.noOfIndex = ["1","5","f"];
  }
}



setService(businessServiceId)
{
  if (businessServiceId !== null || businessServiceId !== undefined) {
    if (this.businessServices != undefined && this.businessServices != null) {
      this.businessService = this.businessServices.find((data) => data.id === businessServiceId);

      this.todos.businessServiceId = this.businessService.id;
      this.todos.businessServiceName = this.businessService.name;
     }
  }
}

setRoom(roomId: number) {

    this.roomDetails = [];
  
    if (this.rooms != undefined && this.rooms != null) {
      this.room = this.rooms.find((room) => room.id === roomId);
  
      if (
        this.room != undefined &&
        this.room != null
      ) {
        this.todos.roomName = this.room.name;
        this.roomDetails =  this.room.roomDetails;
      }
    }
  }

  onEmpDetailsSelected(data)
  {
   this.customerSearchResult = "";
   this.todos.assignedTo = undefined;
   this.todos.employeeId = undefined;
   this.todos.assignedToContact = undefined;
 
   this.todos.assignedTo = data.firstName+' '+data.lastName;
   this.todos.employeeId = data.id;
   this.todos.assignedToContact = data.phoneNumber;
 
   this.isShowCustomerList = false;
  }
 
  onCustomerDetailsSelected(data)
  {
   this.customerSearchResult = "";
   this.todos.firstName = undefined;
   this.todos.lastName = undefined;
   this.todos.guestPhotoUrl = undefined;
   this.todos.mobile = undefined;
   this.todos.email = undefined;
   this.todos.customerId = undefined;
 
   this.todos.firstName = data.firstName;
   this.todos.lastName = data.lastName;
   this.todos.guestPhotoUrl = data.imageUrl;
   this.todos.email = data.email;
   this.todos.mobile = data.mobile;
   this.todos.customerId = data.id;
 
   if(data.imageUrl != null && data.imageUrl != undefined)
   {
     this.logoUrl = data.imageUrl;
   }
   else
   {
     this.logoUrl = "assets/img/user_profile.svg";
   }
   this.isShowCustomerList = false;
   this.isReadOnlyCustomerInfo = true;
 
   if(this.todos.mobile != null && this.todos.mobile != undefined)
   {
      this.setMobileNumberByCode(this.todos.mobile);
   }
  }

  onCustomerSearchReset()
  {
   this.customerSearchResult = "";
   this.todos.firstName = undefined;
   this.todos.lastName = undefined;
   this.todos.guestPhotoUrl = undefined;
   this.todos.mobile = undefined;
   this.todos.email = undefined;
   this.todos.customerId = undefined;
   this.logoUrl = "assets/img/user_profile.svg";
   this.isReadOnlyCustomerInfo = false;
   this.PhoneNumberWithoutCode ="";
  }
 

  setMobileNumberByCode(phoneNumber)
  {
     let countryOb = this.CountryArray.countries.find((data) => data.countryCode === phoneNumber.substring(0, data.countryCode.length));
     this.countryCode = countryOb.countryCode;
     this.PhoneNumberWithoutCode = phoneNumber.substring(this.countryCode.length);
     this.changeDetectorRefs.detectChanges();
  }

  applyFilterEmp(ev: any)
  {
    let filterValue = ev.target.value;
    filterValue = filterValue.trim().toLowerCase();


   if (filterValue === '') {
     this.employees = this.employeesFilter;
     this.isShowCustomerList =  false;
     this.changeDetectorRefs.detectChanges();
   }
   else {
     this.isShowCustomerList =  true;
     this.employees = this.employeesFilter;
     this.employees = this.employees.filter((item) => {

       const searchResult = (
         (item.firstName != null && (item.firstName).toLowerCase().trim().indexOf(filterValue) > -1) ||
         ( item.lastName && (item.lastName).toLowerCase().trim().indexOf(filterValue) > -1) ||
         (item.email != null && item.email.toLowerCase().indexOf(filterValue) > -1) ||
         (item.phoneNumber != null && item.phoneNumber.toLowerCase().indexOf(filterValue) > -1)
       )

       return searchResult;
     })

     this.changeDetectorRefs.detectChanges();

   }

  }

getItems(ev: any) {

    let filterValue = ev.target.value;
    filterValue = filterValue.trim().toLowerCase();

    if (filterValue === '') {
        this.customers = this.customersFilter;
        this.isShowCustomerList =  false;
        this.changeDetectorRefs.detectChanges();
      }
      else {
        this.isShowCustomerList =  true;
        this.customers = this.customersFilter;
        this.customers = this.customers.filter((item) => {
   
          const searchResult = (
            (item.firstName != null && (item.firstName).toLowerCase().trim().indexOf(filterValue) > -1) ||
            ( item.lastName && (item.lastName).toLowerCase().trim().indexOf(filterValue) > -1) ||
            (item.email != null && item.email.toLowerCase().indexOf(filterValue) > -1) ||
            (item.mobile != null && item.mobile.toLowerCase().indexOf(filterValue) > -1)
          )
   
          return searchResult;
        })
   
        this.changeDetectorRefs.detectChanges();
   
      }
  }

  setCountry(countryName) {
    if (!this.country.valid) {
      this.bookingContact.disable();
    } else {
      this.bookingContact.enable();
    }

    // this.countryCodePlaceHolder = this.countryCode;
  }


  clear(event) {

  }

onNext()
{
   let currentIndex = this.noOfIndex.indexOf(this.Selection);

   let nextIndex = currentIndex+1 % this.noOfIndex.length;
   this.Selection = this.noOfIndex[nextIndex];
//    console.log('let currentIndex '+ currentIndex+' nextIndex '+ nextIndex+' this.noOfIndex.length '+ this.noOfIndex.length);

//    if(nextIndex != 0)
//    {
//      
//    }
   
}

onBack()
{
    let currentIndex = this.noOfIndex.indexOf(this.Selection);

    let nextIndex = currentIndex-1 % this.noOfIndex.length;
    this.Selection = this.noOfIndex[nextIndex];
}

finish()
{
   this.submit();
}

submit()
{
    if(this.todos.id === undefined || this.todos.id === null)
    {
      this.todos.done = false;
      this.todos.seen = false;
      this.todos.selected = false;
      this.todos.important = false;
    }
  
    if(this.PhoneNumberWithoutCode !=null && this.PhoneNumberWithoutCode !=undefined)
    {
        this.todos.mobile = this.countryCode + this.PhoneNumberWithoutCode;
    }
  
  
    if(this.roomNumbers != null && this.roomNumbers != undefined && this.roomNumbers.length >0)
    {
      this.todos.roomNo = this.roomNumbers.toString()
    }
  
    this.todos.propertyId = Number(this.token.getPropertyId());
    this.todos.applicationUserId = Number(this.token.getUserId());
  
    if(this.todos.startDate != null && this.todos.startDate != undefined){
      this.todos.startDate = this.dateService.convertMillisecondsToYYYMMDDFormat(
        this.todos.startDate
    );
    }
  
    if(this.todos.dueDate != null && this.todos.dueDate != undefined){
      this.todos.dueDate = this.dateService.convertMillisecondsToYYYMMDDFormat(
        this.todos.dueDate
    );
    }
  
    if(this.todos.checkInDate != null && this.todos.checkInDate != undefined){
      this.todos.checkInDate = this.dateService.convertMillisecondsToYYYMMDDFormat(
        this.todos.checkInDate
    );
    }
  
    if(this.todos.checkOutDate != null && this.todos.checkOutDate != undefined){
      this.todos.checkOutDate = this.dateService.convertMillisecondsToYYYMMDDFormat(
        this.todos.checkOutDate
    );
    }

  this.loader = true;
    this.todosService.saveTodos(this.todos).subscribe(data => {

      this.loader = false;
      if(data.status === 200 )
      {
          if(this.todos.id === undefined || this.todos.id === null)
          {
            this.presentToast(
                "Todos created successfully"
            );
          }
          else
          {
            this.presentToast(
                "Todos updated successfully"
            );
          }
        this._location.back();
      }
      this.changeDetectorRefs.detectChanges();
      // Logger.log(JSON.stringify( this.businessServices));
    }, error => {
      this.loader = false;
    });
}

async presentToast(Message: string) {
    const toast = await this.toastController.create({
        message: Message,
        duration: 2000,
    });
    toast.present();
}



}
